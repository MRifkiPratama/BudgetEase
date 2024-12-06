import React, { useState, useEffect } from "react";
import "./History.css";

function History() {
  const [userId, setUserId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [transactionType, setTransactionType] = useState("");
  const [error, setError] = useState("");
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
      fetchAllTransactions(storedUserId);
    } else {
      setError("User ID is missing. Please log in again.");
    }
  }, []);

  const fetchAllTransactions = async (userId) => {
    if (!userId) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/transaction/${userId}/history`
      );
      const data = await response.json();

      if (response.ok) {
        setTransactions(data.transactions || []);
      } else {
        setError(data.error || "Failed to fetch transactions.");
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const filterByType = async () => {
    if (!userId || !transactionType) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/transaction/${userId}/history/type?transactionType=${transactionType}`
      );
      const data = await response.json();

      if (response.ok) {
        setFilteredTransactions(data.transactions || []);
      } else {
        setError(data.error || "No transactions found for the specified type.");
      }
    } catch (err) {
      console.error("Error filtering transactions:", err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-container">
      <h1>Transaction History</h1>
      {userId && <p>Logged in as User ID: {userId}</p>}

      {error && <p className="error-message">{error}</p>}
      {loading && <p>Loading...</p>}

      <div className="filter-section">
        <h2>Filter Transactions</h2>
        <select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
        >
          <option value="">Select Transaction Type</option>
          {paymentTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button onClick={filterByType}>Filter</button>

        <h3>Filtered Transactions</h3>
        {filteredTransactions.length === 0 && <p>No filtered transactions found.</p>}
        <ul>
          {filteredTransactions.map((tx, index) => (
            <li key={index}>
              {tx.transaction_type}: Rp. {tx.amount} on{" "}
              {new Date(tx.transaction_date).toLocaleDateString()} to {tx.receiver_name}
            </li>
          ))}
        </ul>
      </div>

      <div className="all-transactions">
        <h2>All Transactions</h2>
        {transactions.length === 0 && <p>No transactions available.</p>}
        <ul>
          {transactions.map((tx, index) => (
            <li key={index}>
              {tx.transaction_type}: Rp. {tx.amount} on{" "}
              {new Date(tx.transaction_date).toLocaleDateString()} to {tx.receiver_name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default History;