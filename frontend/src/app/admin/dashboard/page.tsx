'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { apiService } from '@/services/api'

export default function Dashboard() {
  const [stats, setStats] = useState([
    { label: 'Total Users', value: '0', color: 'bg-blue-100', icon: '👥' },
    { label: 'Total Products', value: '0', color: 'bg-green-100', icon: '📦' },
    { label: 'Total Orders', value: '0', color: 'bg-yellow-100', icon: '📋' },
    { label: 'Total Revenue', value: '$0', color: 'bg-purple-100', icon: '💰' },
  ])

  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch users, products, and orders data
        const [users, products, orders] = await Promise.all([
          apiService.getUsers(),
          apiService.getAdminProducts(),
          apiService.getOrders(),
        ])

        // Calculate total revenue
        const totalRevenue = orders.reduce((sum: number, order: any) => {
          return sum + parseFloat(order.total)
        }, 0)

        // Update stats
        setStats([
          { ...stats[0], value: users.length.toString() },
          { ...stats[1], value: products.length.toString() },
          { ...stats[2], value: orders.length.toString() },
          { ...stats[3], value: `$${totalRevenue.toFixed(2)}` },
        ])

        // Update recent orders (last 3)
        setRecentOrders(orders.slice(0, 3))
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`rounded-lg shadow p-4 ${stat.color}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/admin/users"
              className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
            >
              <div className="text-center">
                <div className="text-xl mb-1">👥</div>
                <div className="text-sm text-gray-700">Manage Users</div>
              </div>
            </Link>

            <Link
              href="/admin/products"
              className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
            >
              <div className="text-center">
                <div className="text-xl mb-1">📦</div>
                <div className="text-sm text-gray-700">Manage Products</div>
              </div>
            </Link>

            <Link
              href="/admin/orders"
              className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
            >
              <div className="text-center">
                <div className="text-xl mb-1">📋</div>
                <div className="text-sm text-gray-700">Manage Orders</div>
              </div>
            </Link>

            <Link
              href="/admin/products/new"
              className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
            >
              <div className="text-center">
                <div className="text-xl mb-1">➕</div>
                <div className="text-sm text-gray-700">Add Product</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-gray-50 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.map((order: any) => (
              <div
                key={order.id}
                className="flex justify-between items-center p-3 bg-white rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-800">{order.orderNumber}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'DELIVERED'
                      ? 'bg-green-100 text-green-700'
                      : order.status === 'SHIPPED'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {order.status === 'DELIVERED'
                    ? '已收货'
                    : order.status === 'SHIPPED'
                    ? '已发货'
                    : order.status === 'CONFIRMED'
                    ? '未发货'
                    : order.status}
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/admin/orders"
            className="block text-right text-sm text-blue-600 hover:underline mt-3"
          >
            View All Orders →
          </Link>
        </div>
      </div>
    </div>
  )
}
