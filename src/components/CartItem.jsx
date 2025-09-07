import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

const CartItem = ({ item }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateCartItem, removeFromCart } = useCart();

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1 || newQuantity > item.stock) return;

    setIsUpdating(true);
    const result = await updateCartItem(item.cart_id, newQuantity);

    if (!result.success) {
      alert(result.error);
    }

    setIsUpdating(false);
  };

  const handleRemove = async () => {
    if (window.confirm("Remove this item from cart?")) {
      const result = await removeFromCart(item.cart_id);

      if (!result.success) {
        alert(result.error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-3">
      {/* Top Section: Image + Product Info */}
      <div className="flex space-x-3 mb-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={
              item.image_url ||
              "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400"
            }
            alt={item.name}
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400";
            }}
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 pr-2">
              {item.name}
            </h3>
            <button
              onClick={handleRemove}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            ${parseFloat(item.price).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Bottom Section: Quantity Controls + Total Price */}
      <div className="flex items-center justify-between">
        {/* Quantity Controls */}
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500 font-medium">Qty:</span>
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>

            <span className="px-3 py-2 text-sm font-semibold text-gray-800 bg-gray-50 min-w-[40px] text-center">
              {isUpdating ? "..." : item.quantity}
            </span>

            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating || item.quantity >= item.stock}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Total Price */}
        <div className="text-right">
          <p className="text-lg sm:text-xl font-bold text-primary-600">
            ${parseFloat(item.total_price).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
