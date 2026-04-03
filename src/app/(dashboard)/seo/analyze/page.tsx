'use client'

import { useSeoAnalysis } from '@/features/seo/hooks/useSeoAnalysis'
import { UrlInput } from '@/features/seo/components/UrlInput'
import { SeoScore } from '@/features/seo/components/SeoScore'
import { IssuesList } from '@/features/seo/components/IssuesList'
import { KeywordDensityChart } from '@/features/seo/components/KeywordDensityChart'
import { PageSpeedCard } from '@/features/seo/components/PageSpeedCard'
import { LinkAnalysisCard } from '@/features/seo/components/LinkAnalysisCard'
import { ImageSeoReport } from '@/features/seo/components/ImageSeoReport'
import { useUserRole } from '@/features/auth/hooks/useUserRole'
import Link from 'next/link'

export default function SeoAnalyzePage() {
  const { data: role, isLoading: roleLoading } = useUserRole()
  const { mutate: analyze, data, isPending, error } = useSeoAnalysis()

  if (!roleLoading && role === 'member') {
    return (
      <div className="max-w-4xl h-full flex flex-col justify-center items-center py-20">
        <div className="p-8 text-center border border-gray-200 rounded-md bg-white">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-sm text-gray-500 mb-6">As a member, you do not have permission to run new SEO analyses.</p>
          <Link href="/seo" className="text-sm text-gray-900 font-medium hover:underline">
            Return to Reports
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className=" space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Link href="/seo" className="text-sm font-medium text-gray-400 hover:text-gray-800 transition-colors">
            ← Back to reports
          </Link>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-6">Analyze URL</h1>
        <UrlInput onAnalyze={(url) => analyze(url)} isLoading={isPending} />
        {error && <p className="text-red-500 text-sm mt-4 font-medium">{error.message}</p>}
      </div>

      {data?.success && data.report && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="md:col-span-2 space-y-6">
            <SeoScore report={data.report} />
            <LinkAnalysisCard data={data.report.links} loading={isPending} />
            <ImageSeoReport data={data.report.images} loading={isPending} />
            <IssuesList issues={data.report.issues} />
          </div>
          <div className="space-y-6">
            <KeywordDensityChart keywords={data.report.keywords} />
            <PageSpeedCard metrics={data.report.pageSpeed} />
          </div>
        </div>
      )}
    </div>
  )
}
