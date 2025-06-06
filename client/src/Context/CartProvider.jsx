import { createContext, useReducer } from "react";
import { toast, Bounce } from "react-toastify";

export const CartContext = createContext();
const initialState = {
  cartItems: [],
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "AddToCart": {
      const isExisting = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      if (isExisting) {
        return state;
      }

      const newProduct = { ...action.payload, qty: 1 };
      const newCartItem = [...state.cartItems, newProduct];

      toast.success(`${action.payload.name} is added to cart`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });

      return {
        ...state,
        cartItems: newCartItem,
      };
    }

    case "RemoveItem": {
      const filterCartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );
      return {
        ...state,
        cartItems: filterCartItems,
      };
    }

    case "Increment": {
      const updateCartItems = state.cartItems.map((item) =>
        item._id === action.payload.id ? { ...item, qty: item.qty + 1 } : item
      );
      return {
        ...state,
        cartItems: updateCartItems,
      };
    }

    case "Decreament": {
      const updatedCartItems = state.cartItems.map((item) =>
        item._id === action.payload.id && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      );
      return {
        ...state,
        cartItems: updatedCartItems,
      };
    }

    case "ClearCart": {
      return {
        ...state,
        cartItems: [],
      };
    }

    default:
      return state;
  }
};

const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
