export interface ExtractData {
  title: string
  meta: string
  headings: Record<string, number>
}

export interface Issue {
  id: string
  type: 'error' | 'warning' | 'info'
  message: string
}

export function calculateSeoScore(data: ExtractData): { score: number; issues: Issue[] } {
  let score = 100
  const issues: Issue[] = []

  // No title (-20)
  if (!data.title || data.title.trim() === '') {
    score -= 20
    issues.push({ id: 'no-title', type: 'error', message: 'Missing page title' })
  } 
  // Bad title length (-10)
  else if (data.title.length < 10 || data.title.length > 60) {
    score -= 10
    issues.push({ id: 'bad-title-length', type: 'warning', message: 'Main title should ideally be between 10 and 60 characters.' })
  }

  // No meta (-15)
  if (!data.meta || data.meta.trim() === '') {
    score -= 15
    issues.push({ id: 'no-meta', type: 'error', message: 'Missing meta description' })
  }

  const h1Count = data.headings['h1'] || 0
  
  // No H1 (-15)
  if (h1Count === 0) {
    score -= 15
    issues.push({ id: 'no-h1', type: 'error', message: 'Missing H1 heading' })
  } 
  // Multiple H1 (-10)
  else if (h1Count > 1) {
    score -= 10
    issues.push({ id: 'multiple-h1', type: 'warning', message: 'Multiple H1 headings found. Use only one per page.' })
  }

  return {
    score: Math.max(0, score),
    issues
  }
}
