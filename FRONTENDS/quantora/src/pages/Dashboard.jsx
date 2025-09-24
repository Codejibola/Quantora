//eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", sales: 250 },
  { month: "Feb", sales: 220 },
  { month: "Mar", sales: 260 },
  { month: "Apr", sales: 290 },
  { month: "May", sales: 830 },
  { month: "Jun", sales: 450 },
  { month: "July", sales: 689 },
];

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      <Sidebar isOpen={menuOpen} setIsOpen={setMenuOpen} />

      <div className="flex-1 flex flex-col">
        <Topbar onMenuClick={() => setMenuOpen(true)} />

        <main className="flex-1 p-8 space-y-8">
          {/* Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card title="Manage Products" icon="inventory_2" desc="Add, remove, and edit products" />
            <Card title="Record Sales" icon="trending_up" desc="Track sales and revenue" />
            <Card title="Invoices" icon="receipt_long" desc="View and manage invoices" />
          </motion.div>

          {/* Chart + Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white rounded-xl shadow p-6 lg:col-span-2"
            >
              <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <section className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
              <ul className="space-y-3">
                {["Order created", "Invoice paid", "New product added"].map((activity, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                  >
                    <span>{activity}</span>
                    <span className="material-icons text-gray-400 group-hover:text-gray-600">
                      chevron_right
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function Card({ title, desc, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center cursor-pointer"
    >
      <span className="material-icons text-blue-600 text-4xl mb-2">{icon}</span>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </motion.div>
  );
}
