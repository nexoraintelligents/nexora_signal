'use client'

import { useUser, useActiveOrg } from '@/features/auth'
import { getUserOrganizations } from '@/server/db/organizations'
import { useEffect, useState } from 'react'

export function OrgSwitcher() {
  const { user } = useUser()
  const { activeOrgId, setActiveOrgId } = useActiveOrg()
  const [orgs, setOrgs] = useState<any[]>([])
  
  useEffect(() => {
    if (user) {
      getUserOrganizations(10, 0).then((data) => {
        setOrgs(data)
        if (!activeOrgId && data.length > 0) {
          // Default to first org if none is active
          setActiveOrgId(data[0].id)
        }
      }).catch(console.error)
    }
  }, [user, activeOrgId, setActiveOrgId])

  if (!user || orgs.length === 0) return null

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="font-semibold text-gray-500">Workspace</span>
      <select 
        value={activeOrgId || ''} 
        onChange={(e) => setActiveOrgId(e.target.value)}
        className="border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>Select Organization</option>
        {orgs.map(org => (
          <option key={org.id} value={org.id}>
            {org.name} ({org.role})
          </option>
        ))}
      </select>
    </div>
  )
}
