import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../Services/adminApi';
import { Edit, Trash2, Plus, Search, X,  AlertCircle  } from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ 
    name: '', 
    price: '', 
    category: 'Chandeliers', 
    image: '', 
    description: '' 
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data || []);
      setLoading(false);
    } catch (err) {
      setError('Error loading products');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setSubmitting(true);

    if (!form.name || !form.price || !form.image || !form.description) {
      setError('All fields are required');
      setSubmitting(false);
      return;
    }

    try {
      if (editingId) {
        await updateProduct(editingId, form);
        setSuccessMsg('Product updated successfully!');
      } else {
       const res = await createProduct(form);
       const newProduct = res.data;
       setProducts((prevProducts) => [newProduct,...prevProducts] )
        setSuccessMsg('Product created successfully!');
      }
      setTimeout(() => {
        setForm({ name: '', price: '', category: 'Chandeliers', image: '', description: '' });
        setEditingId(null);
        setShowForm(false);
        setSuccessMsg('');
      }, 1500);
    } catch (err) {
      setError('Error saving product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product.id);
    setShowForm(true);
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setSuccessMsg('Product deleted successfully!');
        setTimeout(() => {
          fetchProducts();
          setSelectedProduct(null);
          setSuccessMsg('');
        }, 1500);
      } catch (err) {
        setError('Error deleting product');
      }
    }
  };

  const handleCancel = () => {
    setForm({ name: '', price: '', category: 'Chandeliers', image: '', description: '' });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin">
          <div className="text-yellow-500 text-6xl">⊙</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">Product Management</h1>
          <p className="text-gray-600 mt-1 text-sm">Total: <span className="font-bold text-yellow-500">{products.length}</span></p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setForm({ name: '', price: '', category: 'Chandeliers', image: '', description: '' });
            setError('');
          }}
          className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition shadow-lg active:scale-95"
        >
          <Plus size={20} /> {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg animate-pulse">
          <p className="text-green-700 font-semibold text-sm">{successMsg}</p>
        </div>
      )}

      {/* Stats - Scrollable on Mobile */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 min-w-max sm:min-w-full">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl shadow-lg p-4 min-w-[150px] sm:min-w-auto">
            <p className="text-blue-100 text-xs font-semibold">Total</p>
            <p className="text-3xl font-bold mt-2">{products.length}</p>
            <p className="text-xs mt-1">Products</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg sm:rounded-xl shadow-lg p-4 min-w-[150px] sm:min-w-auto">
            <p className="text-yellow-100 text-xs font-semibold">Chandeliers</p>
            <p className="text-3xl font-bold mt-2">{products.filter(p => p.category === 'Chandeliers').length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg sm:rounded-xl shadow-lg p-4 min-w-[150px] sm:min-w-auto">
            <p className="text-green-100 text-xs font-semibold">Floor Lights</p>
            <p className="text-3xl font-bold mt-2">{products.filter(p => p.category === 'Floor Lights').length}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg sm:rounded-xl shadow-lg p-4 min-w-[150px] sm:min-w-auto">
            <p className="text-purple-100 text-xs font-semibold">Other</p>
            <p className="text-3xl font-bold mt-2">{products.filter(p => !['Chandeliers', 'Floor Lights'].includes(p.category)).length}</p>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Form - Responsive */}
      {showForm && (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-8 border-l-4 border-yellow-500">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-bold">{editingId ? ' Edit' : 'Add'}</h2>
            <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-lg transition">
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mb-4 sm:mb-6 flex items-start gap-3 rounded-lg">
              <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name & Price - Stack on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  placeholder="Royal Crystal Chandelier"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Price (₹) *</label>
                <input
                  type="number"
                  placeholder="58200"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition text-sm"
                  required
                />
              </div>
            </div>

            {/* Category & Image - Stack on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition text-sm"
                >
                  <option>Chandeliers</option>
                  <option>Pendant Lights</option>
                  <option>Floor Lights</option>
                  <option>Table Lamps</option>
                  <option>Wall Lights</option>
                  <option>Outdoor Lights</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Image URL *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://..."
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition text-sm"
                    required
                  />
                  {/* <button type="button" className="p-2 sm:p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                    <Upload size={18} className="text-gray-600" />
                  </button> */}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Description (Max 5 words) *</label>
              <textarea
                placeholder="Luxurious gold crystal chandelier"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition text-sm"
                rows="3"
                required
              />
            </div>

            {/* Preview Image */}
            {form.image && (
              <div className="mt-4">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Preview</label>
                <img src={form.image} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-black font-bold py-2 sm:py-3 rounded-lg transition shadow-lg active:scale-95 text-sm"
              >
                {submitting ? 'Saving...' : (editingId ? ' Update' : 'Create')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 sm:py-3 rounded-lg transition text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar - Responsive */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-400 transition text-sm"
          />
        </div>
      </div>

      {/* Products Table/Cards - Responsive */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(p => (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className="hover:bg-yellow-50 transition cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/56'}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800 text-sm">{p.name}</p>
                      <p className="text-xs text-gray-500">ID: {p.id}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-yellow-500 font-bold text-sm">₹{p.price}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(p);
                          }}
                          className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded transition"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(p.id);
                          }}
                          className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500 text-sm">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-3 p-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(p => (
              <div
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/80'}
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-sm line-clamp-2">{p.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold mr-2">
                        {p.category}
                      </span>
                    </p>
                    <p className="text-yellow-500 font-bold text-sm mt-2">₹{p.price}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(p);
                    }}
                    className="flex-1 p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded text-sm font-semibold transition flex items-center justify-center gap-2"
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(p.id);
                    }}
                    className="flex-1 p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded text-sm font-semibold transition flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Product Details Modal - Responsive */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black p-4 sm:p-6 flex justify-between items-start sticky top-0">
              <h3 className="text-lg sm:text-2xl font-bold pr-4">{selectedProduct.name}</h3>
              <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-yellow-600 rounded-lg flex-shrink-0">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-48 sm:h-64 object-cover rounded-lg" />
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase">Category</p>
                    <p className="text-base sm:text-lg font-semibold text-gray-800 mt-1">{selectedProduct.category}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase">Price</p>
                    <p className="text-2xl sm:text-3xl font-bold text-yellow-500 mt-1">₹{selectedProduct.price}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase">Description</p>
                    <p className="text-sm text-gray-800 mt-1">{selectedProduct.description}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase">Rating</p>
                    <p className="text-base font-semibold text-gray-800 mt-1">⭐ {selectedProduct.reviews || 4.5}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t pt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    handleEdit(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 sm:py-3 rounded-lg transition flex items-center justify-center gap-2 text-sm"
                >
                  <Edit size={16} /> Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedProduct.id);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 sm:py-3 rounded-lg transition flex items-center justify-center gap-2 text-sm"
                >
                  <Trash2 size={16} /> Delete
                </button>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 sm:py-3 rounded-lg transition text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
