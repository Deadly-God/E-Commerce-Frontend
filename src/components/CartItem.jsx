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
    if (
      window.confirm("Are you sure you want to remove this item from cart?")
    ) {
      const result = await removeFromCart(item.cart_id);

      if (!result.success) {
        alert(result.error);
      }
    }
  };

  return (
    <div className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={
            item.image_url ||
            "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400"
          }
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400";
          }}
        />
      </div>

      {/* Product Details */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
        <p className="text-gray-600">${item.price}</p>
        <p className="text-sm text-gray-500">Stock: {item.stock}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={isUpdating || item.quantity <= 1}
          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus className="h-4 w-4" />
        </button>

        <span className="text-lg font-semibold w-8 text-center">
          {isUpdating ? "..." : item.quantity}
        </span>

        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={isUpdating || item.quantity >= item.stock}
          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Total Price */}
      <div className="text-right">
        <p className="text-lg font-bold text-primary-600">
          ${item.total_price}
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        title="Remove from cart"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
};

export default CartItem;
