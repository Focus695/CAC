'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { apiService } from '@/services/api'
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  ArrowRight,
  Plus,
  Clock,
  CheckCircle,
  Truck
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  const [stats, setStats] = useState([
    { label: 'Total Users', value: '0', color: 'bg-blue-50 text-blue-600', icon: Users },
    { label: 'Total Products', value: '0', color: 'bg-green-50 text-green-600', icon: Package },
    { label: 'Total Orders', value: '0', color: 'bg-yellow-50 text-yellow-600', icon: ShoppingCart },
    { label: 'Total Revenue', value: '$0', color: 'bg-purple-50 text-purple-600', icon: DollarSign },
  ])

  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
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

        // Update recent orders (last 5)
        setRecentOrders(orders.slice(0, 5))
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6 flex items-center justify-between space-y-0">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground text-gray-500">{stat.label}</p>
                <div className="text-2xl font-bold">{loading ? '...' : stat.value}</div>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you perform often</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/admin/users">
              <div className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Manage Users</div>
                  <div className="text-sm text-gray-500">View and edit users</div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
              </div>
            </Link>

            <Link href="/admin/products">
              <div className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Manage Products</div>
                  <div className="text-sm text-gray-500">Inventory control</div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
              </div>
            </Link>

            <Link href="/admin/orders">
              <div className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4 group-hover:bg-yellow-200 transition-colors">
                  <ShoppingCart className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Manage Orders</div>
                  <div className="text-sm text-gray-500">Process orders</div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
              </div>
            </Link>

            <Link href="/admin/products/new">
              <Button className="w-full mt-2" variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Add New Product
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest transactions from users</CardDescription>
            </div>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
               <div className="text-center py-8 text-gray-500">Loading orders...</div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No recent orders found.</div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        order.status === 'DELIVERED' ? 'bg-green-100' :
                        order.status === 'SHIPPED' ? 'bg-yellow-100' :
                        'bg-blue-100'
                      }`}>
                        {order.status === 'DELIVERED' ? <CheckCircle className="h-5 w-5 text-green-600" /> :
                         order.status === 'SHIPPED' ? <Truck className="h-5 w-5 text-yellow-600" /> :
                         <Clock className="h-5 w-5 text-blue-600" />}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{order.orderNumber}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-gray-900">${parseFloat(order.total).toFixed(2)}</div>
                        <div className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block ${
                           order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                           order.status === 'SHIPPED' ? 'bg-yellow-100 text-yellow-800' :
                           'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
