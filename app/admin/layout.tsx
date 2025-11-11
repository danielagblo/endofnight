'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminSidebar from "@/components/admin/AdminSidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const router = useRouter()

  // Skip auth check for login page
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    // Only check auth if not on login page
    if (!isLoginPage && status !== 'loading') {
      if (status === 'unauthenticated' || (session?.user as any)?.role !== 'ADMIN') {
        router.push('/admin/login')
      }
    }
  }, [pathname, session, status, isLoginPage, router])

  // Don't render sidebar on login page
  if (isLoginPage) {
    return <>{children}</>
  }

  // Show loading state while checking auth
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  // If not authenticated, don't render (redirect will happen)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-0 overflow-x-hidden">
        <div className="lg:pl-0 pt-16 lg:pt-0">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
