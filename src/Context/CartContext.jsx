// src/Context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios"; //  ADD THIS

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // CART STATE
  const [cart, setCart] = useState(() => {
    if(typeof window === "undefined") return [];  
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // WISHLIST STATE
  const [wishlist, setWishlist] = useState(() => {
     if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // SINGLE BUY ITEM (BUY NOW)
  const [singleBuy, setSingleBuy] = useState(null);

  // ORDERS STATE
  const [orders, setOrders] = useState(() => {
     if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("orders");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Normalize price (avoid errors if strings)
  const normalizePrice = (price) => {
    if (price == null) return 0;
    if (typeof price === "number") return price;
    const cleaned = String(price).replace(/[^0-9.-]+/g, "");
    const n = parseFloat(cleaned);
    return Number.isNaN(n) ? 0 : n;
  };

  // ADD TO CART
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

  // UPDATE QUANTITY
  const updateQuantity = (id, newQty) => {
    setCart((prev) =>
      newQty <= 0
        ? prev.filter((item) => item.id !== id)
        : prev.map((item) =>
            item.id === id ? { ...item, quantity: newQty } : item
          )
    );
  };

  // REMOVE FROM CART
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // CLEAR CART
  const clearCart = () => {
    setCart([]);
  };

  // ADD TO WISHLIST
  const addToWishlist = (product) => {
    setWishlist((prev) => {
      const already = prev.some((i) => i.id === product.id);
      if (!already) return [...prev, product];
      return prev;
    });
  };

  // REMOVE FROM WISHLIST
  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((i) => i.id !== id));
  };

  // CHECK IF PRODUCT IS WISHLISTED
  const isWishlisted = (productId) =>
    wishlist.some((item) => item.id === productId);

  // MOVE TO CART FROM WISHLIST
  const moveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  // SAVE ORDER TO BACKEND
  const saveOrderToBackend = async (order) => {
    try {
      await axios.post("https://6916c7aba7a34288a27e5552.mockapi.io/orders", order);
      console.log("Order saved to backend:", order.orderId);
    } catch (error) {
      console.error("⚠️ Error saving to backend (still saved locally):", error);
    }
  };

  // CREATE ORDER (UPDATED WITH USER EMAIL)
  const createOrder = ({ items, shipping, paymentMethod, totals }) => {
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    const now = new Date().toISOString();
    
    //  GET USER EMAIL
    const user = JSON.parse(localStorage.getItem("user")) || {};

    const order = {
      id: orderId,
      orderId: orderId, // For compatibility with Orders.jsx
      email: user.email || "guest@example.com", // USER EMAIL
      customerName: shipping.fullName || "Guest", //  CUSTOMER NAME
      phone: shipping.phone || "N/A", //  PHONE
      items: items.map((it) => ({
        id: it.id,
        name: it.name,
        productName: it.name, //  For Orders.jsx compatibility
        price: normalizePrice(it.price),
        quantity: it.quantity || 1,
        image: it.image || null,
      })),
      shipping,
      shippingAddress: `${shipping.addressLine}, ${shipping.city}, ${shipping.zipCode}`, //  FOR ORDERS PAGE
      paymentMethod,
      subtotal: totals.subtotal, //  For Orders.jsx
      shipping: totals.shipping, //  For Orders.jsx
      tax: totals.tax, //  For Orders.jsx
      total: totals.grandTotal, //  For Orders.jsx
      status: "Processing", //  DEFAULT STATUS
      orderDate: now, //  For Orders.jsx
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

    //  SAVE TO BACKEND
    saveOrderToBackend(order);

    // Clear cart after order
    clearCart();

    return orderId;
  };

  // GET ORDER BY ID
  const getOrderById = (orderId) => orders.find((o) => o.id === orderId);

  // UPDATE ORDER STATUS
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) => {
      const next = prev.map((o) => {
        if (o.id !== orderId) return o;
        const now = new Date().toISOString();
        return {
          ...o,
          status: newStatus, //UPDATE STATUS
          statusHistory: [...o.statusHistory, { status: newStatus, at: now }],
        };
      });
      localStorage.setItem("orders", JSON.stringify(next));
      return next;
    });
  };

  // CART TOTALS
  const cartTotal = cart.reduce(
    (sum, item) => sum + normalizePrice(item.price) * (item.quantity || 1),
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // WISHLIST COUNT
  const wishlistCount = wishlist.length;

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // PROVIDER VALUE
  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
        moveToCart,
        cartTotal,
        cartCount,
        wishlistCount,
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
