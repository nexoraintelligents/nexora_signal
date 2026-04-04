import * as cheerio from 'cheerio'
import pLimit from 'p-limit'

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

export async function analyzeImages(baseUrl: string, $: cheerio.CheerioAPI): Promise<ImageAnalysisResult> {
  const images: ImageInfo[] = []

  // 1. Extract Images
  $('img').each((_, el) => {
    let src = $(el).attr('src')
    const alt = $(el).attr('alt') || null
    
    // Support lazy loading attributes
    const lazySrc = $(el).attr('data-src') || $(el).attr('data-lazy-src') || $(el).attr('data-original') || $(el).attr('srcset')?.split(' ')[0]
    
    if (lazySrc) {
        src = lazySrc
    }

    if (src) {
      // Skip very small data URIs (likely spacers/placeholders)
      if (src.startsWith('data:') && src.length < 200) {
          return
      }

      try {
        const absoluteUrl = new URL(src, baseUrl)
        images.push({
          src: absoluteUrl.href,
          alt,
          size: null,
          isLarge: false,
          hasAlt: !!alt && alt.trim().length > 0
        })
      } catch (e) {
        // Invalid URL
      }
    }
  })

  // 2. Detect Large Images (Max 15 checks as per requirements)
  const limit = pLimit(5)
  const uniqueImages = Array.from(new Set(images.map(img => img.src)))
  const imagesToCheck = uniqueImages.slice(0, 15)
  
  const LARGE_IMAGE_THRESHOLD = 100 * 1024 // 100KB
  const sizeMap: Record<string, { size: number | null, isLarge: boolean }> = {}

  const checkImageSize = async (src: string) => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      const response = await fetch(src, {
        method: 'HEAD',
        signal: controller.signal,
        headers: { 'User-Agent': 'NexoraBot/1.0' }
      }).catch(() => null)

      clearTimeout(timeoutId)

      if (response && response.ok) {
        const contentLength = response.headers.get('Content-Length')
        if (contentLength) {
          const size = parseInt(contentLength, 10)
          sizeMap[src] = {
            size,
            isLarge: size > LARGE_IMAGE_THRESHOLD
          }
        } else {
            // Handle missing Content-Length by trying GET with limited bytes if possible?
            // For now, mark as unknown size
            sizeMap[src] = { size: null, isLarge: false }
        }
      }
    } catch (e) {
      sizeMap[src] = { size: null, isLarge: false }
    }
  }

  await Promise.all(imagesToCheck.map(src => limit(() => checkImageSize(src))))

  // Apply sizes back to images array
  images.forEach(img => {
      if (sizeMap[img.src]) {
          img.size = sizeMap[img.src].size
          img.isLarge = sizeMap[img.src].isLarge
      }
  })

  return {
    totalCount: images.length,
    missingAltCount: images.filter(img => !img.hasAlt).length,
    largeImagesCount: images.filter(img => img.isLarge).length,
    images
  }
}
