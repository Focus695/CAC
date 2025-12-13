'use client'

import { useState, useEffect } from 'react'
import { apiService } from '@/services/api'
import { Pagination } from '@/components/admin/Pagination'
import toast from 'react-hot-toast'
import { ConfirmModal } from '@/components/admin/ConfirmModal'
import { UserFormModal, UserFormValues } from '@/components/admin/UserFormModal'
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
  Trash2, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Shield, 
  User,
  MoreHorizontal
} from 'lucide-react'

// Simple Badge component
const Badge = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'danger' | 'purple' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    purple: 'bg-purple-100 text-purple-800',
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300)
  const [filterRole, setFilterRole] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null)
  const [toggleTarget, setToggleTarget] = useState<any | null>(null)
  const [editTarget, setEditTarget] = useState<any | null>(null)

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true)
        setError(null)

        const isActive =
          filterStatus === 'Active' ? true : filterStatus === 'Inactive' ? false : undefined

        const result = await apiService.getUsersPaged({
          page,
          limit,
          search: debouncedSearchTerm,
          role: filterRole || undefined,
          isActive,
          sortField: 'createdAt',
          sortOrder: 'desc',
        })
        setUsers(result.users)
        setPagination(result.pagination)
      } catch (error) {
        console.error('Failed to fetch users:', error)
        setError('Failed to fetch users')
      }
      finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [page, limit, debouncedSearchTerm, filterRole, filterStatus])

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1)
  }, [searchTerm, filterRole, filterStatus, limit])

  // If current page becomes empty (e.g. after delete), go back one page and refetch
  useEffect(() => {
    if (loading) return
    if (page > 1 && users.length === 0) {
      setPage((p) => Math.max(1, p - 1))
    }
  }, [users.length, loading, page])

  const handleDelete = async (user: any) => {
    const prevUsers = users
    const prevPagination = pagination
    try {
      setLoading(true)
      // Optimistic remove
      setUsers((cur) => cur.filter((u: any) => u.id !== user.id))
      if (prevPagination) {
        const newTotalCount = Math.max(0, prevPagination.totalCount - 1)
        const totalPages = Math.ceil(newTotalCount / prevPagination.limit)
        setPagination({
          ...prevPagination,
          totalCount: newTotalCount,
          totalPages,
          hasPrev: prevPagination.page > 1,
          hasNext: prevPagination.page < totalPages,
        })
      }
      await apiService.deleteUser(user.id)
      toast.success('User deleted')
    } catch (e) {
      console.error('Delete user failed:', e)
      // Revert
      setUsers(prevUsers)
      setPagination(prevPagination)
      toast.error('Delete user failed')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (user: any) => {
    const nextIsActive = !user.isActive
    const prevUsers = users
    try {
      setLoading(true)
      // Optimistic update
      setUsers((cur) =>
        cur.map((u: any) => (u.id === user.id ? { ...u, isActive: nextIsActive } : u))
      )
      await apiService.updateUser(user.id, { isActive: nextIsActive })
      toast.success('User updated')
    } catch (e) {
      console.error('Update user failed:', e)
      // Revert
      setUsers(prevUsers)
      toast.error('Update user failed')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (userId: string, values: UserFormValues) => {
    const prevUsers = users
    try {
      setLoading(true)
      // Optimistic merge
      setUsers((cur) => cur.map((u: any) => (u.id === userId ? { ...u, ...values } : u)))
      const updated = await apiService.updateUser(userId, values)
      // Replace with server response (authoritative)
      setUsers((cur) => cur.map((u: any) => (u.id === userId ? { ...u, ...updated } : u)))
      toast.success('User saved')
    } catch (e) {
      console.error('Save user failed:', e)
      setUsers(prevUsers)
      toast.error('Save user failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user access, roles, and status</CardDescription>
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
                placeholder="Search users..."
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
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="CUSTOMER">Customer</option>
              </select>

              <select 
                className="h-10 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* User Table */}
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
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-gray-500">User Info</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-gray-500">Role</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-gray-500">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-gray-500">Joined Date</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {loading && users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-500">Loading users...</td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <User className="w-8 h-8 text-gray-300" />
                          <p>No users found matching your criteria.</p>
                        </div>
                      </td>
                    </tr>
                  ) : users.map((user: any) => (
                    <tr key={user.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted hover:bg-gray-50">
                      <td className="p-4 align-middle">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{user.username}</span>
                          <span className="text-xs text-gray-500">{user.email}</span>
                          <span className="text-xs text-gray-400 font-mono mt-1">ID: {user.id.substring(0, 8)}...</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge variant={user.role === 'ADMIN' ? 'purple' : 'default'}>
                          <div className="flex items-center gap-1">
                            {user.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                            {user.role}
                          </div>
                        </Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge variant={user.isActive ? 'success' : 'danger'}>
                          <div className="flex items-center gap-1">
                            {user.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {user.isActive ? 'Active' : 'Inactive'}
                          </div>
                        </Badge>
                      </td>
                      <td className="p-4 align-middle text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setEditTarget(user)}
                            title="Edit User"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`h-8 w-8 p-0 ${user.isActive ? 'hover:bg-red-50 border-red-200' : 'hover:bg-green-50 border-green-200'}`}
                            onClick={() => setToggleTarget(user)}
                            title={user.isActive ? 'Deactivate User' : 'Activate User'}
                          >
                            {user.isActive ? (
                              <XCircle className="h-4 w-4 text-red-600" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-red-50 border-red-200"
                            onClick={() => setDeleteTarget(user)}
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
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

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete user?"
        description={deleteTarget ? `This will permanently delete "${deleteTarget.email}".` : undefined}
        confirmText="Delete"
        cancelText="Cancel"
        confirmDisabled={loading}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        onConfirm={async () => {
          await handleDelete(deleteTarget)
          setDeleteTarget(null)
        }}
      />

      <ConfirmModal
        open={!!toggleTarget}
        title={toggleTarget?.isActive ? "Deactivate user?" : "Activate user?"}
        description={toggleTarget ? `User: ${toggleTarget.email}` : undefined}
        confirmText={toggleTarget?.isActive ? "Deactivate" : "Activate"}
        cancelText="Cancel"
        confirmDisabled={loading}
        onOpenChange={(open) => {
          if (!open) setToggleTarget(null)
        }}
        onConfirm={async () => {
          await handleToggleActive(toggleTarget)
          setToggleTarget(null)
        }}
      />

      <UserFormModal
        open={!!editTarget}
        userEmail={editTarget?.email}
        loading={loading}
        initialValues={
          editTarget
            ? {
                username: editTarget.username,
                isActive: !!editTarget.isActive,
                role: editTarget.role,
              }
            : undefined
        }
        onOpenChange={(open) => {
          if (!open) setEditTarget(null)
        }}
        onSubmit={async (values) => {
          await handleEdit(editTarget.id, values)
          setEditTarget(null)
        }}
      />
    </div>
  )
}
