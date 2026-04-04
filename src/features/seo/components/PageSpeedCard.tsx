'use client'

import React from 'react'
import { PageSpeedMetrics, MetricValue } from '../types'

interface Props {
  metrics?: PageSpeedMetrics
}

function MetricItem({ label, metric }: { label: string, metric: MetricValue }) {
  const statusColors = {
    good: 'bg-green-500',
    'needs-improvement': 'bg-yellow-500',
    poor: 'bg-red-500'
  }

  const textColors = {
    good: 'text-green-700',
    'needs-improvement': 'text-yellow-700',
    poor: 'text-red-700'
  }

  return (
    <div className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
      <div className="flex flex-col">
        <span className="text-xs font-medium text-neutral-500 uppercase tracking-tight">{label}</span>
        <span className={`text-sm font-semibold ${textColors[metric.status]}`}>{metric.value}</span>
      </div>
      <div className={`w-2 h-2 rounded-full ${statusColors[metric.status]}`} title={metric.status} />
    </div>
  )
}

export function PageSpeedCard({ metrics }: Props) {
  if (!metrics) {
    return (
      <div className="p-6 border rounded-xl bg-neutral-50 flex flex-col items-center justify-center text-center space-y-2">
        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
          <span className="text-neutral-400 text-xl font-bold">!</span>
        </div>
        <p className="text-sm font-medium text-neutral-900">Performance Data Unavailable</p>
        <p className="text-xs text-neutral-500">Check your API configuration or verify the URL is public.</p>
      </div>
    )
  }

  const scoreColor = metrics.score >= 90 ? 'text-green-500' : metrics.score >= 50 ? 'text-yellow-500' : 'text-red-500'

  return (
    <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
      <div className="p-6 border-b border-neutral-100 flex flex-col items-center text-center">
        <div className={`text-4xl font-bold mb-1 ${scoreColor}`}>
          {metrics.score}
        </div>
        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
          Performance Score
        </div>
      </div>
      
      <div className="p-4 bg-neutral-50/50">
        <div className="space-y-1">
          <MetricItem label="LCP (Largest Paint)" metric={metrics.lcp} />
          <MetricItem label="FCP (First Paint)" metric={metrics.fcp} />
          <MetricItem label="CLS (Layout Shift)" metric={metrics.cls} />
          <MetricItem label="TBT (Blocking Time)" metric={metrics.tbt} />
        </div>
      </div>
      
      <div className="px-4 py-2 bg-white border-t border-neutral-100">
         <p className="text-[9px] text-neutral-400 text-center italic">
          Data powered by Google PageSpeed Insights
         </p>
      </div>
    </div>
  )
}
