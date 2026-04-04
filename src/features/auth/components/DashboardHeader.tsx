'use client'

import { OrgSwitcher } from '@/shared/components/OrgSwitcher'
import { InviteModal } from './InviteModal'
import { logout } from '../api/auth-actions'
import { useState } from 'react'

export function DashboardHeader() {
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  return (
    <header className="flex items-center justify-between p-4 border-b bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
      <div className="flex items-center gap-4">
        <OrgSwitcher />
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsInviteOpen(true)}
          className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors duration-200"
        >
          + Invite Member
        </button>
        <button 
          onClick={async () => await logout()}
          className="text-gray-500 hover:text-gray-700 text-sm font-medium"
        >
          Logout
        </button>
      </div>
      
      <InviteModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
    </header>
  )
}
