'use server'

import { createClient } from '@/shared/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteReport(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // First, check organization affiliation of this report safely
  const { data: report } = await supabase
    .from('seo_reports')
    .select('organization_id, user_id')
    .eq('id', id)
    .single()

  if (!report) throw new Error('Report not found')

  if (report.organization_id) {
    const { data: membership } = await supabase
      .from('memberships')
      .select('role')
      .eq('organization_id', report.organization_id)
      .eq('user_id', user.id)
      .single()

    if (!membership || membership.role === 'member') {
      throw new Error('Forbidden: Only admin or owner can delete org reports')
    }
  } else {
    // Individual
    if (report.user_id !== user.id) {
      throw new Error('Forbidden: Cannot delete other users reports')
    }
  }

  // Delete via DB (requires updated RLS allowing admins)
  const { error } = await supabase.from('seo_reports').delete().eq('id', id)
  if (error) throw error

  revalidatePath('/seo')
  return true
}
