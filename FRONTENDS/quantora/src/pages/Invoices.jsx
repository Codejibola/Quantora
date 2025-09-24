// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Download, Eye } from "lucide-react";
import apiFetch from "../utils/apiFetch.js";

export default function Invoices() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const token = localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false); 

  useEffect(() => {
    const current = new Date().getFullYear();
    setYears(Array.from({ length: 5 }, (_, i) => current - i));
  }, []);

  useEffect(() => {
    if (!token) return;
    apiFetch(`https://quantora-ap7u.onrender.com/api/sales/daily?year=${year}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch daily sales");
        return res.json();
      })
      .then((data) => setDailySales(data))
      .catch((err) => console.error(err));
  }, [year, token]);

  const handleDownload = async (date) => {
    try {
      const res = await apiFetch(
        `https://quantora-ap7u.onrender.com/api/sales/daily/${date}/pdf`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sales-${date}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleView = (date) => {
    window.open(
      `https://quantora-ap7u.onrender.com/api/sales/daily/${date}/view?token=${token}`,
      "_blank"
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar isOpen={menuOpen} setIsOpen={setMenuOpen} />
      <div className="flex-1 flex flex-col">
        <Topbar onMenuClick={() => setMenuOpen(true)} />

        <main className="px-2 sm:px-4 md:px-6 py-6 space-y-6">
          {/* ===== Year filter ===== */}
          <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
            <label className="text-base sm:text-lg font-semibold text-teal-700 flex flex-wrap items-center gap-2">
              Select Year:
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="px-3 py-2 rounded border border-teal-300 bg-white
                           focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* ===== Sales Table ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200"
          >
            <table className="min-w-full text-sm sm:text-base border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="py-3 px-4">S/N</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dailySales.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-6 px-4 text-center text-gray-500 text-sm sm:text-base"
                    >
                      No sales found for {year}.
                    </td>
                  </tr>
                ) : (
                  dailySales.map((row, index) => (
                    <tr
                      key={row.date}
                      className="border-b border-gray-200 hover:bg-teal-50 transition"
                    >
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">
                        {new Date(row.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-semibold text-teal-700">
                        ₦{Number(row.total).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center space-x-3">
                        <button
                          onClick={() => handleView(row.date)}
                          className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-800 font-medium"
                        >
                          <Eye size={16} /> View
                        </button>
                        <button
                          onClick={() => handleDownload(row.date)}
                          className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-800 font-medium"
                        >
                          <Download size={16} /> PDF
                        </button>
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

