import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Registration";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Manage_Products from "./pages/Manage_Products";
import Invoices from "./pages/Invoices";
import RecordSales from "./pages/Record_Sales";
import Maintenance from "./pages/Maintenance";
import PrivateRoute from "./components/PrivateRoute"; // <-- import it

export default function App() {
  return (
    <Router>
      <Routes>
        {/* All routes point to Maintenance */}
        <Route path="*" element={<Maintenance />} />
      </Routes>
    </Router>
  );
}
