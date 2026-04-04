import * as cheerio from 'cheerio'
import pLimit from 'p-limit'

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

export async function analyzeLinks(baseUrl: string, $: cheerio.CheerioAPI): Promise<LinkAnalysisResult> {
  const base = new URL(baseUrl)
  const links: { url: string; isExternal: boolean }[] = []

  // 1. Extract Links
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href')
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return
    }

    try {
      const absoluteUrl = new URL(href, baseUrl)
      // Normalize URL (remove hash)
      absoluteUrl.hash = ''
      
      const isExternal = absoluteUrl.hostname !== base.hostname
      links.push({ url: absoluteUrl.href, isExternal })
    } catch (e) {
      // Ignore invalid URLs
    }
  })

  // 2. Classify and Count
  const internalLinks = links.filter(l => !l.isExternal)
  const externalLinks = links.filter(l => l.isExternal)

  // 3. Detect Broken Links (Max 20, concurrency control)
  // We prioritize external links for broken link detection as they are more likely to break, 
  // but we also check some internal ones.
  const linksToCheck = Array.from(new Set(links.map(l => l.url))).slice(0, 20)
  
  const limit = pLimit(5) // Concurrency of 5
  
  const brokenLinks: BrokenLink[] = []

  const checkLink = async (url: string) => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      let response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'NexoraBot/1.0'
        }
      }).catch(() => null)

      // Fallback to GET if HEAD fails or is not allowed
      if (!response || !response.ok) {
        response = await fetch(url, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'User-Agent': 'NexoraBot/1.0'
          }
        }).catch(() => null)
      }

      clearTimeout(timeoutId)

      if (!response || !response.ok) {
        brokenLinks.push({
          url,
          status: response ? response.status : 'timeout/error'
        })
      }
    } catch (error) {
      brokenLinks.push({
        url,
        status: 'error'
      })
    }
  }

  await Promise.all(linksToCheck.map(url => limit(() => checkLink(url))))

  return {
    internalCount: internalLinks.length,
    externalCount: externalLinks.length,
    totalLinks: links.length,
    internalLinks: Array.from(new Set(internalLinks.map(l => l.url))).slice(0, 100),
    externalLinks: Array.from(new Set(externalLinks.map(l => l.url))).slice(0, 100),
    brokenLinks
  }
}
