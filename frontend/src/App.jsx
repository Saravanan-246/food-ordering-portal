// src/App.jsx
import React, { createContext, useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import OTPVerification from "./pages/OTPVerification";
import Dashboard from "./pages/Dashboard";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import OrderHistory from "./pages/OrderHistory";
import Payment from "./pages/Payment";

// Sidebar state context
export const SidebarContext = createContext();

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // Reset sidebar to open state when navigating to new page (desktop)
  useEffect(() => {
    if (window.innerWidth > 768) {
      setSidebarOpen(true);
    }
  }, [location]);

  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <div style={{ 
        display: "flex", 
        minHeight: "100vh", 
        background: "#f9fafb",
        position: "relative"
      }}>
        <Sidebar />
        
        <div style={{ 
          flex: 1, 
          display: "flex", 
          flexDirection: "column",
          marginLeft: sidebarOpen ? "260px" : "95px",
          minHeight: "100vh",
          transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          zIndex: 1
        }}>
          <Header />
          <main style={{ 
            flex: 1,
            padding: "24px",
            overflowY: "auto",
            background: "#f9fafb"
          }}>
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="menu" element={<Menu />} />
              <Route path="cart" element={<Cart />} />
              <Route path="payment" element={<Payment />} />
              <Route path="orders" element={<OrderHistory />} />
              <Route path="/" element={<Navigate to="dashboard" replace />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/otp-verification" element={<OTPVerification />} />

      {/* Protected Routes */}
      <Route path="/*" element={<ProtectedRoute><Layout /></ProtectedRoute>} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
