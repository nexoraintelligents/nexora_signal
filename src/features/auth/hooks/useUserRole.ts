'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/shared/lib/supabase/client'
import { useActiveOrg } from './useActiveOrg'

export function useUserRole() {
  const { activeOrgId } = useActiveOrg()
  const supabase = createClient()

  return useQuery({
    queryKey: ['user-role', activeOrgId],
    queryFn: async () => {
      if (!activeOrgId) return 'owner'

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data } = await supabase
        .from('memberships')
        .select('role')
        .eq('organization_id', activeOrgId)
        .eq('user_id', user.id)
        .single()

      return data?.role || null
    },
    enabled: true
  })
}
