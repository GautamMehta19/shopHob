import { useState, useEffect } from 'react';
import { Package, Calendar, DollarSign, Eye } from 'lucide-react';
import { useAuthStore } from '../../../src/store/authStore';
import api from '../../../src/utils/api';
import toast from 'react-hot-toast';
import ConfirmStatusModal from '../components/ConfirmStatusModal';

export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    imageUrl?: string;
  };
}

interface Order {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { user } = useAuthStore();
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/my-orders');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };


  const handleCancelOrder = async (orderId: number) => {
    try {
      await api.patch(`/orders/${orderId}`, { status: 'cancelled' });
      toast.success('Order cancelled');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to cancel order');
    }
  };


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please login to view your orders</h2>
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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">Track and manage your order history</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600">When you place orders, they'll appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    <Eye size={16} />
                    {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package size={16} />
                    <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign size={16} />
                    <span className="font-semibold">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {selectedOrder?.id === order.id && (
                <div className="p-6 bg-gray-50">
                  <h4 className="font-semibold text-gray-900 mb-4">Order Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-lg">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {item.product.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="text-gray-400" size={24} />
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{item.product.name}</h5>
                          <p className="text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">each</p>
                        </div>
                      </div>
                    ))}

                    {!['cancelled', 'delivered'].includes(order.status.toLowerCase()) && (
                      <div className="pt-4">
                        <button
                          onClick={() => setShowCancelModal(true)}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                        >
                          Cancel Order
                        </button>

                        <ConfirmStatusModal
                          Header="Confirm Cancellation"
                          Content="Are you sure you want to cancel this order"
                          newStatus="cancelled"
                          show={showCancelModal}
                          onConfirm={() => {
                            handleCancelOrder(order.id);
                            setShowCancelModal(false);
                            setSelectedOrder(null); // Optional: close expanded view
                          }}
                          onClose={() => setShowCancelModal(false)}
                        />
                      </div>
                    )}



                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;