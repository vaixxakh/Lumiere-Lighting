// src/Context/CartContext.jsx
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

  const [singleBuy, setSingleBuy] = useState(null);

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem("orders");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const normalizePrice = (price) => {
    if (price == null) return 0;
    if (typeof price === "number") return price;
    const cleaned = String(price).replace(/[^0-9.-]+/g, "");
    const n = parseFloat(cleaned);
    return Number.isNaN(n) ? 0 : n;
  };

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

  const updateQuantity = (id, newQty) => {
    setCart((prev) =>
      newQty <= 0
        ? prev.filter((item) => item.id !== id)
        : prev.map((item) =>
            item.id === id ? { ...item, quantity: newQty } : item
          )
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      const already = prev.some((i) => i.id === product.id);
      if (!already) return [...prev, product];
      return prev;
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((i) => i.id !== id));
  };

  const isWishlisted = (productId) =>
    wishlist.some((item) => item.id === productId);

  const createOrder = ({ items, shipping, paymentMethod, totals }) => {
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    const now = new Date().toISOString();
    const order = {
      id: orderId,
      items: items.map((it) => ({
        id: it.id,
        name: it.name,
        price: normalizePrice(it.price),
        quantity: it.quantity || 1,
        image: it.image || null,
      })),
      shipping,
      paymentMethod,
      totals,
      statusHistory: [
        { status: "Order Placed", at: now },
        { status: "Processing", at: now },
      ],
      createdAt: now,
    };

    setOrders((prev) => {
      const next = [order, ...prev];
      localStorage.setItem("orders", JSON.stringify(next));
      return next;
    });

    return orderId;
  };

  const getOrderById = (orderId) => orders.find((o) => o.id === orderId);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) => {
      const next = prev.map((o) => {
        if (o.id !== orderId) return o;
        const now = new Date().toISOString();
        return {
          ...o,
          statusHistory: [...o.statusHistory, { status: newStatus, at: now }],
        };
      });
      localStorage.setItem("orders", JSON.stringify(next));
      return next;
    });
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + normalizePrice(item.price) * (item.quantity || 1),
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // ✅ NEW: wishlist count for navbar
  const wishlistCount = wishlist.length;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

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
        wishlistCount, // ✅ added here for navbar badges
        singleBuy,
        setSingleBuy,
        orders,
        createOrder,
        getOrderById,
        updateOrderStatus,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
