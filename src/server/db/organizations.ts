'use server'

import { createClient } from '@/shared/lib/supabase/server'
import crypto from 'node:crypto'

export async function createOrganization(name: string) {
  const supabase = await createClient()
  const { data: org, error } = await supabase.rpc('create_organization_with_owner', {
    org_name: name
  })

  if (error) throw error
  return org
}

export async function getUserOrganizations(limit = 10, offset = 0) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('memberships')
    .select(`
      role,
      organizations (
        id,
        name,
        owner_id
      )
    `)
    .eq('user_id', user.id)
    .range(offset, offset + limit - 1)
  
  if (error) throw error
  return data.map((m: any) => ({ ...m.organizations, role: m.role }))
}

export async function inviteUser(email: string, orgId: string, role: 'admin' | 'member') {
  const supabase = await createClient()
  const token = crypto.randomBytes(32).toString('hex')
  
  const { data, error } = await supabase
    .from('invitations')
    .insert({
      email: email.toLowerCase(),
      organization_id: orgId,
      role,
      token,
      invited_by: (await supabase.auth.getUser()).data.user?.id
    })

  if (error) throw error
  return data
}

export async function acceptInvitation(token: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('accept_invitation', {
    invite_token: token
  })

  if (error) throw error
  return data
}

export async function updateLastActiveOrg(orgId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase
    .from('user_settings')
    .upsert({ user_id: user.id, last_org_id: orgId, updated_at: new Date().toISOString() })
  
  if (error) throw error
}

// Role Helpers (Server-side side)
export const canManageMembers = async (role: string) => ['owner', 'admin'].includes(role)
export const isOwner = async (role: string) => role === 'owner'
