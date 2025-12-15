'use client'

import { Inter } from 'next/font/google'
import '../globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { apiService } from '@/services/api'
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Tags,
  ShoppingCart, 
  LogOut, 
  Menu,
  ChevronRight,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const inter = Inter({ subsets: ['latin'] })

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [adminUser, setAdminUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    async function checkAuthentication() {
      try {
        // Check authentication by calling a protected API endpoint (cookie-based)
        const profile = await apiService.getAdminProfile()
        const isAdmin = profile?.role === 'ADMIN'

        if (pathname === '/admin/login' && isAdmin) {
          // If on login page and already authenticated, redirect to dashboard
          router.replace('/admin/dashboard');
        } else if (pathname !== '/admin/login' && !isAdmin) {
          // If not admin, redirect to admin login
          router.replace('/admin/login');
        } else {
          setLoading(false);
        }
      } catch (error) {
        // Network error or API issue, redirect to login
        if (pathname !== '/admin/login') {
          router.replace('/admin/login');
        } else {
          setLoading(false);
        }
      }
    }

    checkAuthentication();
  }, [router, pathname])

  // Fetch admin user data
  useEffect(() => {
    async function fetchAdminUser() {
      try {
        const profile = await apiService.getAdminProfile()
        if (profile?.role === 'ADMIN') setAdminUser(profile)
      } catch (error) {
        console.error('Failed to fetch admin user data:', error);
      }
    }

    if (pathname !== '/admin/login' && !loading) {
      fetchAdminUser();
    }
  }, [pathname, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">正在加载管理面板...</p>
        </div>
      </div>
    )
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

  const navItems = [
    { href: '/admin/dashboard', label: '仪表板', icon: LayoutDashboard },
    { href: '/admin/users', label: '用户管理', icon: Users },
    { href: '/admin/products', label: '产品管理', icon: Package },
    { href: '/admin/categories', label: '分类管理', icon: Tags },
    { href: '/admin/orders', label: '订单管理', icon: ShoppingCart },
  ]

  // Render admin layout for authenticated users
  return (
    <div className={`${inter.className} min-h-screen bg-gray-50/50`}>
      <Providers>
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside 
              className={`fixed top-0 left-0 z-40 h-screen transition-transform bg-white border-r border-gray-200 ${
                sidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full'
              } lg:translate-x-0 lg:static lg:block`}
            >
              <div className="h-full px-3 py-4 overflow-y-auto">
                <div className="flex items-center gap-2 px-2 mb-8 mt-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">A</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">管理后台</span>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center px-3 py-2.5 rounded-lg group transition-colors ${
                          isActive 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <item.icon className={`w-5 h-5 mr-3 transition-colors ${
                          isActive ? 'text-blue-700' : 'text-gray-500 group-hover:text-gray-900'
                        }`} />
                        <span className="font-medium">{item.label}</span>
                        {isActive && <ChevronRight className="w-4 h-4 ml-auto text-blue-700" />}
                      </Link>
                    )
                  })}
                </nav>

                <div className="absolute bottom-4 left-0 w-full px-3">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {adminUser?.username?.[0]?.toUpperCase() || 'A'}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {adminUser?.username || 'Admin'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {adminUser?.email}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
                      onClick={async () => {
                        try {
                          await apiService.adminLogout();
                        } catch (error) {
                          console.error('Logout failed:', error);
                        } finally {
                          router.replace('/admin/login');
                        }
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      退出登录
                    </Button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-0 min-w-0">
              {/* Mobile Header */}
              <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <Menu className="w-6 h-6 text-gray-600" />
                  </button>
                  <span className="font-bold text-gray-900">管理后台</span>
                </div>
              </div>

              <div className="p-4 md:p-8 max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>

          <Toaster position="top-right" />
      </Providers>
    </div>
  )
}
