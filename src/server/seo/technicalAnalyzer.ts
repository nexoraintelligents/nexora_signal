import { TechnicalSeoData } from '../../features/seo/types'

export async function analyzeTechnical(url: string, html: string): Promise<TechnicalSeoData> {
  const issues: string[] = []
  const baseUrl = new URL(url).origin
  
  // 1. Robots.txt check
  const robotsRes = await fetch(`${baseUrl}/robots.txt`).catch(() => null)
  const robotsTxt = robotsRes?.ok ? await robotsRes.text() : null
  const hasRobots = !!robotsTxt
  
  if (!hasRobots) issues.push("Missing robots.txt file")
  
  // 1.1 Check for Disallow: / (Critical indexing issue)
  const isDisallowed = robotsTxt?.includes('Disallow: /') && !robotsTxt?.includes('Allow: /')
  if (isDisallowed) issues.push("Critical: Site is disallowed from crawling in robots.txt")

  // 2. Sitemap check (including robots.txt parsing)
  let hasSitemap = false
  const sitemapFromRobots = robotsTxt?.match(/Sitemap:\s*(https?:\/\/\S+)/i)
  if (sitemapFromRobots) {
    hasSitemap = true
  } else {
    const sitemapRes = await fetch(`${baseUrl}/sitemap.xml`).catch(() => null)
    hasSitemap = !!sitemapRes?.ok
  }
  
  if (!hasSitemap) issues.push("No XML sitemap detected")

  // 3. Canonical Check
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)
  const canonicalUrl = canonicalMatch ? canonicalMatch[1] : null
  const multipleCanonicals = (html.match(/rel=["']canonical["']/gi) || []).length > 1
  
  if (!canonicalUrl) issues.push("Missing canonical tag")
  if (multipleCanonicals) issues.push("Multiple canonical tags detected")

  // Canonical Normalization Check
  if (canonicalUrl) {
    const normalizedTarget = normalizeUrl(url)
    const normalizedCanonical = normalizeUrl(canonicalUrl)
    if (normalizedTarget !== normalizedCanonical) {
      issues.push("Canonical URL does not match the current URL")
    }
  }

  // 4. Indexing check (noindex)
  const hasNoIndex = /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex[^"']*["']/i.test(html)
  if (hasNoIndex) issues.push("Meta robots 'noindex' detected")

  // 5. URL Structure
  const urlObj = new URL(url)
  const isFriendly = /^[a-z0-9-\/.]+$/i.test(urlObj.pathname)
  const depth = urlObj.pathname.split('/').filter(Boolean).length

  if (!isFriendly) issues.push("URL contains non-SEO friendly characters")
  if (urlObj.pathname.length > 100) issues.push("URL is too long (> 100 chars)")
  if (depth > 4) issues.push("URL structure is too deep")

  return {
    indexing: {
      robotsTxt: hasRobots,
      sitemap: hasSitemap,
      indexable: !hasNoIndex && !isDisallowed
    },
    canonical: {
      exists: !!canonicalUrl,
      multiple: multipleCanonicals,
      url: canonicalUrl
    },
    url: {
      length: url.length,
      isSeoFriendly: isFriendly,
      depth: depth
    },
    issues
  }
}

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url)
    let path = u.pathname.replace(/\/$/, '') // Remove trailing slash
    if (path === '') path = '/'
    return `${u.protocol}//${u.hostname}${path}${u.search}`.toLowerCase()
  } catch {
    return url.toLowerCase()
  }
}
