"use client"
import { useState, useEffect } from 'react'
import { apiService } from '@/services/api'
import { Pagination } from '@/components/admin/Pagination'
import toast from 'react-hot-toast'
import { ConfirmModal } from '@/components/admin/ConfirmModal'
import { ShipOrderModal } from '@/components/admin/ShipOrderModal'
import { OrderDetailsModal } from '@/components/admin/OrderDetailsModal'
import { useDebouncedValue } from '@/lib/useDebouncedValue'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Search, 
  Filter, 
  Eye, 
  Truck, 
  CheckCircle,
  Clock,
  Package,
  ShoppingCart
} from 'lucide-react'

// Simple Badge component
const Badge = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300)
  const [filterStatus, setFilterStatus] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shipTarget, setShipTarget] = useState<any | null>(null)
  const [deliverTarget, setDeliverTarget] = useState<any | null>(null)
  const [detailsTarget, setDetailsTarget] = useState<any | null>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)
  const [detailsOrder, setDetailsOrder] = useState<any | null>(null)

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true)
        setError(null)
        const result = await apiService.getOrdersPaged({
          page,
          limit,
          search: debouncedSearchTerm,
          status: filterStatus || undefined,
          sortField: 'createdAt',
          sortOrder: 'desc',
        })
        setOrders(result.orders)
        setPagination(result.pagination)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
        setError('获取订单失败')
      }
      finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [page, limit, debouncedSearchTerm, filterStatus])

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1)
  }, [searchTerm, filterStatus, limit])

  const handleShip = async (orderId: string, trackingNumber: string) => {
    const prevOrders = orders
    try {
      setLoading(true)
      // Optimistic patch
      setOrders((cur) =>
        cur.map((o: any) =>
          o.id === orderId
            ? { ...o, status: 'SHIPPED', trackingNumber: trackingNumber || o.trackingNumber }
            : o
        )
      )
      const updated = await apiService.shipOrder(orderId, trackingNumber)
      setOrders((cur) =>
        cur.map((o: any) =>
          o.id === orderId
            ? { ...o, status: updated.status ?? 'SHIPPED', trackingNumber: updated.trackingNumber ?? trackingNumber }
            : o
        )
      )
      // Keep details modal consistent if it's open for the same order
      setDetailsOrder((cur) => {
        if (!cur || cur.id !== orderId) return cur
        return {
          ...cur,
          status: updated?.status ?? 'SHIPPED',
          trackingNumber: updated?.trackingNumber ?? trackingNumber,
        }
      })
      toast.success('订单已发货')
    } catch (e) {
      console.error('Ship failed:', e)
      setOrders(prevOrders)
      toast.error('发货失败')
    } finally {
      setLoading(false)
    }
  }

  const handleDeliver = async (orderId: string) => {
    const prevOrders = orders
    try {
      setLoading(true)
      // Optimistic patch
      setOrders((cur) => cur.map((o: any) => (o.id === orderId ? { ...o, status: 'DELIVERED' } : o)))
      const updated = await apiService.deliverOrder(orderId)
      setOrders((cur) =>
        cur.map((o: any) => (o.id === orderId ? { ...o, status: updated.status ?? 'DELIVERED' } : o))
      )
      // Keep details modal consistent if it's open for the same order
      setDetailsOrder((cur) => {
        if (!cur || cur.id !== orderId) return cur
        return {
          ...cur,
          status: updated?.status ?? 'DELIVERED',
          trackingNumber: updated?.status ?? 'DELIVERED',
        }
      })
      toast.success('订单已送达')
    } catch (e) {
      console.error('Deliver failed:', e)
      setOrders(prevOrders)
      toast.error('标记送达失败')
    } finally {
      setLoading(false)
    }
  }

  const openDetails = async (order: any) => {
    setDetailsTarget(order)
    setDetailsLoading(true)
    setDetailsError(null)
    setDetailsOrder(null)
    try {
      const result = await apiService.getOrderDetails(order.id)
      setDetailsOrder(result)
    } catch (e) {
      console.error('Fetch order details failed:', e)
      setDetailsError('加载订单详情失败')
    } finally {
      setDetailsLoading(false)
    }
  }

  // Function to get status color and icon
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED': // 未发货
        return <Badge variant="info">未发货</Badge>
      case 'SHIPPED': // 已发货
        return <Badge variant="warning">已发货</Badge>
      case 'DELIVERED': // 已收货
        return <Badge variant="success">已收货</Badge>
      case 'PENDING':
        return <Badge variant="default">待处理</Badge>
      case 'PROCESSING':
        return <Badge variant="purple">处理中</Badge>
      case 'CANCELLED':
        return <Badge variant="danger">已取消</Badge>
      case 'REFUNDED':
        return <Badge variant="danger">已退款</Badge>
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>订单管理</CardTitle>
              <CardDescription>处理和跟踪客户订单</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="搜索订单..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">Filters:</span>
              </div>
              <select 
                className="h-10 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">所有状态</option>
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
          <div className="rounded-md border">
            {error && (
              <div className="p-4 bg-red-50 text-red-700 border-b border-red-100">
                {error}
              </div>
            )}
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-gray-500">订单号</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-gray-500">客户</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-gray-500">总额</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-gray-500">状态</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-gray-500">日期</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {loading && orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-gray-500">正在加载订单...</td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <ShoppingCart className="w-8 h-8 text-gray-300" />
                          <p>未找到订单。</p>
                        </div>
                      </td>
                    </tr>
                  ) : orders.map((order: any) => (
                    <tr key={order.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted hover:bg-gray-50">
                      <td className="p-4 align-middle font-mono font-medium">{order.orderNumber}</td>
                      <td className="p-4 align-middle">
                         <div className="flex flex-col">
                           <span className="text-sm text-gray-900">{order.user?.email}</span>
                         </div>
                      </td>
                      <td className="p-4 align-middle font-bold text-gray-900">${order.total}</td>
                      <td className="p-4 align-middle">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="p-4 align-middle text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => openDetails(order)}
                            title="查看详情"
                          >
                            <Eye className="h-4 w-4 text-slate-600" />
                          </Button>
                          {order.status === 'CONFIRMED' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-blue-50 border-blue-200"
                              onClick={() => setShipTarget(order)}
                              title="发货"
                            >
                              <Truck className="h-4 w-4 text-blue-600" />
                            </Button>
                          )}
                          {order.status === 'SHIPPED' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-green-50 border-green-200"
                              onClick={() => setDeliverTarget(order)}
                              title="标记为已送达"
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4">
            <Pagination
              pagination={pagination}
              onPageChange={(p) => setPage(p)}
              onLimitChange={(l) => setLimit(l)}
            />
          </div>
        </CardContent>
      </Card>

      <ShipOrderModal
        open={!!shipTarget}
        orderNumber={shipTarget?.orderNumber}
        loading={loading}
        onOpenChange={(open) => {
          if (!open) setShipTarget(null)
        }}
        onSubmit={async (trackingNumber) => {
          await handleShip(shipTarget.id, trackingNumber)
          setShipTarget(null)
        }}
      />

      <ConfirmModal
        open={!!deliverTarget}
        title="标记为已送达？"
        description={deliverTarget ? `订单 ${deliverTarget.orderNumber} 将被标记为已送达。` : undefined}
        confirmText="标记已送达"
        cancelText="取消"
        confirmDisabled={loading}
        onOpenChange={(open) => {
          if (!open) setDeliverTarget(null)
        }}
        onConfirm={async () => {
          await handleDeliver(deliverTarget.id)
          setDeliverTarget(null)
        }}
      />

      <OrderDetailsModal
        open={!!detailsTarget}
        loading={detailsLoading}
        error={detailsError}
        order={detailsOrder}
        onOpenChange={(open) => {
          if (!open) {
            setDetailsTarget(null)
            setDetailsOrder(null)
            setDetailsError(null)
            setDetailsLoading(false)
          }
        }}
      />
    </div>
  )
}
