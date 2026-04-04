'use client'

import { useState } from 'react'
import { login } from '../api/auth-actions'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setError(null)
    
    // Using FormData is the standard App Router approach for Server Actions
    const formData = new FormData(e.currentTarget)
    const result = await login(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm w-full">
      <h2 className="text-2xl font-bold mb-4">Login to Nexora</h2>
      
      {error && <div className="text-red-500 bg-red-100 p-3 rounded">{error}</div>}
      
      <div className="flex flex-col gap-2">
        <label htmlFor="email">Email</label>
        <input 
          id="email" 
          name="email" 
          type="email" 
          required 
          className="border p-2 rounded"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password">Password</label>
        <input 
          id="password" 
          name="password" 
          type="password" 
          required 
          className="border p-2 rounded"
        />
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="bg-blue-600 text-white p-2 rounded mt-2 hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? 'Logging in...' : 'Log in'}
      </button>
    </form>
  )
}
