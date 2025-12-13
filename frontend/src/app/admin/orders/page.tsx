"use client"
import { useState, useEffect } from 'react'
import { apiService } from '@/services/api'

export default function OrderManagement() {
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    async function fetchOrders() {
      try {
        const fetchedOrders = await apiService.getOrders()
        setOrders(fetchedOrders)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      }
    }

    fetchOrders()
  }, [])

  // Filter orders based on search term and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !filterStatus || order.status === filterStatus

    return matchesSearch && matchesStatus
  })

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': // 未发货
        return 'bg-blue-100 text-blue-800'
      case 'SHIPPED': // 已发货
        return 'bg-orange-100 text-orange-800'
      case 'DELIVERED': // 已收货
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Function to get status display text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return '未发货'
      case 'SHIPPED':
        return '已发货'
      case 'DELIVERED':
        return '已收货'
      case 'PENDING':
        return '待处理'
      case 'PROCESSING':
        return '处理中'
      case 'CANCELLED':
        return '已取消'
      case 'REFUNDED':
        return '已退款'
      default:
        return status
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Order Management</h1>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Search by order number or email..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex space-x-4">
          <select className="px-4 py-2 border border-gray-300 rounded-lg"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="CONFIRMED">未发货</option>
            <option value="SHIPPED">已发货</option>
            <option value="DELIVERED">已收货</option>
            <option value="PENDING">待处理</option>
            <option value="PROCESSING">处理中</option>
            <option value="CANCELLED">已取消</option>
            <option value="REFUNDED">已退款</option>
          </select>
        </div>
      </div>

      {/* Order Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order: any) => (
              <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.orderNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.user?.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.total}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      Details
                    </button>
                    {order.status === 'CONFIRMED' && (
                      <button className="text-green-600 hover:text-green-800">
                        Ship
                      </button>
                    )}
                    {order.status === 'SHIPPED' && (
                      <button className="text-green-600 hover:text-green-800">
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
