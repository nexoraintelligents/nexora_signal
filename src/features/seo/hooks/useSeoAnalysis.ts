'use client'

import { useMutation } from '@tanstack/react-query'
import { seoClient } from '../services/seoClient'
import { SeoAnalysisResult } from '../types'

export function useSeoAnalysis() {
  return useMutation<SeoAnalysisResult, Error, string>({
    mutationFn: async (url: string) => {
      const result = await seoClient.analyze(url)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    }
  })
}
