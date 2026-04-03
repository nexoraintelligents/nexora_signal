import { CheerioAPI } from 'cheerio'

export async function analyzeMeta($: CheerioAPI) {
  return {
    title: $('title').text().trim(),
    description: $('meta[name="description"]').attr('content')?.trim() || ''
  }
}
