import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Package, DollarSign, Users, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '../../../src/store/authStore';
import api from '../../../src/utils/api';
import toast from 'react-hot-toast';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category: string;
}

interface Order {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  items: Array<{
    quantity: number;
    product: {
      name: string;
    };
  }>;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: '',
  });

  const { user } = useAuthStore();
  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchProducts();
      fetchOrders();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
      };

      if (editingProduct) {
        await api.patch(`/products/${editingProduct.id}`, productData);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', productData);
        toast.success('Product created successfully');
      }

      resetForm();
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      imageUrl: '',
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleEditProduct = (product: Product) => {
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      imageUrl: product.imageUrl || '',
    });
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await api.patch(`/orders/${orderId}`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders(); // Refresh orders after update
    } catch (error) {
      toast.error('Failed to update status');
    }
  };


  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalProducts = products.length;
  const totalOrders = orders.length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your store products and orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Package className="text-emerald-600" size={24} />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-4 text-sm font-medium transition-colors duration-200 ${activeTab === 'products'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Products Management
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-4 text-sm font-medium transition-colors duration-200 ${activeTab === 'orders'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Orders Management
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Products</h2>
                <button
                  onClick={() => setShowProductForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Plus size={16} />
                  Add Product
                </button>
              </div>

              {/* Product Form Modal */}
              {showProductForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>

                    <form onSubmit={handleProductSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Product Name
                        </label>
                        <input
                          type="text"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          required
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stock
                          </label>
                          <input
                            type="number"
                            value={productForm.stock}
                            onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image URL (optional)
                        </label>
                        <input
                          type="url"
                          value={productForm.imageUrl}
                          onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          {editingProduct ? 'Update Product' : 'Add Product'}
                        </button>
                        <button
                          type="button"
                          onClick={resetForm}
                          className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Stock</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="text-gray-400" size={20} />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-600 truncate max-w-xs">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{product.category}</td>
                        <td className="py-3 px-4 text-gray-900 font-medium">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 10
                            ? 'bg-green-100 text-green-800'
                            : product.stock > 0
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                            }`}>
                            {product.stock} units
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-1 text-blue-600 hover:text-blue-700 transition-colors duration-200"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-1 text-red-600 hover:text-red-700 transition-colors duration-200"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Orders</h2>

              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                        >
                          {['pending', 'shipped', 'delivered', 'cancelled'].map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>


                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      <p><strong>Customer:</strong> {order.user.firstName} {order.user.lastName}</p>
                      <p><strong>Email:</strong> {order.user.email}</p>
                      <p><strong>Items:</strong> {order.items.map(item =>
                        `${item.product.name} (${item.quantity})`
                      ).join(', ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;