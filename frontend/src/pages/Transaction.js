import React, { useState, useEffect } from "react";

function Transaction({ userId }) {
  const [transactions, setTransactions] = useState([]);
  const [transactionType, setTransactionType] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    fetch(`/api/transaction/history/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data.transactions || []);
      })
      .catch((error) => console.error("Error fetching transactions:", error));
  }, [userId]);

  const filterByType = () => {
    fetch(`/api/transaction/history/${userId}?transactionType=${transactionType}`)
      .then((response) => response.json())
      .then((data) => {
        setFilteredTransactions(data.transactions || []);
      })
      .catch((error) => console.error("Error filtering transactions:", error));
  };

  return (
    <div>
      <h1>Transaction History</h1>
      <label>Filter by Type: </label>
      <input
        type="text"
        placeholder="Enter transaction type"
        value={transactionType}
        onChange={(e) => setTransactionType(e.target.value)}
      />
      <button onClick={filterByType}>Filter</button>
      <h2>Filtered Transactions</h2>
      <ul>
        {filteredTransactions.map((tx, index) => (
          <li key={index}>
            {tx.transaction_type}: ${tx.amount} on {new Date(tx.transaction_date).toLocaleDateString()}
          </li>
        ))}
      </ul>
      <h2>All Transactions</h2>
      <ul>
        {transactions.map((tx, index) => (
          <li key={index}>
            {tx.transaction_type}: ${tx.amount} on {new Date(tx.transaction_date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Transaction;