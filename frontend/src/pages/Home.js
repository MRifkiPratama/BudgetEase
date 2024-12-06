import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch userId from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError("User ID is missing. Please log in again.");
    }
  }, []);

  // Fetch user details from the backend
  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError("");

    fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          setError(data.error || "Failed to fetch user details.");
        }
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        setError("Unable to connect to the server.");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="home-container">
      <h1>Welcome, {user.name || "User"}!</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <p>Your current balance is: <strong>Rp. {user.balance || "0.00"}</strong></p>
      )}
      <p>What would you like to do today?</p>
      <div className="home-actions">
        <button onClick={() => navigate("/profile")}>View Profile</button>
        <button onClick={() => navigate("/topup")}>Top Up Balance</button>
        <button onClick={() => navigate("/transaction")}>Manage Transactions</button>
        <button onClick={() => navigate("/history")}>View Transaction History</button>
        <button onClick={() => navigate("/donation")}>Make a Donation</button>
        <button onClick={() => navigate("/report")}>Generate Report</button>
      </div>
    </div>
  );
};

export default Home;