import { type NextRequest } from 'next/server'
import { updateSession } from './shared/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/seo/:path*',
    '/trends/:path*',
    '/content/:path*',
    '/competitors/:path*',
    '/leads/:path*'
  ],
}
