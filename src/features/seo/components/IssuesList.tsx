import { SeoIssue } from '../types'

export function IssuesList({ issues }: { issues: SeoIssue[] }) {
  if (!issues || issues.length === 0) {
    return (
      <div className="p-6 text-center border border-gray-200 rounded-md bg-gray-50">
        <p className="text-sm text-gray-600 font-medium">All good! No actionable issues found.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border border-gray-200 bg-white overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-800">Actionable Issues</h3>
        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-gray-200 text-gray-600 tracking-wide">
          {issues.length} items
        </span>
      </div>
      <ul className="divide-y divide-gray-100">
        {issues.map(issue => (
          <li key={issue.id} className="p-5 flex gap-3 hover:bg-gray-50 transition-colors">
            <span className={`inline-flex shrink-0 w-2 h-2 mt-1.5 rounded-full ${
              issue.type === 'error' ? 'bg-red-500' :
              issue.type === 'warning' ? 'bg-amber-500' : 'bg-gray-400'
            }`} />
            <div>
              <p className="text-sm font-medium text-gray-900">{issue.message}</p>
              {issue.details && <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{issue.details}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
