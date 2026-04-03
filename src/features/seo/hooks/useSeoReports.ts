'use client'

import { useQuery } from '@tanstack/react-query'
import { getSeoReports, DbSeoReport } from '../api/getReports'

export function useSeoReports() {
  return useQuery<DbSeoReport[], Error>({
    queryKey: ['seo-reports'],
    queryFn: async () => {
      return await getSeoReports()
    }
  })
}
