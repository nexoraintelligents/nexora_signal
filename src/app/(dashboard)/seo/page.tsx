'use client'

import { useSeoReports } from '@/features/seo/hooks/useSeoReports'
import { useUserRole } from '@/features/auth/hooks/useUserRole'
import { deleteReport } from '@/features/seo/api/deleteReport'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'

export default function SeoDashboardPage() {
  const { data: reports, isLoading } = useSeoReports()
  const { data: role } = useUserRole()
  const queryClient = useQueryClient()

  return (
    <div className="max-w-4xl h-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">SEO Reports</h1>
        {role !== 'member' && (
          <Link href="/seo/analyze" className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition">
            New Analysis
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="text-sm text-gray-500">Loading reports...</div>
      ) : reports?.length === 0 ? (
        <div className="p-8 border border-gray-200 rounded-md bg-white text-center">
          <p className="text-sm text-gray-500">No SEO reports found. Start by running a new analysis.</p>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-md bg-white overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-900">URL</th>
                <th className="px-6 py-3 font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 font-semibold text-gray-900 text-right">Score</th>
                {role !== 'member' && <th className="px-6 py-3"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports?.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-800 font-medium truncate max-w-sm">{report.url}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(report.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right font-medium">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${
                      report.score > 80 ? 'bg-green-100 text-green-700' :
                      report.score >= 50 ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {report.score}/100
                    </span>
                  </td>
                  {role !== 'member' && (
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={async () => {
                          if (confirm('Delete this report?')) {
                            await deleteReport(report.id)
                            queryClient.invalidateQueries({ queryKey: ['seo-reports'] })
                          }
                        }}
                        className="text-xs font-semibold text-red-600 hover:text-red-800 transition"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
