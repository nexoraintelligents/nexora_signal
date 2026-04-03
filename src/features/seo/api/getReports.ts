'use server'

import { createClient } from '@/shared/lib/supabase/server'

export interface DbSeoReport {
  id: string
  url: string
  score: number
  created_at: string
}

export async function getSeoReports(): Promise<DbSeoReport[]> {
  try {
    const supabase = await createClient()
    
    // Auth Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    // Get Active Org
    const { data: settings } = await supabase
      .from('user_settings')
      .select('last_org_id')
      .eq('user_id', user.id)
      .single()

    let query = supabase
      .from('seo_reports')
      .select('id, url, score, created_at')
      .order('created_at', { ascending: false })

    if (settings?.last_org_id) {
      query = query.eq('organization_id', settings.last_org_id)
    } else {
      query = query.eq('user_id', user.id).is('organization_id', null)
    }

    const { data, error } = await query

    if (error) {
      console.error('Failed to fetch reports:', error)
      return []
    }

    return data as DbSeoReport[]
  } catch (error) {
    console.error('Error in getSeoReports:', error)
    return []
  }
}
