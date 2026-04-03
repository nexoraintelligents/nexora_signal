'use client'

import React from 'react'
import { KeywordDensity } from '../types'

interface Props {
  keywords: KeywordDensity[]
}

export function KeywordDensityChart({ keywords }: Props) {
  if (!keywords || keywords.length === 0) {
    return (
      <div className="p-4 border rounded-lg bg-neutral-50 text-neutral-500 text-sm italic">
        No keyword data available for this analysis.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-neutral-900 px-1">Keyword Density</h3>
      <div className="border rounded-xl bg-white overflow-hidden">
        <div className="divide-y divide-neutral-100">
          {keywords.map((item, index) => (
            <div key={index} className="p-4 flex flex-col gap-2 group hover:bg-neutral-50 transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-neutral-800 lowercase">{item.word}</span>
                <span className="text-xs text-neutral-400 font-mono">
                  {item.count} occurrences • {item.percentage}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-neutral-900 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${item.percentage * 2}%`, maxWidth: '100%' }} // Scaling slightly for visibility
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-[10px] text-neutral-400 px-1 uppercase tracking-wider">
        Top 10 keywords by frequency (excluding common stopwords)
      </p>
    </div>
  )
}
