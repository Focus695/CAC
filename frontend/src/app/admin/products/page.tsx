"use client"
import { useState, useEffect } from 'react'
import { apiService } from '@/services/api'

export default function ProductManagement() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    async function fetchProducts() {
      try {
        const fetchedProducts = await apiService.getAdminProducts()
        setProducts(fetchedProducts)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }

    fetchProducts()
  }, [])

  // Filter products based on search term and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm ||
      product.name_zh.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name_en.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = !filterCategory || product.category.name === filterCategory

    const matchesStatus = !filterStatus ||
      (filterStatus === 'Active' && product.isActive) ||
      (filterStatus === 'Inactive' && !product.isActive)

    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Product Management</h1>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Search by product name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex space-x-4">
          <select className="px-4 py-2 border border-gray-300 rounded-lg"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {/* We'll populate categories dynamically once we have the data */}
            {[...new Set(products.map((p: any) => p.category?.name))].map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select className="px-4 py-2 border border-gray-300 rounded-lg"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add New Product
        </button>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product: any) => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id.substring(0, 8)}...</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.name_zh} ({product.name_en})
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                    <button className={`px-2 py-1 rounded-full text-xs font-medium ${product.isActive ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {product.isActive ? 'Deactivate' : 'Activate'}
                    </button>
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
