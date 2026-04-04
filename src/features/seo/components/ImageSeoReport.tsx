'use client'

import React, { useState } from 'react'
import { Image as ImageIcon, AlertCircle, CheckCircle2, ChevronRight, X, ExternalLink, ImageOff } from 'lucide-react'
import { ImageAnalysisResult } from '../types'
import { clsx } from 'clsx'

interface ImageSeoReportProps {
  data?: ImageAnalysisResult
  loading?: boolean
}

export function ImageSeoReport({ data, loading }: ImageSeoReportProps) {
  const [modalOpen, setModalOpen] = useState(false)

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse shadow-sm">
        <div className="h-4 w-48 bg-gray-100 rounded-full mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-50 rounded-xl border border-gray-100"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!data) return null

  const { totalCount, missingAltCount, largeImagesCount, images } = data
  
  const problematicImages = images.filter(img => !img.hasAlt || img.isLarge)

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <ImageIcon className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Image Optimization</h3>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">SEO Asset Analysis</p>
          </div>
        </div>
        <span className={clsx(
          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
          (missingAltCount > 0 || largeImagesCount > 0) 
            ? "bg-amber-50 text-amber-700 border-amber-100" 
            : "bg-emerald-50 text-emerald-700 border-emerald-100"
        )}>
          {totalCount} Total Assets
        </span>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-5 transition-colors hover:bg-gray-50">
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-widest">Missing Alt Tags</p>
            <div className="flex items-end justify-between">
                <div>
                  <p className={clsx("text-2xl font-black tabular-nums", missingAltCount > 0 ? "text-red-500" : "text-gray-900")}>{missingAltCount}</p>
                  <p className="text-[10px] text-gray-500 font-medium mt-1">Accessibility risk</p>
                </div>
                <div className={clsx("p-2 rounded-lg", missingAltCount > 0 ? "bg-red-50" : "bg-emerald-50")}>
                  {missingAltCount > 0 ? <AlertCircle className="w-5 h-5 text-red-500" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                </div>
            </div>
          </div>

          <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-5 transition-colors hover:bg-gray-50">
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-widest">Large Assets</p>
            <div className="flex items-end justify-between">
                <div>
                  <p className={clsx("text-2xl font-black tabular-nums", largeImagesCount > 0 ? "text-amber-500" : "text-gray-900")}>{largeImagesCount}</p>
                  <p className="text-[10px] text-gray-500 font-medium mt-1">Performance impact</p>
                </div>
                <div className={clsx("p-2 rounded-lg", largeImagesCount > 0 ? "bg-amber-50" : "bg-emerald-50")}>
                  {largeImagesCount > 0 ? <AlertCircle className="w-5 h-5 text-amber-500" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                </div>
            </div>
          </div>

          <button 
            onClick={() => setModalOpen(true)}
            className="group relative bg-gray-900 border border-gray-800 rounded-xl p-5 text-left transition-all duration-300 hover:bg-black overflow-hidden shadow-lg shadow-gray-200"
          >
            <div className="relative z-10">
              <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-widest group-hover:text-gray-300">Detailed Report</p>
              <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-white group-hover:translate-x-1 transition-transform">Explore All Assets</p>
                  <ChevronRight className="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <div className="absolute top-0 right-0 -mr-4 -mt-4 p-8 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all"></div>
          </button>
        </div>

        {problematicImages.length > 0 && (
          <div className="space-y-4">
             <div className="flex items-center justify-between px-1">
                <h4 className="text-xs font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wider">
                    Critical Issues Detected
                </h4>
             </div>
             <div className="grid grid-cols-1 gap-3">
                {problematicImages.slice(0, 2).map((img, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-indigo-100 hover:shadow-sm transition-all group">
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                            <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                                <img src={img.src} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                     onError={(e) => (e.currentTarget.style.display = 'none')} />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs font-bold text-gray-900 truncate mb-1">{img.src.startsWith('data:') ? 'Inline Data Snippet' : img.src}</span>
                                <div className="flex gap-2">
                                    {!img.hasAlt && <span className="text-[9px] font-black text-red-500 bg-red-50 px-1.5 py-0.5 rounded uppercase tracking-tighter">Missing Alt</span>}
                                    {img.isLarge && <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded uppercase tracking-tighter">Large Asset</span>}
                                </div>
                            </div>
                        </div>
                        <a href={img.src} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all ml-4">
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-900 rounded-2xl shadow-lg">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Image Asset Audit</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{totalCount} Found</span>
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{missingAltCount} Needs Alt</span>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{largeImagesCount} Large</span>
                    </div>
                </div>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-3 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-900 transition-all active:scale-95 bg-gray-100/50"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
              <table className="w-full text-left border-collapse table-fixed">
                <thead className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-10">
                    <tr>
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] w-[45%]">Source URI</th>
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] w-[25%]">Alternate Text</th>
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] w-[15%]">Size</th>
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] w-[15%] text-right">Optimization</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {images.map((img, i) => (
                        <tr key={i} className="hover:bg-gray-50/30 transition-all group">
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="bg-gray-50 rounded-xl overflow-hidden shrink-0 w-12 h-12 border border-gray-100 shadow-sm group-hover:border-indigo-100 transition-colors flex items-center justify-center">
                                        <img 
                                            src={img.src} 
                                            alt="" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                                (e.target as HTMLImageElement).parentElement?.classList.add('bg-gray-50');
                                                const icon = document.createElement('div');
                                                icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-300"><path d="M18 22H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z"/><line x1="18" y1="2" x2="22" y2="6"/><line x1="22" y1="2" x2="18" y2="6"/><circle cx="10" cy="10" r="3"/><path d="m14 14-3-3"/></svg>';
                                                (e.target as HTMLImageElement).parentElement?.appendChild(icon);
                                            }}
                                        />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs font-bold text-gray-900 break-all line-clamp-2" title={img.src}>
                                            {img.src.startsWith('data:') ? 'Embedded Technical Asset' : img.src}
                                        </span>
                                        {img.src.startsWith('data:') && (
                                            <span className="text-[10px] text-gray-400 font-mono mt-1 opacity-60">Base64 Encoded Stream</span>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-5">
                                {img.hasAlt ? (
                                    <span className="text-xs font-medium text-gray-600 leading-relaxed block max-h-12 overflow-hidden">{img.alt}</span>
                                ) : (
                                    <div className="flex items-center gap-2 text-red-400">
                                      <ImageOff className="w-3.5 h-3.5" />
                                      <span className="text-[10px] font-black uppercase tracking-tighter">No Alt Found</span>
                                    </div>
                                )}
                            </td>
                            <td className="px-8 py-5">
                                <span className={clsx(
                                  "text-xs font-black tabular-nums tracking-tight", 
                                  img.isLarge ? "text-amber-500" : "text-gray-500"
                                )}>
                                    {img.size ? `${(img.size / 1024).toFixed(1)} KB` : '---'}
                                </span>
                            </td>
                            <td className="px-8 py-5 text-right">
                                <div className="flex justify-end items-center gap-3">
                                    <div className="flex flex-col items-end gap-1">
                                      {!img.hasAlt && <span className="bg-red-50 text-red-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter shadow-sm border border-red-100">Alt Risk</span>}
                                      {img.isLarge && <span className="bg-amber-50 text-amber-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter shadow-sm border border-amber-100">Size Risk</span>}
                                      {img.hasAlt && !img.isLarge && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                    </div>
                                    <a 
                                      href={img.src} 
                                      target="_blank" 
                                      rel="noreferrer" 
                                      className="p-2 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all border border-indigo-50 group-hover:border-indigo-100 shadow-sm"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
              </table>
              {images.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 text-gray-400">
                  <div className="p-4 bg-gray-50 rounded-full mb-4">
                    <ImageIcon className="w-12 h-12 opacity-20" />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest opacity-40">No Assets Discovered</p>
                </div>
              )}
            </div>

            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-4 items-center">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mr-auto">Audit complete • nexora signal v1.0</p>
              <button 
                onClick={() => setModalOpen(false)}
                className="px-8 py-3 bg-gray-900 text-white rounded-xl text-sm font-black hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95"
              >
                Dismiss Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
