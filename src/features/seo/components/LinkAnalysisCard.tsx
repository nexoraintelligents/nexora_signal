'use client'

import React, { useState } from 'react'
import { Link2, Link2Off, ExternalLink, AlertCircle, CheckCircle2, X, ChevronRight } from 'lucide-react'
import { LinkAnalysisResult } from '../types'
import { clsx } from 'clsx'

interface LinkAnalysisCardProps {
  data?: LinkAnalysisResult
  loading?: boolean
}

export function LinkAnalysisCard({ data, loading }: LinkAnalysisCardProps) {
  const [modalType, setModalType] = useState<'internal' | 'external' | null>(null)

  if (loading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-6 animate-pulse">
        <div className="h-4 w-48 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!data) return null

  const { internalCount, externalCount, totalLinks, brokenLinks, internalLinks, externalLinks } = data
  const brokenCount = brokenLinks.length
  
  const activeLinks = modalType === 'internal' ? internalLinks : externalLinks

  return (
    <div className="rounded-md border border-gray-200 bg-white shadow-sm transition-all duration-300">
      <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-800">Link Analysis</h3>
        </div>
        <span className={clsx(
          "px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide",
          brokenCount > 0 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
        )}>
          {brokenCount > 0 ? `${brokenCount} Broken Links` : "All Healthy"}
        </span>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button 
            onClick={() => setModalType('internal')}
            className="group bg-gray-50 border border-gray-100 rounded-md p-4 text-left hover:border-indigo-200 hover:bg-indigo-50/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
          >
            <div className="flex justify-between items-center mb-1">
              <p className="text-[10px] uppercase font-bold text-gray-400 group-hover:text-indigo-500 transition-colors">Internal Links</p>
              <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-indigo-400 transition-colors" />
            </div>
            <p className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{internalCount}</p>
          </button>

          <button 
            onClick={() => setModalType('external')}
            className="group bg-gray-50 border border-gray-100 rounded-md p-4 text-left hover:border-emerald-200 hover:bg-emerald-50/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
          >
            <div className="flex justify-between items-center mb-1">
              <p className="text-[10px] uppercase font-bold text-gray-400 group-hover:text-emerald-500 transition-colors">External Links</p>
              <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-emerald-400 transition-colors" />
            </div>
            <p className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{externalCount}</p>
          </button>

          <div className="bg-gray-50 border border-gray-100 rounded-md p-4">
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Scan Status</p>
            <div className="flex items-center gap-2">
              {brokenCount > 0 ? (
                <AlertCircle className="w-4 h-4 text-amber-500" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              )}
              <p className="text-sm font-semibold text-gray-800">
                {brokenCount > 0 ? 'Issues Found' : 'Optimal'}
              </p>
            </div>
          </div>
        </div>

        {brokenLinks.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-500 flex items-center gap-2 px-1">
              <Link2Off className="w-3 h-3" />
              Broken Links Detected
            </h4>
            <div className={`max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar`}>
              {brokenLinks.map((link, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3 bg-red-50/50 border border-red-100 rounded-md group hover:bg-red-50 transition-colors"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-gray-800 truncate pr-4">
                      {link.url}
                    </span>
                    <span className="text-[10px] font-bold text-red-600 mt-0.5 uppercase tracking-tight">
                      Status: {link.status}
                    </span>
                  </div>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded border border-indigo-100 transition-all shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900 capitalize flex items-center gap-2">
                {modalType === 'internal' ? <Link2 className="w-5 h-5 text-indigo-500" /> : <ExternalLink className="w-5 h-5 text-emerald-500" />}
                {modalType} Links
                <span className="text-sm font-normal text-gray-500 ml-2">({activeLinks?.length || 0})</span>
              </h3>
              <button 
                onClick={() => setModalType(null)}
                className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 hover:text-gray-900 transition-all bg-gray-100/50"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar bg-white">
              {activeLinks && activeLinks.length > 0 ? (
                activeLinks.map((url, i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/30 hover:bg-gray-50 hover:border-gray-200 transition-all group"
                  >
                    <span className="text-xs font-medium text-gray-700 truncate mr-4">{url}</span>
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded border border-indigo-100 transition-all shadow-sm shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <Link2 className="w-12 h-12 mb-4 opacity-10" />
                  <p className="italic">No {modalType} links found.</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
              <button 
                onClick={() => setModalType(null)}
                className="px-6 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-all shadow-md active:scale-95"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
