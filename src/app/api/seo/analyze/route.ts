import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'
import { parseUrl } from '@/server/seo/analyzer'
import { analyzeAndStore } from '@/server/seo/seoService'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    
    // 1. Authenticate User
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { url } = body

    // 2. Validate URL
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return NextResponse.json({ error: 'Invalid or missing URL' }, { status: 400 })
    }

    // 3. Get Active Organization
    let organizationId = null
    
    // Try to get from header first (optional explicit override)
    const headerOrgId = req.headers.get('x-organization-id')
    
    if (headerOrgId) {
      organizationId = headerOrgId
    } else {
      // Fallback to reading the recent active setting from database
      const { data: settings } = await supabase
        .from('user_settings')
        .select('last_org_id')
        .eq('user_id', user.id)
        .single()
        
      if (settings?.last_org_id) {
        organizationId = settings.last_org_id
      }
    }

    if (organizationId) {
      const { data: membership } = await supabase
        .from('memberships')
        .select('role')
        .eq('organization_id', organizationId)
        .eq('user_id', user.id)
        .single()
        
      if (!membership || membership.role === 'member') {
        return NextResponse.json({ error: 'Forbidden: Members cannot run SEO analysis' }, { status: 403 })
      }
    }

    // 4. Run Analyzer Engine & Save (Service Layer handles both)
    const result = await analyzeAndStore(url, user.id, organizationId)

    // Handle deduplication 'pending' case
    if ((result as any).status === 'pending') {
      return NextResponse.json({ 
        status: 'pending', 
        message: 'Analysis already in progress' 
      })
    }

    const { score, advanced, data, version } = result as any

    // 5. Return Data (Consolidated V2 structure)
    return NextResponse.json({
      score,
      version: version || "v2",
      advanced,
      data: {
        ...data,
        url
      }
    })

  } catch (error: any) {
    console.error('SEO API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
