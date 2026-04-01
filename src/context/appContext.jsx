import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Check seller status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/seller/is-auth");
      setIsSeller(data.success);
    } catch {
      setIsSeller(false);
    }
  };

  // ✅ Fetch user (NO error toast if not logged in)
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/user/is-auth");

      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cart || {});
      } else {
        setUser(null); // normal case
      }
    } catch (error) {
      // Only show error if it's NOT auth related
      if (error.response?.status !== 401) {
        toast.error("Failed to fetch user");
      }
      setUser(null);
    }
  };

  // ✅ Fetch products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/product/list");

      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Add to cart
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems || {});

    cartData[itemId] = (cartData[itemId] || 0) + 1;

    setCartItems(cartData);
    toast.success("Added to cart");
  };

  // ✅ Update cart item
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);

    if (quantity <= 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }

    setCartItems(cartData);
    toast.success("Cart updated");
  };

  // ✅ Cart count
  const cartCount = () => {
    return Object.values(cartItems).reduce((a, b) => a + b, 0);
  };

  // ✅ Total amount
  const totalCartAmount = () => {
    let total = 0;

    for (const item in cartItems) {
      const product = products.find((p) => p._id === item);

      if (product) {
        total += cartItems[item] * product.offerPrice;
      }
    }

    return Math.floor(total * 100) / 100;
  };

  // ✅ Remove from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] -= 1;

      if (cartData[itemId] <= 0) {
        delete cartData[itemId];
      }

      setCartItems(cartData);
      toast.success("Removed from cart");
    }
  };

  // ✅ Initial load
  useEffect(() => {
    fetchSeller();
    fetchProducts();
    fetchUser();
  }, []);

  // ✅ Sync cart with backend
  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/cart/update", { cartItems });

        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (user) {
      updateCart();
    }
  }, [cartItems]);

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    searchQuery,
    setSearchQuery,
    cartCount,
    totalCartAmount,
    axios,
    fetchProducts,
    setCartItems,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// ✅ Custom hook
export const useAppContext = () => {
  return useContext(AppContext);
};