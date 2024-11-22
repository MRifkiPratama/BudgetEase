import React, { useState, useEffect } from "react";

function Profile({ userId }) {
  const [user, setUser] = useState({});
  const [topUpAmount, setTopUpAmount] = useState("");
  const [donate, setDonate] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/user/${userId}`)
      .then((response) => response.json())
      .then((data) => setUser(data.user || {}))
      .catch((error) => console.error("Error fetching user details:", error));
  }, [userId]);

  const handleTopUp = () => {
    fetch(`/api/user/topup/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: parseFloat(topUpAmount),
        donate,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
        setUser((prev) => ({
          ...prev,
          balance: data.balance,
        }));
      })
      .catch((error) => console.error("Error topping up:", error));
  };

  return (
    <div>
      <h1>User Details</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Balance: ${user.balance}</p>
      <h2>Top-Up Balance</h2>
      <input
        type="number"
        placeholder="Top-up Amount"
        value={topUpAmount}
        onChange={(e) => setTopUpAmount(e.target.value)}
      />
      <label>
        <input type="checkbox" checked={donate} onChange={() => setDonate(!donate)} />
        Donate 2% of this amount
      </label>
      <button onClick={handleTopUp}>Top Up</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Profile;