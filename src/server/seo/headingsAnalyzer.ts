import { CheerioAPI } from 'cheerio'

export async function analyzeHeadings($: CheerioAPI) {
  const h1 = $('h1').length
  const h2 = $('h2').length
  const h3 = $('h3').length
  
  console.log(`[HEADINGS_ANALYZER] Extracted: H1:${h1}, H2:${h2}, H3:${h3}`)
  
  return {
    h1Count: h1,
    h2Count: h2,
    h3Count: h3,
    all: { h1, h2, h3 }
  }
}
