// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAxiosSetup } from "./api/setupAxios";

import AdminLayout from "./layouts/AdminLayout";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentsPage from "./pages/admin/StudentsPage";
import EnrollmentsPage from "./pages/admin/EnrollmentsPage";
import PaymentsPage from "./pages/admin/PaymentsPage";
// import TransactionsPage from "./pages/admin/TransactionsPage";

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function AppRoutes() {
  // ✅ safe here: AuthProvider is already wrapping this component
  useAxiosSetup();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="enrollments" element={<EnrollmentsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          {/*<Route path="transactions" element={<TransactionsPage /> />*/}
        </Route>
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
      <ToastContainer position="top-right" autoClose={3000}/>
    </>
  );
}
