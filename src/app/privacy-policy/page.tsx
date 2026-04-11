import React from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | Nexora Automation',
  description: 'Learn how Nexora Automation collects, uses, and protects your information.',
}

export default function PrivacyPolicyPage() {
  const effectiveDate = 'April 11, 2026'
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] -right-[10%] w-[30%] h-[30%] bg-indigo-500/5 blur-[100px] rounded-full" />
      </div>

      <header className="relative px-6 py-8 md:py-12 max-w-4xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Privacy Policy
        </h1>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">
          Effective Date: {effectiveDate}
        </p>
      </header>

      <main className="relative px-6 pb-24 max-w-4xl mx-auto">
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none p-8 md:p-12 space-y-12">
          
          <section className="space-y-4">
            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              Welcome to Nexora Automation. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our application.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center">
              <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm mr-4 shrink-0">1</span>
              Information We Collect
            </h2>
            <div className="pl-12">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                We may collect the following types of information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
                <li>Name and email address (via login)</li>
                <li>Profile information (if using Facebook Login)</li>
                <li>Usage data (to improve our services)</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center">
              <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm mr-4 shrink-0">2</span>
              How We Use Your Information
            </h2>
            <div className="pl-12">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                We use your information to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
                <li>Provide and improve our services</li>
                <li>Authenticate users via Facebook Login</li>
                <li>Communicate with users if needed</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center">
              <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm mr-4 shrink-0">3</span>
              Sharing of Information
            </h2>
            <div className="pl-12">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                We do not sell or rent your personal data. We may share data only:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
                <li>When required by law</li>
                <li>To protect our rights and services</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center">
              <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm mr-4 shrink-0">4</span>
              Data Security
            </h2>
            <div className="pl-12">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                We take reasonable steps to protect your data, but no method of transmission over the internet is 100% secure.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center">
              <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm mr-4 shrink-0">5</span>
              User Data Deletion
            </h2>
            <div className="pl-12 space-y-4">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                You can request deletion of your data by contacting us at:
              </p>
              <a 
                href="mailto:nexora.intelligents@gmail.com" 
                className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors font-medium"
              >
                nexora.intelligents@gmail.com
              </a>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Or visit our data deletion instructions page:
              </p>
              <Link 
                href="/data-deletion"
                className="text-blue-600 hover:underline dark:text-blue-400 font-medium"
              >
                https://nexora-signal-rouge.vercel.app/data-deletion
              </Link>
              <p className="text-slate-600 dark:text-slate-500 text-sm mt-4 italic">
                Note: We will delete your data within 7 days of receiving your request.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center">
              <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm mr-4 shrink-0">6</span>
              Third-Party Services
            </h2>
            <div className="pl-12">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                We may use third-party services like Facebook for login. These services have their own privacy policies.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center">
              <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm mr-4 shrink-0">7</span>
              Changes to This Policy
            </h2>
            <div className="pl-12">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                We may update this policy from time to time. Changes will be posted on this page.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center">
              <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm mr-4 shrink-0">8</span>
              Contact Us
            </h2>
            <div className="pl-12">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                If you have any questions, contact us at:
              </p>
              <a 
                href="mailto:nexora.intelligents@gmail.com" 
                className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors font-medium"
              >
                nexora.intelligents@gmail.com
              </a>
            </div>
          </section>

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
