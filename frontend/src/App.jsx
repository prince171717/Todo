import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAuth } from "./context/AuthContext";
import About from "./pages/About";
import { ToastContainer } from "react-toastify";
import AdminPanel from "./pages/AdminPanel";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  const { isAuthenticated, user,loading  } = useAuth();

  if (loading) return <div>Loading...</div>;

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to={"/login"} replace />;
  };

  const PublicRoute = ({ children }) => {
    return !isAuthenticated ? children : <Navigate to={"/"} replace />;
  };

  const AdminRoute = ({ children }) => {
    return isAuthenticated && user?.role === "admin" ? (
      children
    ) : (
      <Navigate to="/" replace />
    );
  };

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
           <Route path="/forgot-password" element={<ForgotPassword />} />
           <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>
       

      </Routes>
    </>
  );
};

export default App;
