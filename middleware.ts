import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const response = NextResponse.next()
  
  // Add pathname header so root layout can check if it's an admin route
  // This needs to be set for all routes, not just admin
  if (!pathname.startsWith("/api") && !pathname.startsWith("/_next")) {
    response.headers.set("x-pathname", pathname)
  }
  
  // Always allow access to login page without any authentication checks
  if (pathname === "/admin/login") {
    // Add a header to indicate this is the login page
    response.headers.set("x-invoke-path", pathname)
    return response
  }

  // Protect all other admin routes
  if (pathname.startsWith("/admin")) {
    const isLoggedIn = !!req.auth
    const isAdmin = req.auth?.user?.role === "ADMIN"
    
    if (!isLoggedIn || !isAdmin) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }
  }

  return response
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

