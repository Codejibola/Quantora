//eslint-disable-next-line no-unused-vars
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

  // Fetch products for dropdown
  useEffect(() => {
    if (!token) return;
    apiFetch("http://localhost:5000/api/products", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, [token]);

  // Fetch today’s recorded sales
  const fetchSales = () => {
    apiFetch("http://localhost:5000/api/sales/today", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSales(data))
      .catch((err) => console.error(err));
  };
  useEffect(fetchSales, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected || !quantity || !price) return;
    setLoading(true);
    try {
      const res = await apiFetch("http://localhost:5000/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: selected,
          quantity: Number(quantity),
          price: Number(price),
        }),
      });
      if (!res.ok) throw new Error("Failed to record sale");
      setSelected("");
      setQuantity(1);
      setPrice("");
      fetchSales();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar title="Record Sales" />

        <main className="p-6 space-y-6">
          {/* Sales Entry Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-gray-800 rounded-xl shadow p-6 max-w-xl space-y-4"
          >
            <h2 className="text-xl font-semibold mb-2">Add Today’s Sale</h2>

            <label className="block">
              <span className="text-sm">Product</span>
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="mt-1 w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              >
                <option value="">-- Select Product --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm">Quantity</span>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="mt-1 w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </label>

              <label className="block">
                <span className="text-sm">Price (₦)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1 w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </label>
            </div>

            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded font-semibold mt-2"
            >
              {loading ? "Saving…" : "Add Sale"}
            </button>
          </motion.form>

          {/* Today’s Sales Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-x-auto bg-gray-800 rounded-xl shadow"
          >
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-700 text-left">
                  <th className="py-3 px-4">S/N</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Qty</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-6 px-4 text-center text-gray-400">
                      No sales recorded today.
                    </td>
                  </tr>
                ) : (
                  sales.map((s, i) => (
                    <tr
                      key={s.id}
                      className="border-b border-gray-700 hover:bg-gray-700/50 transition"
                    >
                      <td className="py-3 px-4">{i + 1}</td>
                      <td className="py-3 px-4">{s.product_name}</td>
                      <td className="py-3 px-4">{s.quantity}</td>
                      <td className="py-3 px-4">₦{s.price.toLocaleString()}</td>
                      <td className="py-3 px-4 font-semibold">
                        ₦{(s.price * s.quantity).toLocaleString()}
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
