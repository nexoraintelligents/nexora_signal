import { 
  SeoReportV2, 
  ScoreBreakdown, 
  SeoInsights, 
  BrokenLink, 
  SeoRecommendation,
  TechnicalSeoData
} from '../../features/seo/types'

export function calculateSeoScore(data: any) {
  const breakdown: ScoreBreakdown = {
    meta: 0,
    headings: 0,
    content: 0,
    links: 0,
    images: 0,
    performance: 0,
    technical: 0
  }

  const scoreDetails: { section: string, score: number, reason: string }[] = []
  let criticalCount = 0
  let warningCount = 0
  let passedCount = 0

  // 1. Meta Score (20%)
  let metaScore = 100
  let metaReason = "Perfect meta structure"
  if (!data.meta?.title) { metaScore -= 50; criticalCount++ }
  else if (data.meta.title.length < 30 || data.meta.title.length > 60) { metaScore -= 20; warningCount++ }
  if (!data.meta?.description) { metaScore -= 50; criticalCount++ }
  else if (data.meta.description.length < 120 || data.meta.description.length > 160) { metaScore -= 20; warningCount++ }
  
  breakdown.meta = Math.max(0, metaScore)
  if (metaScore < 100) metaReason = metaScore < 50 ? "Critical meta issues detected" : "Meta tags need optimization"
  scoreDetails.push({ section: "meta", score: breakdown.meta, reason: metaReason })

  // 2. Headings Score (10%)
  let headScore = 100
  if (data.headings?.h1Count !== 1) { headScore -= 50; criticalCount++ }
  if (data.headings?.h2Count === 0) { headScore -= 30; warningCount++ }
  breakdown.headings = Math.max(0, headScore)
  scoreDetails.push({ 
    section: "headings", 
    score: breakdown.headings, 
    reason: headScore === 100 ? "Optimal heading hierarchy" : "Heading structure issues" 
  })

  // 3. Content Score (20%)
  let contentScore = 100
  const wordCount = data.content?.wordCount || data.keywords?.wordCount || 0
  if (wordCount < 300) { contentScore -= 40; warningCount++ }
  if (wordCount < 100) { contentScore -= 30; criticalCount++ }
  breakdown.content = Math.max(0, contentScore)
  scoreDetails.push({ section: "content", score: breakdown.content, reason: contentScore < 70 ? "Thin content detected" : "Good content depth" })

  // 4. Links Score (10%)
  let linkScore = 100
  const brokenCount = data.links?.brokenLinks?.length || 0
  if (brokenCount > 0) { linkScore -= (brokenCount * 10); criticalCount += brokenCount }
  breakdown.links = Math.max(0, linkScore)
  scoreDetails.push({ section: "links", score: breakdown.links, reason: brokenCount > 0 ? `${brokenCount} broken links found` : "All links healthy" })

  // 5. Images Score (10%)
  let imgScore = 100
  const missingAlt = data.images?.missingAltCount || 0
  if (missingAlt > 0) { imgScore -= Math.min(50, missingAlt * 5); warningCount += missingAlt }
  breakdown.images = Math.max(0, imgScore)
  scoreDetails.push({ section: "images", score: breakdown.images, reason: missingAlt > 0 ? `${missingAlt} images missing alt tags` : "Images fully optimized" })

  // 6. Performance Score (15%)
  let perfScore = data.performance?.score || 50
  if (perfScore < 50) criticalCount++
  else if (perfScore < 90) warningCount++
  breakdown.performance = perfScore
  scoreDetails.push({ section: "performance", score: perfScore, reason: perfScore > 80 ? "Fast load times" : "Performance needs optimization" })

  // 7. Technical Score (15%)
  let techScore = 100
  if (!data.technical?.indexing?.robotsTxt) techScore -= 20
  if (!data.technical?.indexing?.sitemap) techScore -= 20
  if (!data.technical?.indexing?.indexable) { techScore -= 50; criticalCount++ }
  breakdown.technical = Math.max(techScore, 0)
  scoreDetails.push({ section: "technical", score: breakdown.technical, reason: techScore < 80 ? "Technical indexing issues" : "Search engines can crawl easily" })

  // Weighted Final Score
  const totalScore = Math.round(
    (breakdown.meta * 0.20) +
    (breakdown.content * 0.20) +
    (breakdown.performance * 0.15) +
    (breakdown.technical * 0.15) +
    (breakdown.headings * 0.10) +
    (breakdown.links * 0.10) +
    (breakdown.images * 0.10)
  )

  // Generate Insights
  const insights: SeoInsights = {
    page: {
      titleLength: data.meta?.title?.length || 0,
      metaDescriptionLength: data.meta?.description?.length || 0,
      wordCount: wordCount,
      loadPerformance: perfScore > 85 ? "good" : perfScore > 60 ? "average" : "poor"
    },
    meta: {
      title: {
        value: data.meta?.title || "",
        length: data.meta?.title?.length || 0,
        status: !data.meta?.title ? "missing" : (data.meta.title.length < 30 ? "too_short" : data.meta.title.length > 60 ? "too_long" : "good")
      },
      description: {
        value: data.meta?.description || "",
        length: data.meta?.description?.length || 0,
        status: !data.meta?.description ? "missing" : (data.meta.description.length < 120 ? "too_short" : data.meta.description.length > 160 ? "too_long" : "good")
      }
    },
    headings: {
      h1Count: data.headings?.h1Count || 0,
      h2Count: data.headings?.h2Count || 0,
      issues: headScore < 100 ? ["Heading structure is not optimal"] : []
    },
    content: {
      wordCount: wordCount,
      keywordDensity: data.keywords?.keywords || [],
      readability: wordCount > 500 ? "good" : "average",
      issues: contentScore < 70 ? ["Thin content"] : []
    },
    links: {
      internalCount: data.links?.internalCount || 0,
      externalCount: data.links?.externalCount || 0,
      brokenLinks: data.links?.brokenLinks || [],
      issues: brokenCount > 0 ? [`${brokenCount} broken links found`] : []
    },
    images: {
      total: data.images?.totalCount || 0,
      missingAlt: missingAlt,
      largeImages: data.images?.largeImagesCount || 0,
      issues: missingAlt > 0 ? [`${missingAlt} images missing alt text`] : []
    },
    tags: {
      canonical: data.tags?.canonical || false,
      robotsMeta: data.tags?.robotsMeta || false,
      ogTags: data.tags?.ogTags || false,
      twitterCards: data.tags?.twitterCards || false,
      issues: data.tags?.issues || []
    }
  }

  // Final Result
  return {
    score: totalScore,
    advanced: {
      totalScore,
      pageHealth: totalScore > 80 ? "Excellent" : totalScore > 60 ? "Good" : totalScore > 40 ? "Needs Improvement" : "Poor",
      breakdown,
      insights,
      technical: data.technical,
      recommendations: generateRecommendations(insights, breakdown),
      scoreDetails,
      issuesSummary: {
        critical: criticalCount,
        warnings: warningCount,
        passed: passedCount || 10 // Mock for now
      }
    }
  }
}

function generateRecommendations(insights: SeoInsights, breakdown: ScoreBreakdown): SeoRecommendation[] {
  const recs: SeoRecommendation[] = []
  
  if (breakdown.meta < 80) {
    recs.push({ type: "meta", message: "Optimize your meta tags for better CTR.", priority: "high" })
  }
  if (breakdown.content < 70) {
    recs.push({ type: "content", message: "Write more relevant content (min 300 words).", priority: "high" })
  }
  if (breakdown.performance < 50) {
    recs.push({ type: "performance", message: "Improve server response time and optimize assets.", priority: "high" })
  }
  if (breakdown.technical < 80) {
    recs.push({ type: "meta", message: "Fix robots.txt and sitemap issues.", priority: "medium" })
  }

  return recs.sort((a, b) => (a.priority === "high" ? -1 : 1))
}
