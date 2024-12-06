import React, { useState, useEffect } from "react";
import "./TopUp.css";

function TopUp() {
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [user, setUser] = useState({});
  const [topUpAmount, setTopUpAmount] = useState("");
  const [donate, setDonate] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    } else {
      setError("User ID is missing. Please log in again.");
    }
  }, [userId]);

  const fetchUserDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setUser(data.user || {});
      } else {
        setError(data.error || "Failed to fetch user details.");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async () => {
    if (!userId) return;

    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid top-up amount.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/${userId}/topup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            donate,
          }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setMessage("Top-up successful!");
        setTopUpAmount("");
        setDonate(false);
        fetchUserDetails(); // Refresh balance
      } else {
        setError(data.error || "Failed to top up balance.");
      }
    } catch (err) {
      console.error("Error topping up:", err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="topup-container">
      <h1>Top-Up Balance</h1>
      {userId && <p><strong>Balance:</strong> Rp. {user.balance || "0.00"}</p>}

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <div className="topup-section">
        <input
          type="number"
          placeholder="Top-up Amount"
          value={topUpAmount}
          onChange={(e) => setTopUpAmount(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={donate}
            onChange={() => setDonate(!donate)}
          />
          Donate 2% of this amount
        </label>
        <button onClick={handleTopUp}>Top Up</button>
      </div>
    </div>
  );
}

export default TopUp;