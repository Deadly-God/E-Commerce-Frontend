import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { total_items } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center py-4">
          {/* Logo - Fixed position from left */}
          <div className="ml-0">
            <Link to="/" className="flex items-center">
              <svg width="120" height="32" viewBox="0 0 120 32" className="h-8">
                {/* Logo Icon Placeholder*/}

                {/* Logo Text */}
                <text
                  x="28"
                  y="22"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  fontSize="18"
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

                {/* Profile Icon */}
                <button className="text-gray-600 hover:text-primary-600 transition-colors">
                  <User className="h-6 w-6" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
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
