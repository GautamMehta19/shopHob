import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Shield, ChevronUp, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import ConfirmStatusModal from './ConfirmStatusModal';
import { useEffect, useRef, useState } from 'react';
import api from '../utils/api';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    if (showProfileDropdown) fetchProfile();
  }, [showProfileDropdown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      const data = await response.data;
      setProfile(data);
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-colors duration-200"
          >
            ShopHub
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`transition-colors duration-200 ${isActive('/')
                ? 'text-blue-600 font-medium'
                : 'text-gray-700 hover:text-blue-600'
                }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`transition-colors duration-200 ${isActive('/products')
                ? 'text-blue-600 font-medium'
                : 'text-gray-700 hover:text-blue-600'
                }`}
            >
              Products
            </Link>
            {user && (
              <Link
                to="/orders"
                className={`transition-colors duration-200 ${isActive('/orders')
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-700 hover:text-blue-600'
                  }`}
              >
                Orders
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`flex items-center gap-1 transition-colors duration-200 ${isActive('/admin')
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-700 hover:text-blue-600'
                  }`}
              >
                <Shield size={16} />
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/cart"
                  className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  <ShoppingCart size={20} />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition duration-200"
                  >
                    <User size={16} />
                    <span className="hidden sm:inline">{user.firstName}</span>
                    {showProfileDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {/* Dropdown */}
                  {showProfileDropdown && (
                    <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="p-4 border-b">
                        <p className="text-sm font-medium text-gray-900">{profile?.fullName || user.firstName}</p>
                        <p className="text-xs text-gray-500">{profile?.email || user.email}</p>
                      </div>
                      <div className="flex flex-col px-4 py-2 space-y-2">
                        <Link
                          to="/profile"
                          state={profile}
                          className="text-gray-700 hover:text-blue-600 text-sm"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          View Profile
                        </Link>
                        <button
                          onClick={() => {
                            setShowLogoutConfirm(true);
                            setShowProfileDropdown(false);
                          }}
                          className="text-red-600 hover:text-red-700 text-sm text-left"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors duration-200"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
                {/* Logout Confirmation Modal */}
                {showLogoutConfirm && (
                  <ConfirmStatusModal
                    show={showLogoutConfirm}
                    Header="Confirm Logout"
                    Content="Are you sure you want to"
                    newStatus="logout"
                    onConfirm={() => {
                      logout();
                      setShowLogoutConfirm(false);
                    }}
                    onClose={() => setShowLogoutConfirm(false)}
                  />
                )}
              </>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;