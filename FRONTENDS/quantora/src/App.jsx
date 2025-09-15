import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Registration";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to /admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Registration page */}
        <Route path="/register" element={<Register />} />

        {/* Admin login page */}
        <Route path="/admin" element={<Admin />} />

        {/* Catch-all route for 404s */}
        <Route path="*" element={<h1 className="text-center text-white mt-20">404 – Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}
