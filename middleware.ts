import { type NextRequest } from 'next/server'
import { updateSession } from './src/shared/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
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
