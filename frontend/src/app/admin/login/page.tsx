'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { apiService } from '@/services/api'

export default function AdminLogin() {
  const [email, setEmail] = useState('zenchill@example.com')
  const [password, setPassword] = useState('zenchill888')
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // New state to track login success
  const router = useRouter()

  // Handle navigation after login success is confirmed
  useEffect(() => {
    if (isLoggedIn) {
      router.push('/admin/dashboard')
    }
  }, [isLoggedIn, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await apiService.login({ email, password })

      // 立即校验是否为管理员，避免“闪一下又被踢回”的体验
      const profile = await apiService.getProfile()
      if (profile?.role !== 'ADMIN') {
        try {
          await apiService.logout()
        } catch {
          // ignore
        }
        throw new Error('该账号不是管理员，无法登录后台')
      }

      toast.success('Login successful!')
      setIsLoggedIn(true)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Admin Login</h1>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
              loading
                ? 'bg-blue-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Default credentials:</p>
          <p>Email: zenchill@example.com</p>
          <p>Password: zenchill888</p>
        </div>
      </div>
    </div>
  )
}
