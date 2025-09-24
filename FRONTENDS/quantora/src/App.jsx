import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Registration";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Manage_Products from "./pages/Manage_Products";
import Invoices from "./pages/Invoices";
import RecordSales from "./pages/Record_Sales";

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

        {/* Dashboard page */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Products page */}
        <Route path="/Manage_Products" element={<Manage_Products />} />

        {/*Invoices page */}
        <Route path="/invoices" element={<Invoices />} />

        {/* RecordSales page */}
        <Route path="/recordSales" element={<RecordSales />} />

        {/* Catch-all route for 404s */}
        <Route path="*" element={<h1 className="text-center text-white mt-20">404 – Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}
