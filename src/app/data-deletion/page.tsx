import React from 'react'
import { ArrowLeft, Trash2, Mail, Clock } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Data Deletion Instructions | Nexora Automation',
  description: 'How to request deletion of your personal data from Nexora Automation.',
}

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-red-100 selection:text-red-900">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-red-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] -left-[10%] w-[30%] h-[30%] bg-orange-500/5 blur-[100px] rounded-full" />
      </div>

      <header className="relative px-6 py-8 md:py-12 max-w-4xl mx-auto">
        <Link 
          href="/privacy-policy" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Privacy Policy
        </Link>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600">
          Data Deletion Instructions
        </h1>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">
          How to permanently remove your data from our systems.
        </p>
      </header>

      <main className="relative px-6 pb-24 max-w-4xl mx-auto">
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none p-8 md:p-12 space-y-12">
          
          <section className="space-y-6">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mr-6 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Requesting Deletion</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  If you would like to delete your data and account from Nexora Automation, please send an email request to our support team.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-6 shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Contact Email</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Please email us from the account associated with your Nexora Automation profile:
                </p>
                <a 
                  href="mailto:nexora.intelligents@gmail.com" 
                  className="inline-flex items-center px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors font-bold text-lg border border-transparent hover:border-red-200 dark:hover:border-red-800"
                >
                  nexora.intelligents@gmail.com
                </a>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center mr-6 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Processing Time</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Once we receive your request, we will verify your identity and delete all your personal data from our databases within <span className="font-bold text-slate-900 dark:text-white">7 working days</span>.
                </p>
              </div>
            </div>
          </section>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-500 text-center italic">
              Note: Data deletion is permanent and cannot be undone. All your project data, history, and settings will be lost.
            </p>
          </div>

        </div>
      </main>

      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 text-center relative z-10">
        <p className="text-slate-500 dark:text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Nexora Automation. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
