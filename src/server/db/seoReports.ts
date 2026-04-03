'use server'

import { createClient } from '@/shared/lib/supabase/server'
import { SeoReport } from '@/features/seo/types'

export interface SeoReportRecord {
  id: string
  user_id: string
  organization_id: string
  url: string
  score: number | null
  status: 'pending' | 'completed' | 'failed' | 'completed_with_warnings'
  summary: any | null
  report: any | null
  processing_time_ms: number | null
  is_async: boolean
  created_at: string
}

export async function createReportRecord(data: {
  url: string
  user_id: string
  organization_id: string
  status?: 'pending' | 'completed' | 'failed' | 'completed_with_warnings'
  is_async?: boolean
}) {
  const supabase = await createClient()
  const { data: record, error } = await supabase
    .from('seo_reports')
    .insert([data])
    .select()
    .single()

  if (error) throw error
  return record as SeoReportRecord
}

export async function getRecentReport(url: string, orgId: string, minutes = 10) {
  const supabase = await createClient()
  const threshold = new Date(Date.now() - minutes * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('seo_reports')
    .select('*')
    .eq('url', url)
    .eq('organization_id', orgId)
    .gt('created_at', threshold)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') throw error
  return data as SeoReportRecord | null
}

export async function updateReportRecord(id: string, updates: {
  status: 'pending' | 'completed' | 'failed' | 'completed_with_warnings'
  score?: number
  summary?: any
  report?: any
  processing_time_ms?: number
}) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('seo_reports')
    .update(updates)
    .eq('id', id)

  if (error) throw error
}

export async function getSeoReports(orgId: string, page = 1, limit = 10) {
  const supabase = await createClient()
  const start = (page - 1) * limit
  const end = start + limit - 1

  const { data, error, count } = await supabase
    .from('seo_reports')
    .select('*', { count: 'exact' })
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })
    .range(start, end)

  if (error) throw error
  return {
    reports: data as SeoReportRecord[],
    total: count || 0,
    page,
    limit
  }
}

export async function getReportById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('seo_reports')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as SeoReportRecord
}
