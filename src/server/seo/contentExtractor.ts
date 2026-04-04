import * as cheerio from 'cheerio'

/**
 * Extracts clean text from HTML content, removing noisy tags like script, style, nav, and footer.
 */
export function extractCleanText(html: string): string {
  const $ = cheerio.load(html)

  // Remove elements that don't contribute to keyword density
  $('script, style, nav, footer, noscript, svg, i, button, form').remove()

  // Select the body or main content if available
  const container = $('main').length > 0 ? $('main') : $('body')
  
  // Extract text and clean up whitespace
  const rawText = container.text()
  
  return rawText
    .replace(/\s+/g, ' ') // Collapse multiple spaces/newlines
    .replace(/[^\w\s]/g, '') // Remove punctuation (optional, can handle in tokenizer)
    .trim()
}
