// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Download, Eye } from "lucide-react";

export default function Invoices() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const token = localStorage.getItem("token");

  // Build dropdown list of last 5 years
  useEffect(() => {
    const current = new Date().getFullYear();
    setYears(Array.from({ length: 5 }, (_, i) => current - i));
  }, []);

  // Fetch invoices on year change
  useEffect(() => {
    if (!token) return;
    fetch(`http://localhost:5000/api/invoices?year=${year}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch invoices");
        return res.json();
      })
      .then((data) => setInvoices(data))
      .catch((err) => console.error(err));
  }, [year, token]);

  const handleDownload = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/invoices/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleView = (id) => {
    window.open(`http://localhost:5000/api/invoices/${id}/view?token=${token}`, "_blank");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar title="Invoices" />

        <main className="p-6 space-y-6">
          {/* Year filter */}
          <div className="flex justify-between items-center mb-4">
            <label className="text-lg font-semibold text-teal-700">
              Select Year:
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="ml-3 px-3 py-2 rounded border border-teal-300 bg-white
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

          {/* Invoices Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200"
          >
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="py-3 px-4">S/N</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-6 px-4 text-center text-gray-500">
                      No invoices found for {year}.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv, index) => (
                    <tr
                      key={inv.id}
                      className="border-b border-gray-200 hover:bg-teal-50 transition"
                    >
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">
                        {new Date(inv.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-semibold text-teal-700">
                        ₦{Number(inv.amount).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center space-x-3">
                        <button
                          onClick={() => handleView(inv.id)}
                          className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-800 font-medium"
                        >
                          <Eye size={16} /> View
                        </button>
                        <button
                          onClick={() => handleDownload(inv.id)}
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
