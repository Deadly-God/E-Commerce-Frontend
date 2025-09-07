import { useState } from "react";
import { Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsAdding(true);
    const result = await addToCart(product.id, 1);

    if (result.success) {
      // Could add a toast notification here
      console.log("Added to cart successfully");
    } else {
      alert(result.error);
    }

    setIsAdding(false);
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="aspect-w-16 aspect-h-9 mb-4">
        <img
          src={
            product.image_url ||
            "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400"
          }
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400";
          }}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {product.name}
          </h3>
          <span className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">
            {product.category_name}
          </span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center pt-2">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary-600">
              ${product.price}
            </span>
            <span className="text-sm text-gray-500">
              Stock: {product.stock}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.stock === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              product.stock === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : isAdding
                ? "bg-primary-400 text-white cursor-not-allowed"
                : "bg-primary-600 hover:bg-primary-700 text-white"
            }`}
          >
            {isAdding ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Adding...</span>
              </>
            ) : product.stock === 0 ? (
              <>
                <span>Out of Stock</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
