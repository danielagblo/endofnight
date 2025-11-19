'use client'

import { Building2, Home, LayoutDashboard, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminNavbar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path ? 'bg-accent text-white' : 'text-gray-700 hover:bg-gray-100'
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-accent" />
              <span className="text-xl font-bold text-gray-900">End of Night Admin</span>
            </Link>
            <div className="hidden md:flex space-x-1">
              <Link
                href="/admin/dashboard"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${isActive('/admin/dashboard')}`}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link
                href="/admin/properties"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${isActive('/admin/properties')}`}
              >
                <Building2 size={18} />
                Properties
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <Home size={18} />
              View Site
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

