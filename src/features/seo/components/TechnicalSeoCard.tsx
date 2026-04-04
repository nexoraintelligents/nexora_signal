import React from 'react'
import { TechnicalSeoData } from '../types'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Globe, 
  Search, 
  Link as LinkIcon, 
  Info
} from 'lucide-react'

interface TechnicalSeoCardProps {
  data?: TechnicalSeoData
}

export function TechnicalSeoCard({ data }: TechnicalSeoCardProps) {
  if (!data) return null

  const getStatusIcon = (status: boolean) => status 
    ? <CheckCircle className="w-5 h-5 text-emerald-500" />
    : <XCircle className="w-5 h-5 text-red-500" />

  const getIndexableBadge = (isIndexable: boolean) => isIndexable
    ? <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Indexable</span>
    : <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">No Index</span>

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="p-5 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
            <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-zinc-100">Technical SEO</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-500">Indexing, Crawlability, and URL Health</p>
          </div>
        </div>
        {getIndexableBadge(data.indexing.indexable)}
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Indexing Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4" /> Indexing
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-zinc-400">robots.txt</span>
              {getStatusIcon(data.indexing.robotsTxt)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-zinc-400">Sitemap XML</span>
              {getStatusIcon(data.indexing.sitemap)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-zinc-400">Search Ready</span>
              {getStatusIcon(data.indexing.indexable)}
            </div>
          </div>
        </div>

        {/* Canonical Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <LinkIcon className="w-4 h-4" /> Canonicalization
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-zinc-400">Tag Exists</span>
              {getStatusIcon(data.canonical.exists)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-zinc-400">Unique (No Dups)</span>
              {getStatusIcon(!data.canonical.multiple)}
            </div>
            {data.canonical.url && (
              <div className="pt-2">
                <p className="text-[10px] text-gray-400 mb-1 uppercase font-bold">Primary URL</p>
                <div className="text-[11px] font-mono bg-gray-50 dark:bg-zinc-950 p-2 rounded truncate border border-gray-100 dark:border-zinc-800 text-gray-500">
                  {data.canonical.url}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* URL Health Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Info className="w-4 h-4" /> URL Health
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-zinc-400">SEO Friendly</span>
              {getStatusIcon(data.url.isSeoFriendly)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-zinc-400">URL Length</span>
              <span className={`text-sm font-bold ${data.url.length > 100 ? 'text-amber-500' : 'text-emerald-500'}`}>
                {data.url.length} chars
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-zinc-400">Folder Depth</span>
              <span className="text-sm font-bold text-gray-700 dark:text-zinc-300">
                Level {data.url.depth}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Issues Footer */}
      {data.issues.length > 0 && (
        <div className="px-6 py-4 bg-red-50/50 dark:bg-red-900/10 border-t border-red-100 dark:border-red-900/30">
          <div className="flex flex-col gap-2">
            {data.issues.map((issue, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{issue}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
