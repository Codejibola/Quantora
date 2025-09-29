// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import apiFetch from "../utils/apiFetch.js";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
  });
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false); 
  const [currentUser, setCurrentUser] = useState(null);


  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []); 

  const fetchProducts = () => {
    if (!token) return;
    apiFetch("https://quantora-ap7u.onrender.com/api/products", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or server error");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setError("");
    if (!token) return setError("You must be logged in.");

    const payload = {
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      category: formData.category,
    };

    try {
      const url = editingId
        ? `https://quantora-ap7u.onrender.com/api/products/${editingId}`
        : "https://quantora-ap7u.onrender.com/api/products";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.json();
        throw new Error(msg.message || "Failed to save product");
      }

      await res.json();
      fetchProducts();
      setFormData({ name: "", price: "", stock: "", category: "" });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await apiFetch(`https://quantora-ap7u.onrender.com/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.units,
      category: product.category || "",
    });
    setShowForm(true);
  };

  const filteredProducts = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      (p.category && p.category.toLowerCase().includes(term))
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={menuOpen} setIsOpen={setMenuOpen} />

      <div className="flex-1 flex flex-col">
        <Topbar
          onMenuClick={() => setMenuOpen(true)}
          userName={currentUser?.name} 
        />

        <main className="px-2 sm:px-4 md:px-6 py-6 space-y-6">
          {/* Header Row */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[180px] px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => {
                setEditingId(null);
                setFormData({ name: "", price: "", stock: "", category: "" });
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={18} /> Add Product
            </button>
          </div>

          {/* Add/Edit Product Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.form
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSaveProduct}
                className="bg-white p-6 rounded-xl w-full max-w-md space-y-4 shadow-lg"
              >
                <h2 className="text-xl font-bold">
                  {editingId ? "Edit Product" : "Add Product"}
                </h2>
                {error && <p className="text-red-500">{error}</p>}

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                  className="w-full border p-2 rounded"
                />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Price"
                  required
                  className="w-full border p-2 rounded"
                />
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Stock"
                  required
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Category"
                  className="w-full border p-2 rounded"
                />

                <div className="flex flex-wrap justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 w-full sm:w-auto"
                  >
                    {editingId ? "Update" : "Save"}
                  </button>
                </div>
              </motion.form>
            </div>
          )}

          {/* Products Table */}
          <motion.div
            className="overflow-x-auto bg-white rounded-xl shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <table className="min-w-full text-left border-collapse text-sm sm:text-base">
              <thead className="bg-blue-100 text-gray-700">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No products found.
                    </td>
                  </tr>
                )}
                {filteredProducts.map((p) => (
                  <motion.tr
                    key={p.id}
                    className="border-b hover:bg-blue-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td className="py-3 px-4">{p.name}</td>
                    <td className="py-3 px-4">₦{Number(p.price).toFixed(2)}</td>
                    <td className="py-3 px-4">{p.units}</td>
                    <td className="py-3 px-4">{p.category}</td>
                    <td className="py-3 px-4 flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(p)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
