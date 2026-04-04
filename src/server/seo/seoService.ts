import { parseUrl } from './analyzer'
import { createReportRecord, updateReportRecord, getRecentReport } from '../db/seoReports'

export async function analyzeAndStore(url: string, userId: string, orgId: string) {
  const startTime = Date.now()
  
  // 1. Race-Condition Safe Deduplication Check
  try {
    const existing = await getRecentReport(url, orgId, 10)
    
    // If a report exists (completed or pending), return it to avoid duplicate work
    if (existing) {
      if (existing.status === 'completed' && existing.report) {
        return existing.report
      }
      if (existing.status === 'pending') {
        // Return a mock success so the UI knows it's being handled
        return { status: 'pending', id: existing.id, message: 'Analysis already in progress' }
      }
    }
  } catch (err) {
    console.warn('Deduplication check failed:', err)
  }

  // 2. Create Pending Record
  let record: any = null
  try {
    record = await createReportRecord({
      url,
      user_id: userId,
      organization_id: orgId,
      status: 'pending',
      is_async: false
    })
  } catch (err) {
    console.error('SEO_RECORD_CREATION_FAILED', { url, error: err })
  }

  try {
    // 3. Analysis with 15s Timeout Protection
    const analysisPromise = parseUrl(url)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Analysis timed out after 15 seconds')), 15000)
    )

    const result = await Promise.race([analysisPromise, timeoutPromise]) as any
    const processingTime = Date.now() - startTime

    console.log('[SEO_SERVICE_RESULT_DEBUG]', {
      url,
      hasData: !!result.data,
      hasPageSpeed: !!result.data?.pageSpeed,
      keywordsCount: result.data?.keywords?.length,
      advancedKeys: Object.keys(result.advanced || {})
    })

    // 4. Update Record on Success
    if (record?.id) {
      const summary = {
        meta: result.advanced.breakdown.meta,
        content: result.advanced.breakdown.content,
        performance: result.advanced.breakdown.performance,
        technical: result.advanced.breakdown.technical,
      }

      await updateReportRecord(record.id, {
        status: 'completed',
        score: result.score,
        summary,
        report: result,
        processing_time_ms: processingTime
      })
    }

    return result
  } catch (error: any) {
    console.error('SEO_ANALYSIS_FAILED', { url, error: error.message || error })
    
    // 5. Update Record on Failure
    if (record?.id) {
      await updateReportRecord(record.id, {
        status: 'failed'
      })
    }
    throw error
  }
}
