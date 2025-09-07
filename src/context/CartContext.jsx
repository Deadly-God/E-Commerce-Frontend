import { createContext, useContext, useReducer, useEffect } from "react";
import { cartAPI } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_CART":
      return { ...state, ...action.payload, loading: false };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "CLEAR_CART":
      return {
        items: [],
        total_amount: 0,
        total_items: 0,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

const initialState = {
  items: [],
  total_amount: 0,
  total_items: 0,
  loading: false,
  error: null,
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated) {
      dispatch({ type: "CLEAR_CART" });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await cartAPI.get();
      dispatch({ type: "SET_CART", payload: response.data.data });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.error || "Failed to fetch cart",
      });
    }
  };

  const addToCart = async (item_id, quantity = 1) => {
    try {
      await cartAPI.add({ item_id, quantity });
      await fetchCart(); // Refresh cart
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to add item to cart";
      return { success: false, error: errorMessage };
    }
  };

  const updateCartItem = async (cart_id, quantity) => {
    try {
      await cartAPI.update(cart_id, { quantity });
      await fetchCart(); // Refresh cart
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to update cart item";
      return { success: false, error: errorMessage };
    }
  };

  const removeFromCart = async (cart_id) => {
    try {
      await cartAPI.remove(cart_id);
      await fetchCart(); // Refresh cart
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to remove item from cart";
      return { success: false, error: errorMessage };
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      dispatch({ type: "CLEAR_CART" });
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to clear cart";
      return { success: false, error: errorMessage };
    }
  };

  // Fetch cart when user authentication status changes
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
