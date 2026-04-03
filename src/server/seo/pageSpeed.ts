import { PageSpeedMetrics, MetricValue } from '@/features/seo/types'

const PAGESPEED_API_KEY = process.env.PAGESPEED_API_KEY
const CACHE_TTL = 60 * 60 * 1000 // 1 hour in ms

interface CacheEntry {
  data: PageSpeedMetrics
  expiry: number
}

const memoryCache = new Map<string, CacheEntry>()

function getStatus(score: number): 'good' | 'needs-improvement' | 'poor' {
  if (score >= 0.9) return 'good'
  if (score >= 0.5) return 'needs-improvement'
  return 'poor'
}

export async function getPageSpeedMetrics(url: string): Promise<PageSpeedMetrics | null> {
  // Check cache
  const cached = memoryCache.get(url)
  if (cached && cached.expiry > Date.now()) {
    return cached.data
  }

  try {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=PERFORMANCE${PAGESPEED_API_KEY ? `&key=${PAGESPEED_API_KEY}` : ''}`
    
    const response = await fetch(apiUrl)
    if (!response.ok) throw new Error(`PageSpeed API failed: ${response.statusText}`)
    
    const json = await response.json()
    const lighthouse = json.lighthouseResult
    const audits = lighthouse.audits

    const metrics: PageSpeedMetrics = {
      score: Math.round(lighthouse.categories.performance.score * 100),
      lcp: {
        value: audits['largest-contentful-paint'].displayValue,
        score: audits['largest-contentful-paint'].score,
        status: getStatus(audits['largest-contentful-paint'].score)
      },
      fcp: {
        value: audits['first-contentful-paint'].displayValue,
        score: audits['first-contentful-paint'].score,
        status: getStatus(audits['first-contentful-paint'].score)
      },
      cls: {
        value: audits['cumulative-layout-shift'].displayValue,
        score: audits['cumulative-layout-shift'].score,
        status: getStatus(audits['cumulative-layout-shift'].score)
      },
      tbt: {
        value: audits['total-blocking-time'].displayValue,
        score: audits['total-blocking-time'].score,
        status: getStatus(audits['total-blocking-time'].score)
      },
      loadingTimeInMs: Math.round(audits['interactive']?.numericValue || 0)
    }

    // Save to cache
    memoryCache.set(url, {
      data: metrics,
      expiry: Date.now() + CACHE_TTL
    })

    return metrics
  } catch (error) {
    console.error('PageSpeed Integration Error:', error)
    return null
  }
}
