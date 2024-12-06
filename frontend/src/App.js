import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Transaction from "./pages/Transaction";
import History from "./pages/History";
import Donation from "./pages/Donation";
import Profile from "./pages/Profile";
import TopUp from "./pages/TopUp";
import Report from "./pages/Report";

const PrivateRoute = ({ children }) => {
  const userId = localStorage.getItem("userId");

  return userId ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

const MainLayout = () => {
  const location = useLocation();
  const hideSidebarRoutes = ["/", "/signup"];
  const isSidebarVisible = !hideSidebarRoutes.includes(location.pathname);

  return (
    <div style={{ display: "flex" }}>
      {isSidebarVisible && <Sidebar />}
      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Rute yang membutuhkan autentikasi */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home userName="Your Name" />
              </PrivateRoute>
            }
          />
          <Route
            path="/transaction"
            element={
              <PrivateRoute>
                <Transaction />
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <History />
              </PrivateRoute>
            }
          />
          <Route
            path="/donation"
            element={
              <PrivateRoute>
                <Donation />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/topup"
            element={
              <PrivateRoute>
                <TopUp />
              </PrivateRoute>
            }
          />
          <Route
            path="/report"
            element={
              <PrivateRoute>
                <Report />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;