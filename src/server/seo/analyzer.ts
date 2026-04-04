import * as cheerio from 'cheerio'
import { analyzeMeta } from './metaAnalyzer'
import { analyzeHeadings } from './headingsAnalyzer'
import { extractKeywords } from './keywordAnalyzer'
import { analyzeLinks } from './linkAnalyzer'
import { analyzeImages } from './imageAnalyzer'
import { analyzeTags } from './tagAnalyzer'
import { getPageSpeedMetrics } from './pageSpeed'
import { analyzeTechnical } from './technicalAnalyzer'
import { calculateSeoScore } from './scoreEngine'

async function fetchHtml(url: string): Promise<string> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'NexoraSignalBot/1.0 (SEO Analysis Engine)'
      }
    })
    clearTimeout(timeoutId)
    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`)
    return await response.text()
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

export async function parseUrl(url: string) {
  const html = await fetchHtml(url)
  const $ = cheerio.load(html)
  let partialFailure = false

  const wrapAnalyzer = async (fn: () => Promise<any> | any, name: string) => {
    try {
      const res = await fn()
      if (res === null || res === undefined) partialFailure = true
      return res
    } catch (err) {
      console.error(`Analyzer [${name}] failed:`, err)
      partialFailure = true
      return null
    }
  }

  // Run all analyzers in parallel
  const [
    meta,
    headings,
    keywords,
    links,
    images,
    tags,
    pageSpeed,
    technical
  ] = await Promise.all([
    wrapAnalyzer(() => analyzeMeta($), 'meta'),
    wrapAnalyzer(() => analyzeHeadings($), 'headings'),
    wrapAnalyzer(() => extractKeywords($), 'keywords'),
    wrapAnalyzer(() => analyzeLinks(url, $), 'links'),
    wrapAnalyzer(() => analyzeImages(url, $), 'images'),
    wrapAnalyzer(() => analyzeTags($), 'tags'),
    wrapAnalyzer(() => getPageSpeedMetrics(url), 'pagespeed'),
    wrapAnalyzer(() => analyzeTechnical(url, html), 'technical')
  ])

  console.log(`[SEO_ANALYZER] Completed scan for ${url}`, {
    hasKeywords: !!keywords,
    wordCount: keywords?.wordCount,
    hasPageSpeed: !!pageSpeed,
    partialFailure
  })

  // Calculate final score using the modular engine
  const auditResult = calculateSeoScore({
    meta,
    headings,
    keywords,
    links,
    images,
    tags,
    performance: pageSpeed,
    technical
  })

  return {
    version: "v2",
    score: auditResult.score,
    partialFailure,
    advanced: auditResult.advanced,
    links,
    images,
    pageSpeed,
    keywords: keywords?.keywords || [],
    // Legacy compatibility layer
    data: {
      title: meta?.title || '',
      meta: meta?.description || '',
      headings: { 
        h1: headings?.h1Count || 0, 
        h2: headings?.h2Count || 0 
      },
      keywords: keywords?.keywords || [],
      wordCount: keywords?.wordCount || 0,
      pageSpeed: pageSpeed || undefined,
      links,
      images,
      tags
    }
  }
}
