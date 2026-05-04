import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/Loader";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddTransaction from "./pages/AddTransaction";
import Transactions from "./pages/Transactions";
import AddCategory from "./pages/AddCategory";
import Categories from "./pages/Categories";
import EditTransaction from "./pages/EditTransaction";

import "react-toastify/dist/ReactToastify.css";
import API from "./api";

function AppContent() {
  const [transactions, setTransactions] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

  const location = useLocation(); // ✅ ถูกที่แล้ว

  const fetchTransactions = useCallback(async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.min) params.append("min", filters.min);
      if (filters.max) params.append("max", filters.max);
      if (filters.search) params.append("search", filters.search);

      const query = params.toString();

      const res = await API.get(
        query ? `/transactions?${query}` : "/transactions"
      );

      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // ล้างข้อมูลเมื่อ logout
  useEffect(() => {
    if (!isLoggedIn) {
      setTransactions([]);
    }
  }, [isLoggedIn]);

  // โหลดข้อมูล transactions เมื่อ login
  useEffect(() => {
    if (!isLoggedIn) return;

    setLoading(true);
    const load = async () => {
      await fetchTransactions();
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
    load();
  }, [isLoggedIn]);

  // Reload transactions เมื่อ navigate ไปหน้า home (/)
  useEffect(() => {
    if (location.pathname === "/" && isLoggedIn) {
      fetchTransactions();
    }
  }, [location.pathname, isLoggedIn, fetchTransactions]);

  if (loading) return <Loader />;

  return (
  <>
    <Navbar setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />

    <ToastContainer position="top-right" autoClose={2000} />

    <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Dashboard transactions={transactions} />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />

        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/register" element={<Register />} />

        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddTransaction fetchTransactions={fetchTransactions} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions
                transactions={transactions}
                fetchTransactions={fetchTransactions}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-category"
          element={
            <ProtectedRoute>
              <AddCategory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />

        <Route
  path="/edit/:id"
  element={
    <ProtectedRoute>
      <EditTransaction fetchTransactions={fetchTransactions} />
    </ProtectedRoute>
  }
/>
      </Routes>
    </>
  );
}

export default AppContent;