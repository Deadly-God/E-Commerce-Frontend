import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { total_items } = useCart();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setShowProfileDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest(".profile-dropdown")) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showProfileDropdown]);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto px-4">
        <div className="flex items-center py-4">
          {/* Logo - Fixed position from left */}
          <div className="ml-0">
            <Link to="/" className="flex items-center">
              <svg width="120" height="32" viewBox="0 0 120 32" className="h-8">
                {/* Logo Icon Placeholder*/}

                {/* Logo Text */}
                <text
                  x="2"
                  y="24"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  fontSize="24"
                  fontWeight="bold"
                  fill="#1f2937"
                >
                  Astra
                </text>
              </svg>
            </Link>
          </div>

          {/* Spacer to push navigation to the right */}
          <div className="flex-1"></div>

          {/* Navigation Links - Right side */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {/* Cart Icon with Badge */}
                <Link
                  to="/cart"
                  className="relative text-gray-600 hover:text-primary-600 transition-colors group"
                >
                  <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  {total_items > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {total_items > 99 ? "99+" : total_items}
                    </span>
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <User className="h-6 w-6" />
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            Hi, {user?.name}
                          </p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <User className="h-6 w-6" />
                </button>

                {/* Dropdown Menu for logged out users */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-2">
                      <Link
                        to="/login"
                        onClick={() => setShowProfileDropdown(false)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setShowProfileDropdown(false)}
                        className="block w-full text-left px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 transition-colors"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
