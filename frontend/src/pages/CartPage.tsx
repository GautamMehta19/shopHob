import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../../../src/store/cartStore';
import { useAuthStore } from '../../../src/store/authStore';
import api from '../../../src/utils/api';
import toast from 'react-hot-toast';
import ConfirmStatusModal from '../components/ConfirmStatusModal';

const CartPage = () => {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showCheckoutConfirm, setShowCheckoutConfirm] = React.useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsLoading(true);

    try {
      const orderItems = items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      await api.post('/orders', { items: orderItems });
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-6">
          <ShoppingBag size={64} className="mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
        >
          <ShoppingBag size={20} />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/products"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          Continue Shopping
        </Link>
        <div className="h-6 w-px bg-gray-300"></div>
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ShoppingBag className="text-gray-400" size={32} />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-blue-600 font-medium">${item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="w-12 text-center font-medium">{item.quantity}</span>

                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowCheckoutConfirm(true)}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                'Proceed to Checkout'
              )}
            </button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              By proceeding to checkout, you agree to our terms and conditions.
            </p>
          </div>
        </div>
        {showCheckoutConfirm && (
          <ConfirmStatusModal
            show={showCheckoutConfirm}
            Header="Confirm Checkout"
            Content="Are you sure you want to place the order?"
            newStatus="checkout"
            onConfirm={handleCheckout}
            onClose={() => setShowCheckoutConfirm(false)}
          />
        )}

      </div>
    </div>
  );
};

export default CartPage;