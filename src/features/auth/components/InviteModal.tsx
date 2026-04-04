'use client'

import { useState } from 'react'
import { inviteUser } from '@/server/db/organizations'
import { useActiveOrg } from '@/features/auth'

export function InviteModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { activeOrgId } = useActiveOrg()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, setIsPending] = useState(false)

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!activeOrgId) return

    setIsPending(true)
    setError(null)
    setSuccess(false)
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const role = formData.get('role') as 'admin' | 'member'
    
    try {
      await inviteUser(email, activeOrgId, role)
      setSuccess(true)
      e.currentTarget.reset()
    } catch (err: any) {
      setError(err.message || 'Failed to invite user')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Invite Member</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>

        {success && <div className="text-green-600 bg-green-50 p-3 rounded mb-4">Invitation created successfully!</div>}
        {error && <div className="text-red-500 bg-red-50 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-medium">Email address</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="colleague@company.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="role" className="font-medium">Role</label>
            <select 
              id="role" 
              name="role" 
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isPending || !activeOrgId}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? 'Inviting...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
