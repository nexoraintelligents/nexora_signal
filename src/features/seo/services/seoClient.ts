import { analyzeUrl } from '../api/analyze'
import { SeoAnalysisResult } from '../types'

export const seoClient = {
  analyze: async (url: string): Promise<SeoAnalysisResult> => {
    try {
      const result = await analyzeUrl(url)
      return result
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'An unexpected error occurred during analysis.' 
      }
    }
  }
}
