import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ✅ Single product buy (Buy Now)
  const [singleBuy, setSingleBuy] = useState(null);

  // ✅ Normalize price
  const normalizePrice = (price) => {
    if (price == null) return 0;
    if (typeof price === "number") return price;
    const cleaned = String(price).replace(/[^0-9.-]+/g, "");
    const n = parseFloat(cleaned);
    return Number.isNaN(n) ? 0 : n;
  };

  // 🛒 Add to Cart
  const addToCart = (product) => {
    setCart((prev) => {
      const price = normalizePrice(product.price);
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...product, price, quantity: 1 }];
    });
  };

  // ➕ Update Quantity
  const updateQuantity = (id, newQty) => {
    setCart((prev) =>
      newQty <= 0
        ? prev.filter((item) => item.id !== id)
        : prev.map((item) =>
            item.id === id ? { ...item, quantity: newQty } : item
          )
    );
  };

  // ❌ Remove from Cart
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // 💖 Add to Wishlist
  const addToWishlist = (product) => {
    setWishlist((prev) => {
      const alreadyInWishlist = prev.some((item) => item.id === product.id);
      if (!alreadyInWishlist) {
        return [...prev, product];
      }
      return prev;
    });
  };

  // ❌ Remove from Wishlist
  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  // ✅ Check if in Wishlist
  const isWishlisted = (productId) =>
    wishlist.some((item) => item.id === productId);

  // 🧮 Cart total and count
  const cartTotal = cart.reduce(
    (sum, item) => sum + normalizePrice(item.price) * (item.quantity || 1),
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // 💾 Save to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
        cartTotal,
        cartCount,
        singleBuy,
        setSingleBuy,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
