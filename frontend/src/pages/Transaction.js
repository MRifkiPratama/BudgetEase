import React, { useState, useEffect } from "react";
import "./Transaction.css";

function Transaction() {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState({});
  const [paymentDetails, setPaymentDetails] = useState({
    amount: "",
    payment_type: "",
    destination: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const paymentTypes = [
    "Food",
    "Health",
    "Education",
    "Entertainment",
    "Lifestyle",
    "General",
    "Other",
    "Transportation",
    "Transfer",
  ];

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchUserDetails(storedUserId);
    } else {
      setError("User ID is missing. Please log in again.");
    }
  }, []);

  const fetchUserDetails = async (id) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${id}`);
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

  const handlePayment = async () => {
    if (!userId) return;

    const { amount, payment_type, destination } = paymentDetails;

    if (!amount || !payment_type || !destination) {
      setError("Please fill in all payment details.");
      return;
    }

    if (amount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/transaction/${userId}/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount, payment_type, destination }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setSuccess("Payment successful!");
        setPaymentDetails({ amount: "", payment_type: "", destination: "" });
        fetchUserDetails(userId);
      } else {
        setError(data.error || "Payment failed.");
      }
    } catch (err) {
      console.error("Error processing payment:", err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-container">
      <h1>Make a Payment</h1>
      {userId && <p>Logged in as User ID: {userId}</p>}
      <p><strong>Balance:</strong> Rp. {user.balance || "0.00"}</p>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      {loading && <p>Loading...</p>}

      <div className="payment-form">
        <input
          type="number"
          placeholder="Amount"
          value={paymentDetails.amount}
          onChange={(e) =>
            setPaymentDetails({ ...paymentDetails, amount: e.target.value })
          }
        />
        <select
          value={paymentDetails.payment_type}
          onChange={(e) =>
            setPaymentDetails({ ...paymentDetails, payment_type: e.target.value })
          }
          required
        >
          <option value="">Select Payment Type</option>
          {paymentTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Destination (ID)"
          value={paymentDetails.destination}
          onChange={(e) =>
            setPaymentDetails({ ...paymentDetails, destination: e.target.value })
          }
        />
        <button onClick={handlePayment}>Submit Payment</button>
      </div>
    </div>
  );
}

export default Transaction;