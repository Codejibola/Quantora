// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import apiFetch from "../utils/apiFetch.js";

export default function RecordSales() {
  const token = localStorage.getItem("token");
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // <— for mobile sidebar

  /* ------------ Fetch Helpers ------------ */
  const fetchProducts = () => {
    if (!token) return;
    apiFetch("https://quantora-ap7u.onrender.com/api/products", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setProducts)
      .catch(console.error);
  };

  const fetchSales = () => {
    if (!token) return;
    apiFetch("https://quantora-ap7u.onrender.com/api/sales", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setSales)
      .catch(console.error);
  };

  useEffect(() => {
    fetchProducts();
    fetchSales();
  }, [token]);

  /* ------------ Submit ------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected || !quantity || !price) return;
    setLoading(true);
    try {
      await apiFetch("https://quantora-ap7u.onrender.com/api/updateStock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: Number(selected),
          quantity: Number(quantity),
        }),
      });

      await apiFetch("https://quantora-ap7u.onrender.com/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: Number(selected),
          quantity: Number(quantity),
          price: Number(price),
        }),
      });

      fetchProducts();
      fetchSales();
      setSelected("");
      setQuantity(1);
      setPrice("");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-gray-900">
      {/* Sidebar slides in/out on small screens */}
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="flex-1 flex flex-col">
        {/* Pass toggle handler to Topbar */}
        <Topbar title="Record Sales" onMenuClick={() => setMenuOpen(true)} />

        <main className="p-4 sm:p-6 space-y-6">
          {/* -------- Sales Entry Form -------- */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-xl shadow p-4 sm:p-6 max-w-xl w-full mx-auto space-y-4"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-teal-700 mb-2">
              Add Today’s Sale
            </h2>

            <label className="block">
              <span className="text-sm text-gray-700">Product</span>
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
              >
                <option value="">-- Select Product --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Stock: {p.units})
                  </option>
                ))}
              </select>
            </label>

            {/* Stack on mobile, 2-cols on ≥sm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-gray-700">Quantity</span>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-700">Unit Price (₦)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
                />
              </label>
            </div>

            <button
              disabled={loading}
              className={`w-full py-2 rounded font-semibold mt-2 transition-colors ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              {loading ? "Saving…" : "Add Sale"}
            </button>
          </motion.form>

          {/* -------- Sales Table -------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow"
          >
            <table className="min-w-full text-sm sm:text-base">
              <thead>
                <tr className="bg-teal-50 text-left">
                  <th className="py-3 px-2 sm:px-4">S/N</th>
                  <th className="py-3 px-2 sm:px-4">Product</th>
                  <th className="py-3 px-2 sm:px-4">Qty</th>
                  <th className="py-3 px-2 sm:px-4">Price</th>
                  <th className="py-3 px-2 sm:px-4">Total</th>
                  <th className="py-3 px-2 sm:px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {sales.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-6 px-4 text-center text-gray-500"
                    >
                      No sales recorded.
                    </td>
                  </tr>
                ) : (
                  sales.map((s, i) => (
                    <tr
                      key={s.id || i}
                      className="border-b border-gray-200 hover:bg-teal-50 transition"
                    >
                      <td className="py-3 px-2 sm:px-4">{i + 1}</td>
                      <td className="py-3 px-2 sm:px-4">
                        {s.product_name || s.productId}
                      </td>
                      <td className="py-3 px-2 sm:px-4">{s.quantity}</td>
                      <td className="py-3 px-2 sm:px-4">
                        ₦{Number(s.price).toLocaleString()}
                      </td>
                      <td className="py-3 px-2 sm:px-4 font-semibold">
                        ₦
                        {(Number(s.price) * Number(s.quantity)).toLocaleString()}
                      </td>
                      <td className="py-3 px-2 sm:px-4">
                        {new Date(s.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
