// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Topbar({ onMenuClick, userName }) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full flex items-center justify-between bg-white shadow px-6 py-3"
    >
      {/* Hamburger for mobile */}
      <button
        className="material-icons text-gray-700 md:hidden"
        onClick={onMenuClick}
      >
        menu
      </button>

      {/* Personalized greeting */}
      <h2 className="text-xl font-semibold text-gray-800 hidden md:block">
        Welcome back, {userName ? userName : "User"}!
      </h2>

      <div className="flex items-center gap-4">
        <button className="text-gray-600 hover:text-blue-600 material-icons">
          notifications
        </button>

        {/* Optional: first letter of name as avatar */}
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
          {userName ? userName.charAt(0).toUpperCase() : "U"}
        </div>
      </div>
    </motion.header>
  );
}
