import { Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Trash2, AlertTriangle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CartItem from "../components/CartItem";
import LoadingSpinner from "../components/LoadingSpinner";

const Cart = () => {
  const { items, total_amount, total_items, loading, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-600 mb-4">
          Please log in to view your cart
        </h2>
        <Link to="/login" className="btn-primary">
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner size="lg" text="Loading your cart..." />
      </div>
    );
  }

  const handleClearCart = async () => {
    if (
      window.confirm(
        "Are you sure you want to remove all items from your cart? This action cannot be undone."
      )
    ) {
      const result = await clearCart();
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <Link
              to="/"
              className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">Continue Shopping</span>
            </Link>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Shopping Cart
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500 mb-6">
              Add some products to get started
            </p>
            <Link to="/" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                {/* Cart Header with Clear Button */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Cart Items
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {total_items} {total_items === 1 ? "item" : "items"} in
                      your cart
                    </p>
                  </div>

                  {items.length > 0 && (
                    <button
                      onClick={handleClearCart}
                      className="flex items-center space-x-2 mt-3 sm:mt-0 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">Clear Cart</span>
                    </button>
                  )}
                </div>

                {/* Cart Items List */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <CartItem key={item.cart_id} item={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({total_items} items)</span>
                    <span>${parseFloat(total_amount).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-primary-600">
                        ${parseFloat(total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg">
                    Proceed to Checkout
                  </button>

                  <Link
                    to="/"
                    className="block w-full text-center btn-secondary"
                  >
                    Continue Shopping
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t">
                  <div className="text-sm text-gray-500 space-y-2">
                    <p className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Secure checkout
                    </p>
                    <p className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Free shipping on all orders
                    </p>
                    <p className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      30-day return policy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
