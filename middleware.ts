import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

// Export a named `middleware` function so Next.js reliably detects it.
// Delegate to the `auth` helper which augments the request with `req.auth`.
export async function middleware(req: Request, ev: any) {
  // `auth` returns a Response (or allows a user middleware to run).
  // We call it with the incoming NextRequest-like object.
  // @ts-ignore - `auth` has a flexible signature from next-auth v5
  const result = await (auth as any)(req, ev)

  // If `auth` returned a NextResponse-like object, return it directly.
  if (result instanceof Response) return result

  // Fallback: continue the request
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

