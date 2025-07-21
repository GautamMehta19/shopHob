import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Shield, HeartHandshake } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ShopHub
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover amazing products at unbeatable prices. Your one-stop destination for all your shopping needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 inline-flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} />
              Shop Now
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose ShopHub?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Wide Selection</h3>
              <p className="text-gray-600">
                Thousands of products across multiple categories to choose from.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-emerald-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and reliable shipping to get your orders to you fast.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Shopping</h3>
              <p className="text-gray-600">
                Your data and transactions are protected with top-tier security.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartHandshake className="text-orange-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Round-the-clock customer support to help you with any questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white text-center">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers and discover your new favorite products today.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            <ShoppingBag size={20} />
            Explore Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;