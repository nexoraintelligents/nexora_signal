'use client'

import { useState, useEffect } from 'react'
import { saveActiveOrg } from '../api/actions'

export function useActiveOrg() {
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null)

  useEffect(() => {
    const orgId = localStorage.getItem('nexora_active_org')
    if (orgId) {
      setActiveOrgId(orgId)
    }
  }, [])

  const setOrgId = async (id: string | null) => {
    if (id) {
      localStorage.setItem('nexora_active_org', id)
      setActiveOrgId(id)
      await saveActiveOrg(id)
    } else {
      localStorage.removeItem('nexora_active_org')
      setActiveOrgId(null)
    }
  }

  return { activeOrgId, setActiveOrgId: setOrgId }
}
