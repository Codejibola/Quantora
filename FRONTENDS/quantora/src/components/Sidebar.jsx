//eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Sidebar() {
  const links = [
    { name: "Dashboard", icon: "dashboard", href: "dashboard" },
    { name: "Manage Products", icon: "inventory_2", href: "Manage_Products" },
    { name: "Record Sales", icon: "edit_note", href: "recordSales" },
    { name: "Invoices", icon: "receipt_long", href: "invoices" },
  ];

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-60 bg-white shadow-md p-6 space-y-6"
    >
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <nav className="space-y-4">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium"
          >
            <span className="material-icons">{link.icon}</span>
            {link.name}
          </a>
        ))}
      </nav>
    </motion.aside>
  );
}







