import { CheerioAPI } from 'cheerio'

export interface TagAnalysisResult {
  canonical: boolean
  robotsMeta: boolean
  ogTags: boolean
  twitterCards: boolean
  viewport: boolean
  charset: boolean
  favicon: boolean
  issues: string[]
}

export function analyzeTags($: CheerioAPI): TagAnalysisResult {
  const issues: string[] = []
  
  const canonical = $('link[rel="canonical"]').length > 0
  const robotsMeta = $('meta[name="robots"]').length > 0
  const viewport = $('meta[name="viewport"]').length > 0
  const charset = $('meta[charset]').length > 0 || $('meta[http-equiv="Content-Type"]').length > 0
  const favicon = $('link[rel*="icon"]').length > 0

  // OG Tags (basic set)
  const ogTitle = $('meta[property="og:title"]').length > 0
  const ogDescription = $('meta[property="og:description"]').length > 0
  const ogImage = $('meta[property="og:image"]').length > 0
  const ogTags = ogTitle && ogDescription && ogImage

  // Twitter Cards (basic set)
  const twitterCard = $('meta[name="twitter:card"]').length > 0
  const twitterTitle = $('meta[name="twitter:title"]').length > 0
  const twitterCards = twitterCard && twitterTitle

  if (!canonical) issues.push('Missing canonical tag')
  if (!robotsMeta) issues.push('Missing robots meta tag')
  if (!viewport) issues.push('Missing viewport tag for mobile responsiveness')
  if (!charset) issues.push('Missing character set encoding')
  if (!favicon) issues.push('Missing favicon')
  if (!ogTags) issues.push('Missing or incomplete OpenGraph (OG) tags for social sharing')
  if (!twitterCards) issues.push('Missing Twitter Card metadata')

  return {
    canonical,
    robotsMeta,
    ogTags,
    twitterCards,
    viewport,
    charset,
    favicon,
    issues
  }
}
