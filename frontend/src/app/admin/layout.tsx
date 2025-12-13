'use client'

import { Inter } from 'next/font/google'
import '../globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    let adminToken = localStorage.getItem('adminToken')

    // Also validate adminToken if it exists (should be a string, not "undefined")
    if (adminToken === "undefined") {
      localStorage.removeItem('adminToken')
      adminToken = null
    }

    // If not on login page and not authenticated, redirect to login
    if (pathname !== '/admin/login' && !adminToken) {
      router.replace('/admin/login')
    } else if (pathname === '/admin/login' && adminToken) {
      // If on login page and already authenticated, redirect to dashboard
      router.replace('/admin/dashboard')
    } else {
      setLoading(false)
    }
  }, [router, pathname])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  // Render the login page without the admin layout
  if (pathname === '/admin/login') {
    return (
      <div className={inter.className}>
        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>
      </div>
    )
  }

  // Render admin layout for authenticated users
  const adminUser = localStorage.getItem('adminUser');
  let parsedAdminUser = null;

  try {
    parsedAdminUser = adminUser ? JSON.parse(adminUser) : null;
  } catch (error) {
    // If parsing fails, clear the invalid data
    localStorage.removeItem('adminUser');
    parsedAdminUser = null;
  }

  return (
    <div className={`${inter.className} min-h-screen`}>
      <Providers>
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="fixed top-0 left-0 w-64 bg-white shadow-md h-full">
              <div className="p-4 border-b">
                <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
              </div>

              {/* Navigation Menu */}
              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/admin/dashboard"
                      className="block p-2 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/users"
                      className="block p-2 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600"
                    >
                      User Management
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/products"
                      className="block p-2 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600"
                    >
                      Product Management
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/orders"
                      className="block p-2 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600"
                    >
                      Order Management
                    </Link>
                  </li>
                </ul>
              </nav>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8">
              {/* Top Bar */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  {/* Breadcrumb */}
                  <nav className="text-sm text-gray-500">
                    <ol className="list-none p-0 inline-flex">
                      <li className="flex items-center">
                        <Link href="/admin" className="text-gray-500 hover:text-gray-700">Admin</Link>
                        <span className="mx-2">/</span>
                      </li>
                      {/* Breadcrumb items will be dynamically added by individual pages */}
                    </ol>
                  </nav>
                </div>

                {/* User Profile */}
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">{parsedAdminUser?.username || parsedAdminUser?.email || 'Admin User'}</span>
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <button
                    onClick={() => {
                      // Remove tokens and user info from localStorage
                      localStorage.removeItem('adminToken');
                      localStorage.removeItem('adminUser');
                      // Redirect to login page
                      router.replace('/admin/login');
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {/* Page Content */}
              <div className="bg-white rounded-lg shadow-md p-6">
                {children}
              </div>
            </main>
          </div>

          <Toaster position="top-right" />
        </Providers>
    </div>
  )
}
