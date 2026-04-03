'use client'

import { useState, useEffect } from 'react'
import { Search, Loader2 } from 'lucide-react'

interface UrlInputProps {
  onAnalyze: (url: string) => void
  isLoading?: boolean
}

const LOADING_PHASES = [
  "Analyzing your website...",
  "Checking performance...",
  "Verifying links...",
  "Optimizing images...",
  "Finalizing report..."
]

export function UrlInput({ onAnalyze, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState('')
  const [phaseIndex, setPhaseIndex] = useState(0)

  useEffect(() => {
    let interval: any
    if (isLoading) {
      interval = setInterval(() => {
        setPhaseIndex((prev) => (prev + 1) % LOADING_PHASES.length)
      }, 2500)
    } else {
      setPhaseIndex(0)
    }
    return () => clearInterval(interval)
  }, [isLoading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url && !isLoading) onAnalyze(url)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className={`w-5 h-5 transition-colors ${isLoading ? 'text-indigo-500 animate-pulse' : 'text-gray-400 group-hover:text-gray-600'}`} />
        </div>
        <input
          type="url"
          placeholder="Enter website URL to audit (e.g. https://google.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          disabled={isLoading}
          className="block w-full pl-12 pr-32 py-4 text-gray-900 bg-white border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-black/5 focus:border-black transition-all duration-300 placeholder:text-gray-400 sm:text-base shadow-lg shadow-gray-100/50"
        />
        <button 
          type="submit" 
          disabled={isLoading || !url}
          className="absolute right-2 top-2 bottom-2 px-6 bg-black text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Wait...</span>
            </>
          ) : (
            'Audit'
          )}
        </button>
      </form>
      
      {isLoading && (
        <div className="mt-4 flex flex-col items-center animate-in fade-in slide-in-from-top-2 duration-500">
           <p className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em] animate-pulse">
             {LOADING_PHASES[phaseIndex]}
           </p>
           <div className="w-48 h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
             <div className="h-full bg-indigo-500 transition-all duration-1000 ease-in-out" style={{ width: `${((phaseIndex + 1) / LOADING_PHASES.length) * 100}%` }} />
           </div>
        </div>
      )}
    </div>
  )
}
