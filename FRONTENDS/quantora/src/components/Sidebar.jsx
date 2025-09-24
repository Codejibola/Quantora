// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Sidebar({ isOpen, setIsOpen }) {
  const links = [
    { name: "Dashboard", icon: "dashboard", to: "/dashboard" },
    { name: "Manage Products", icon: "inventory_2", to: "/Manage_Products" },
    { name: "Record Sales", icon: "edit_note", to: "/recordSales" },
    { name: "Invoices", icon: "receipt_long", to: "/invoices" },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-60 bg-white shadow-md p-6 space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <nav className="space-y-4">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium"
            >
              <span className="material-icons">{link.icon}</span>
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile slide-in sidebar */}
      {isOpen && (
        <motion.aside
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "tween" }}
          className="fixed top-0 left-0 h-full w-64 bg-white shadow-md p-6 z-40 md:hidden"
        >
          <button
            onClick={() => setIsOpen(false)}
            className="material-icons text-gray-600 mb-4"
          >
            close
          </button>
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          <nav className="space-y-4">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsOpen(false)}
              >
                <span className="material-icons">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </nav>
        </motion.aside>
      )}
    </>
  );
}








