import React, { useState, useEffect } from "react";
import "../styles/History.css";

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
      <h1 className="page-title">Transaction History</h1>
      <div className="filter-section">
        <h2 className="section-title">Filter Transactions</h2>
        <div className="filter-controls">
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="filter-select"
          >
            <option value="">Select Transaction Type</option>
            {paymentTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
          <button className="filter-button" onClick={filterByType}>
            Filter
          </button>
        </div>

        <h3 className="subsection-title">Filtered Transactions</h3>
        {filteredTransactions.length === 0 && <p>No filtered transactions found.</p>}
        <ul className="transaction-list">
          {filteredTransactions.map((tx, index) => (
            <li key={index} className="transaction-item">
              <span className="transaction-type">{tx.transaction_type}</span>: Rp.{" "}
              <span className="transaction-amount">{tx.amount}</span> on{" "}
              <span className="transaction-date">
                {new Date(tx.transaction_date).toLocaleDateString()}
              </span>{" "}
              to <span className="transaction-receiver">{tx.receiver_name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="all-transactions">
        <h2 className="section-title">All Transactions</h2>
        {transactions.length === 0 && <p>No transactions available.</p>}
        <ul className="transaction-list">
          {transactions.map((tx, index) => (
            <li key={index} className="transaction-item">
              <span className="transaction-type">{tx.transaction_type}</span>: Rp.{" "}
              <span className="transaction-amount">{tx.amount}</span> on{" "}
              <span className="transaction-date">
                {new Date(tx.transaction_date).toLocaleDateString()}
              </span>{" "}
              to <span className="transaction-receiver">{tx.receiver_name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default History;