'use server'

import { createClient } from '@/shared/lib/supabase/server'
import { getSeoReports as fetchReports } from '@/server/db/seoReports'

export async function getSeoReportsPaginated(page = 1, limit = 10) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { reports: [], total: 0 }

    const { data: settings } = await supabase
      .from('user_settings')
      .select('last_org_id')
      .eq('user_id', user.id)
      .single()

    const orgId = settings?.last_org_id
    if (!orgId) return { reports: [], total: 0 }

    return await fetchReports(orgId, page, limit)
  } catch (error) {
    console.error('Error fetching reports:', error)
    return { reports: [], total: 0 }
  }
}
