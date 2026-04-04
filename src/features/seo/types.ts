export interface SeoIssue {
  id: string
  type: 'error' | 'warning' | 'info'
  message: string
  details?: string
}

export interface KeywordDensity {
  word: string
  count: number
  percentage: number
}

export interface MetricValue {
  value: string
  score: number
  status: 'good' | 'needs-improvement' | 'poor'
}

export interface PageSpeedMetrics {
  score: number
  lcp: MetricValue
  fcp: MetricValue
  cls: MetricValue
  tbt: MetricValue
  loadingTimeInMs?: number
}

export interface BrokenLink {
  url: string
  status: number | string
}

export interface LinkAnalysisResult {
  internalCount: number
  externalCount: number
  totalLinks: number
  internalLinks: string[]
  externalLinks: string[]
  brokenLinks: BrokenLink[]
}

export interface ImageInfo {
  src: string
  alt: string | null
  size: number | null
  isLarge: boolean
  hasAlt: boolean
}

export interface ImageAnalysisResult {
  totalCount: number
  missingAltCount: number
  largeImagesCount: number
  images: ImageInfo[]

}

export interface SeoRecommendation {
  type: "meta" | "content" | "image" | "link" | "performance"
  message: string
  priority: "high" | "medium" | "low"
}

export interface SeoInsights {
  page: {
    titleLength: number
    metaDescriptionLength: number
    wordCount: number
    loadPerformance: "good" | "average" | "poor"
  }
  meta: {
    title: {
      value: string
      length: number
      status: "good" | "too_short" | "too_long" | "missing"
    }
    description: {
      value: string
      length: number
      status: "good" | "missing" | "too_short" | "too_long"
    }
  }
  headings: {
    h1Count: number
    h2Count: number
    issues: string[]
  }
  content: {
    wordCount: number
    keywordDensity: KeywordDensity[]
    readability: "good" | "average" | "poor"
    issues: string[]
  }
  links: {
    internalCount: number
    externalCount: number
    brokenLinks: BrokenLink[]
    issues: string[]
  }
  images: {
    total: number
    missingAlt: number
    largeImages: number
    issues: string[]
  }
  tags: {
    canonical: boolean
    robotsMeta: boolean
    ogTags: boolean
    twitterCards: boolean
    issues: string[]
  }
}

export interface TechnicalSeoData {
  indexing: {
    robotsTxt: boolean
    sitemap: boolean
    indexable: boolean
  }
  canonical: {
    exists: boolean
    multiple: boolean
    url: string | null
  }
  url: {
    length: number
    isSeoFriendly: boolean
    depth: number
  }
  issues: string[]
}

export interface SeoReportV2 {
  totalScore: number
  pageHealth: "Excellent" | "Good" | "Needs Improvement" | "Poor"
  breakdown: ScoreBreakdown
  insights: SeoInsights
  technical: TechnicalSeoData
  recommendations: SeoRecommendation[]
  scoreDetails: { section: string, score: number, reason: string }[]
  issuesSummary: {
    critical: number
    warnings: number
    passed: number
  }
}

export interface ScoreBreakdown {
  meta: number
  headings: number
  content: number
  links: number
  images: number
  performance: number
  technical: number
}

export interface SeoReportRecord {
  id: string
  url: string
  user_id: string
  organization_id: string
  status: 'pending' | 'completed' | 'failed' | 'completed_with_warnings'
  score: number | null
  summary: any | null
  report: any | null
  processing_time_ms: number | null
  is_async: boolean
  created_at: string
}

export interface SeoReport {
  url: string
  title: string | null
  metaDescription: string | null
  headings: Record<string, number>
  wordCount: number
  keywords: KeywordDensity[]
  links?: LinkAnalysisResult
  images?: ImageAnalysisResult
  loadingTimeInMs?: number
  pageSpeed?: PageSpeedMetrics
  issues: SeoIssue[]
  score: number
  scoreBreakdown?: ScoreBreakdown
  insights?: SeoInsights
  recommendations: SeoRecommendation[]
  status: "Excellent" | "Good" | "Needs Improvement" | "Poor"
  
  // V2 Structure
  version?: "v2"
  advanced?: SeoReportV2
}

export interface SeoAnalysisResult {
  success: boolean
  report?: SeoReport
  error?: string
}
