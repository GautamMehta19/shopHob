import React from 'react';
import { ShoppingCart, Package } from 'lucide-react';
import { useAuthStore } from '../../../src/store/authStore';
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

interface ProductCardProps {
  product: Product;
  onRequestAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onRequestAddToCart }) => {
  const { user } = useAuthStore();

  const handleClick = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }

    onRequestAddToCart(product);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <div className="relative">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <Package size={48} className="text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 0
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
            }`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <button
            onClick={handleClick}
            disabled={product.stock === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${product.stock === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
          >
            <ShoppingCart size={16} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
