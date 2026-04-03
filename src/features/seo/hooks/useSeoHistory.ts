'use client'

import { useQuery } from '@tanstack/react-query'
import { getSeoReportsPaginated } from '../api/getReportsPaginated'

export function useSeoHistory(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['seo-history', page, limit],
    queryFn: async () => {
      return await getSeoReportsPaginated(page, limit)
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
