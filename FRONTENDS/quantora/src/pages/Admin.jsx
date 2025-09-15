// eslint-disable-next-line
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
    
      const res = await fetch("http://localhost:5000/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Invalid email or password");
      // On success navigate to admin dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-gray-800/90 backdrop-blur-lg border border-gray-700"
      >
        <motion.h2
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-3xl font-extrabold text-center text-white mb-6 tracking-tight"
        >
          Admin Login
        </motion.h2>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 text-sm text-red-400 text-center"
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {["email", "password"].map((field, i) => (
            <motion.input
              key={field}
              type={field === "password" ? "password" : "email"}
              name={field}
              placeholder={
                field.charAt(0).toUpperCase() + field.slice(1)
              }
              value={formData[field]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700/80 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * i }}
            />
          ))}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-2 mt-4 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Login
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-center text-gray-400 text-sm"
        >
          Don&apos;t have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-400 hover:underline hover:text-blue-300 transition"
          >
            Register
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
}
