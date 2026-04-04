-- Organizations Table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    owner_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Memberships Table
CREATE TABLE memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    UNIQUE(user_id, organization_id)
);

-- Invitations Table
CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL CHECK (email = LOWER(email)),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
    token TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invited_by UUID REFERENCES auth.users(id)
);

-- User Settings Table
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    last_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id UUID,
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEO Reports Table
CREATE TABLE seo_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    score INTEGER NOT NULL,
    issues JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RPC for Atomic Org Creation (Safe Version)
CREATE OR REPLACE FUNCTION create_organization_with_owner(org_name TEXT)
RETURNS JSON AS $$
DECLARE
    new_org_id UUID;
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    INSERT INTO organizations (name, owner_id, created_by)
    VALUES (org_name, auth.uid(), auth.uid())
    RETURNING id INTO new_org_id;

    INSERT INTO memberships (user_id, organization_id, role, created_by)
    VALUES (auth.uid(), new_org_id, 'owner', auth.uid());

    RETURN json_build_object('id', new_org_id, 'name', org_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- RPC for Accepting Invitation
CREATE OR REPLACE FUNCTION accept_invitation(invite_token TEXT)
RETURNS JSON AS $$
DECLARE
    invite_record invitations;
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT * INTO invite_record FROM invitations
    WHERE token = invite_token AND status = 'pending' AND expires_at > NOW();

    IF invite_record.id IS NULL THEN
        RAISE EXCEPTION 'Invalid or expired invitation';
    END IF;

    INSERT INTO memberships (user_id, organization_id, role, created_by)
    VALUES (auth.uid(), invite_record.organization_id, invite_record.role, invite_record.invited_by);

    UPDATE invitations SET status = 'accepted' WHERE id = invite_record.id;

    RETURN json_build_object('organization_id', invite_record.organization_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Indexes for Performance & Constraints
CREATE INDEX idx_memberships_user_id ON memberships(user_id);
CREATE INDEX idx_memberships_org_id ON memberships(organization_id);
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE UNIQUE INDEX unique_pending_invite ON invitations(email, organization_id) WHERE status = 'pending';
CREATE INDEX idx_seo_reports_user_id ON seo_reports(user_id);
CREATE INDEX idx_seo_reports_org_id ON seo_reports(organization_id);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_reports ENABLE ROW LEVEL SECURITY;

-- Organizations Policies
CREATE POLICY "Users can view organizations they belong to or own"
ON organizations FOR SELECT
USING (
    owner_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM memberships
        WHERE memberships.organization_id = organizations.id
        AND memberships.user_id = auth.uid()
    )
);

CREATE POLICY "Users can create organizations"
ON organizations FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their organizations"
ON organizations FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Owner can delete organization"
ON organizations FOR DELETE
USING (auth.uid() = owner_id);

-- Memberships Policies
CREATE POLICY "Users can view their own memberships"
ON memberships FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Owner can add memberships"
ON memberships FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM organizations
        WHERE organizations.id = organization_id
        AND organizations.owner_id = auth.uid()
    )
);

CREATE POLICY "Owner can update memberships"
ON memberships FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM memberships m
        WHERE m.organization_id = memberships.organization_id
        AND m.user_id = auth.uid()
        AND m.role = 'owner'
    )
);

CREATE POLICY "Only owner can manage memberships"
ON memberships FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM memberships AS m
        WHERE m.organization_id = memberships.organization_id
        AND m.user_id = auth.uid()
        AND m.role = 'owner'
    )
);

CREATE POLICY "Owner can delete memberships"
ON memberships FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM memberships m
        WHERE m.organization_id = memberships.organization_id
        AND m.user_id = auth.uid()
        AND m.role = 'owner'
    )
);

-- Invitations Policies
CREATE POLICY "Admins and Owners can view invitations"
ON invitations FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM memberships
        WHERE memberships.organization_id = invitations.organization_id
        AND memberships.user_id = auth.uid()
        AND memberships.role IN ('owner', 'admin')
    )
);

CREATE POLICY "Admins and Owners can create invitations"
ON invitations FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM memberships
        WHERE memberships.organization_id = invitations.organization_id
        AND memberships.user_id = auth.uid()
        AND memberships.role IN ('owner', 'admin')
    )
);

-- User Settings Policies
CREATE POLICY "Users can manage their own settings"
ON user_settings FOR ALL
USING (auth.uid() = user_id);

-- SEO Reports Policies
CREATE POLICY "Users can view their own SEO reports"
ON seo_reports FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Org members can view org SEO reports"
ON seo_reports FOR SELECT
USING (
    organization_id IS NOT NULL 
    AND EXISTS (
        SELECT 1 FROM memberships m
        WHERE m.organization_id = seo_reports.organization_id
        AND m.user_id = auth.uid()
    )
);

CREATE POLICY "Users can create their own SEO reports"
ON seo_reports FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own SEO reports"
ON seo_reports FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Org admins can create org SEO reports"
ON seo_reports FOR INSERT
WITH CHECK (
    organization_id IS NOT NULL 
    AND EXISTS (
        SELECT 1 FROM memberships m
        WHERE m.organization_id = seo_reports.organization_id
        AND m.user_id = auth.uid()
        AND m.role IN ('admin', 'owner')
    )
);

CREATE POLICY "Org admins can delete org SEO reports"
ON seo_reports FOR DELETE
USING (
    organization_id IS NOT NULL 
    AND EXISTS (
        SELECT 1 FROM memberships m
        WHERE m.organization_id = seo_reports.organization_id
        AND m.user_id = auth.uid()
        AND m.role IN ('admin', 'owner')
    )
);
