import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

// ========== PRODUCTS ==========
export const getProducts = () => API.get('/products');
export const createProduct = (payload) => API.post('/products', {
  ...payload,
  id: Date.now().toString(),
  reviews: 4.5,
  createdAt: new Date().toISOString(),
});
export const updateProduct = (id, payload) => API.put(`/products/${id}`, {
  ...payload,
  updatedAt: new Date().toISOString(),
});
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const archiveProduct = (id) => API.patch(`/products/${id}`, {
  archived: true,
  archivedAt: new Date().toISOString(),
});

// ========== ORDERS ==========
export const getOrders = async () => {
  try {
    return await API.get('/orders');
  } catch {
    return { data: [] };
  }
};
export const updateOrder = (id, payload) => API.patch(`/orders/${id}`, {
  ...payload,
  updatedAt: new Date().toISOString(),
});
export const deleteOrder = (id) => API.delete(`/orders/${id}`);

// ========== USERS ==========
export const getUsers = () => API.get('/users');
export const blockUser = (id) => API.patch(`/users/${id}`, {
  blocked: true,
  blockedAt: new Date().toISOString(),
});
export const unblockUser = (id) => API.patch(`/users/${id}`, {
  blocked: false,
  unblockedAt: new Date().toISOString(),
});
export const deleteUser = (id) => API.delete(`/users/${id}`);

// ========== DASHBOARD STATS ==========
export const getDashboardStats = async () => {
  try {
    const [productsRes, ordersRes, usersRes] = await Promise.all([
      getProducts(),
      getOrders(),
      getUsers(),
    ]);

    const products = productsRes.data || [];
    const orders = ordersRes.data || [];
    const users = usersRes.data || [];
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    return {
      data: {
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue,
        recentOrders: orders.slice(-5).reverse(),
        recentUsers: users.slice(-5).reverse(),
        pendingOrders: orders.filter(o => o.status === 'Pending').length,
        processingOrders: orders.filter(o => o.status === 'Processing').length,
        shippedOrders: orders.filter(o => o.status === 'Shipped').length,
        deliveredOrders: orders.filter(o => o.status === 'Delivered').length,
      },
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

export default API;
