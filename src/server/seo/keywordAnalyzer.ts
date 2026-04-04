import { CheerioAPI } from 'cheerio'
import { KeywordDensity } from '@/features/seo/types'

const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'if', 'in', 'into', 'is', 'it', 'no', 'not', 'of', 'on', 'or', 'such', 'that', 'the', 'their', 'then', 'there', 'these', 'they', 'this', 'to', 'was', 'will', 'with', 'who', 'how', 'where', 'when', 'why', 'which', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'than', 'too', 'very', 'can', 'should', 'would', 'could', 'about', 'above', 'after', 'again', 'against', 'below', 'between', 'down', 'during', 'from', 'further', 'here', 'once', 'only', 'out', 'over', 'through', 'under', 'up'
])

export function analyzeKeywordDensity(text: string): { keywords: KeywordDensity[], wordCount: number } {
  // Tokenize & Clean
  const words = text
    .toLowerCase()
    .split(/\s+/)
    .map(word => word.replace(/[^a-z0-9]/g, ''))
    .filter(word => word.length > 2 && !STOPWORDS.has(word))

  const totalWords = words.length
  if (totalWords === 0) return { keywords: [], wordCount: 0 }

  const frequencyMap: Record<string, number> = {}
  for (const word of words) {
    frequencyMap[word] = (frequencyMap[word] || 0) + 1
  }

  const sortedKeywords = Object.entries(frequencyMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word, count]) => ({
      word,
      count,
      percentage: Number(((count / totalWords) * 100).toFixed(2))
    }))

  return {
    keywords: sortedKeywords,
    wordCount: totalWords
  }
}

export async function extractKeywords($: CheerioAPI) {
  // Try body first, then fall back to full document text
  let text = $('body').text()
  if (!text || text.length < 100) {
    text = $.text()
  }
  return analyzeKeywordDensity(text || '')
}
