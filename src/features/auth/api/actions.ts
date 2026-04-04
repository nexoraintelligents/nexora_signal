'use server'

import { updateLastActiveOrg } from '@/server/db/organizations'

export async function saveActiveOrg(orgId: string) {
  try {
    await updateLastActiveOrg(orgId)
  } catch (err) {
    console.error('Failed to update active org in db', err)
  }
}
