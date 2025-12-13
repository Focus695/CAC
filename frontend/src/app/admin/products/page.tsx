"use client"
import { useState, useEffect } from 'react'
import { apiService } from '@/services/api'
import { Pagination } from '@/components/admin/Pagination'
import toast from 'react-hot-toast'
import { ConfirmModal } from '@/components/admin/ConfirmModal'
import { ProductFormModal, ProductFormValues } from '@/components/admin/ProductFormModal'
import { ProductDetailsModal } from '@/components/admin/ProductDetailsModal'
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
  Plus,
  Package,
  Eye,
  CheckCircle, 
  XCircle 
} from 'lucide-react'

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'danger' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}

export default function ProductManagement() {
  const [products, setProducts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300)
  const [filterCategoryId, setFilterCategoryId] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null)
  const [toggleTarget, setToggleTarget] = useState<any | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [formInitial, setFormInitial] = useState<any | null>(null)
  const [detailsTarget, setDetailsTarget] = useState<any | null>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)
  const [detailsProduct, setDetailsProduct] = useState<any | null>(null)

  // If current page becomes empty (e.g. after delete), go back one page and refetch
  useEffect(() => {
    if (loading) return
    if (page > 1 && products.length === 0) {
      setPage((p) => Math.max(1, p - 1))
    }
  }, [products.length, loading, page])

  useEffect(() => {
    async function fetchCategories() {
      try {
        const result = await apiService.getCategories()
        setCategories(Array.isArray(result) ? result : [])
      } catch (e) {
        console.error('Failed to fetch categories:', e)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        setError(null)

        const isActive =
          filterStatus === 'Active' ? true : filterStatus === 'Inactive' ? false : undefined

        const result = await apiService.getAdminProductsPaged({
          page,
          limit,
          search: debouncedSearchTerm,
          categoryId: filterCategoryId || undefined,
          isActive,
          sortField: 'createdAt',
          sortOrder: 'desc',
        })
        setProducts(result.products)
        setPagination(result.pagination)
      } catch (error) {
        console.error('Failed to fetch products:', error)
        setError('Failed to fetch products')
      }
      finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [page, limit, debouncedSearchTerm, filterCategoryId, filterStatus])

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1)
  }, [searchTerm, filterCategoryId, filterStatus, limit])

  const handleToggleStatus = async (product: any) => {
    const prevProducts = products
    try {
      setLoading(true)
      // Optimistic patch
      setProducts((cur) => cur.map((p: any) => (p.id === product.id ? { ...p, isActive: !p.isActive } : p)))
      const updated = product.isActive
        ? await apiService.unpublishProduct(product.id)
        : await apiService.publishProduct(product.id)
      // Server is authoritative (also helps if multiple admins toggle)
      if (updated && typeof updated === 'object') {
        setProducts((cur) => cur.map((p: any) => (p.id === product.id ? { ...p, ...updated } : p)))
      }
      toast.success(product.isActive ? 'Product unpublished' : 'Product published')
    } catch (e) {
      console.error('Toggle status failed:', e)
      setProducts(prevProducts)
      toast.error(product.isActive ? 'Unpublish failed' : 'Publish failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (product: any) => {
    const prevProducts = products
    const prevPagination = pagination
    try {
      setLoading(true)
      // Optimistic remove
      setProducts((cur) => cur.filter((p: any) => p.id !== product.id))
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
      await apiService.deleteProduct(product.id)
      toast.success('Product deleted')
    } catch (e) {
      console.error('Delete failed:', e)
      setProducts(prevProducts)
      setPagination(prevPagination)
      toast.error('Delete failed')
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setFormMode("create")
    setFormInitial(null)
    setFormOpen(true)
  }

  const openEdit = (product: any) => {
    setFormMode("edit")
    setFormInitial(product)
    setFormOpen(true)
  }

  const submitProduct = async (values: ProductFormValues) => {
    try {
      setLoading(true)
      if (formMode === "create") {
        await apiService.createProduct(values)
        toast.success("Product created")
      } else {
        const prevProducts = products
        // Optimistic merge into current list
        const categoryObj = categories.find((c: any) => c.id === values.categoryId)
        setProducts((cur) =>
          cur.map((p: any) =>
            p.id === formInitial.id
              ? {
                  ...p,
                  ...values,
                  categoryId: values.categoryId,
                  category: categoryObj ? { ...(p.category || {}), ...categoryObj } : p.category,
                }
              : p
          )
        )
        await apiService.updateProduct(formInitial.id, values)
        toast.success("Product updated")
        // keep optimistic state; revert if server fails (caught below)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        void prevProducts
      }
      setFormOpen(false)
    } catch (e: any) {
      console.error('Save product failed:', e)
      toast.error(e?.message || 'Save product failed')
    } finally {
      setLoading(false)
    }
  }

  const openDetails = async (product: any) => {
    setDetailsTarget(product)
    setDetailsLoading(true)
    setDetailsError(null)
    setDetailsProduct(null)
    try {
      const result = await apiService.getProductDetails(product.id)
      setDetailsProduct(result)
    } catch (e: any) {
      console.error('Fetch product details failed:', e)
      setDetailsError(e?.message || 'Failed to load product details')
    } finally {
      setDetailsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Manage your product catalog</CardDescription>
            </div>
            <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search products..."
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
                value={filterCategoryId}
                onChange={(e) => setFilterCategoryId(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
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

          {/* Product Table */}
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
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-gray-500">Product</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-gray-500">Category</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-gray-500">Price</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-gray-500">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-gray-500">Date Added</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {loading && products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-gray-500">Loading products...</td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <Package className="w-8 h-8 text-gray-300" />
                          <p>No products found.</p>
                        </div>
                      </td>
                    </tr>
                  ) : products.map((product: any) => (
                    <tr key={product.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted hover:bg-gray-50">
                      <td className="p-4 align-middle">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{product.name_zh}</span>
                          <span className="text-xs text-gray-500">{product.name_en}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-gray-700">{product.category?.name}</td>
                      <td className="p-4 align-middle font-medium text-gray-900">${product.price}</td>
                      <td className="p-4 align-middle">
                        <Badge variant={product.isActive ? 'success' : 'danger'}>
                           {product.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle text-gray-500">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => openDetails(product)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4 text-slate-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => openEdit(product)}
                            title="Edit Product"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`h-8 w-8 p-0 ${product.isActive ? 'hover:bg-red-50 border-red-200' : 'hover:bg-green-50 border-green-200'}`}
                            onClick={() => setToggleTarget(product)}
                            title={product.isActive ? 'Unpublish' : 'Publish'}
                          >
                            {product.isActive ? (
                              <XCircle className="h-4 w-4 text-red-600" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-red-50 border-red-200"
                            onClick={() => setDeleteTarget(product)}
                            title="Delete Product"
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
        title="Delete product?"
        description={
          deleteTarget
            ? `This will permanently delete "${deleteTarget.name_en || deleteTarget.name_zh}".`
            : undefined
        }
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
        title={toggleTarget?.isActive ? "Unpublish product?" : "Publish product?"}
        description={toggleTarget ? `Product: ${toggleTarget.name_en || toggleTarget.name_zh}` : undefined}
        confirmText={toggleTarget?.isActive ? "Unpublish" : "Publish"}
        cancelText="Cancel"
        confirmDisabled={loading}
        onOpenChange={(open) => {
          if (!open) setToggleTarget(null)
        }}
        onConfirm={async () => {
          await handleToggleStatus(toggleTarget)
          setToggleTarget(null)
        }}
      />

      <ProductFormModal
        open={formOpen}
        mode={formMode}
        loading={loading}
        categories={categories.map((c: any) => ({ id: c.id, name: c.name }))}
        initialValues={
          formMode === "edit" && formInitial
            ? {
                name_zh: formInitial.name_zh,
                name_en: formInitial.name_en,
                price: Number(formInitial.price),
                stock: Number(formInitial.stock ?? 0),
                categoryId: formInitial.categoryId,
                isActive: !!formInitial.isActive,
                sku: formInitial.sku,
                mainImage: formInitial.mainImage,
                detailImages: Array.isArray(formInitial.detailImages) ? formInitial.detailImages : [],
                sections: Array.isArray(formInitial.sections) ? formInitial.sections : undefined,
              }
            : undefined
        }
        onOpenChange={setFormOpen}
        onSubmit={submitProduct}
      />

      <ProductDetailsModal
        open={!!detailsTarget}
        loading={detailsLoading}
        error={detailsError}
        product={detailsProduct}
        onOpenChange={(open) => {
          if (!open) {
            setDetailsTarget(null)
            setDetailsProduct(null)
            setDetailsError(null)
            setDetailsLoading(false)
          }
        }}
      />
    </div>
  )
}
