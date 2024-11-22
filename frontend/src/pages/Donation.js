import React, { useState, useEffect } from "react";

function Donation({ userId }) {
  const [donation, setDonation] = useState(0);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/donation/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.donation) setDonation(data.donation);
      })
      .catch((error) => console.error("Error fetching donation:", error));
  }, [userId]);

  const handleDonate = () => {
    fetch(`/api/donation/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseFloat(amount) }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.donation) {
          setDonation(data.donation);
          setMessage(data.message);
        } else {
          setMessage(data.error || "An error occurred");
        }
      })
      .catch((error) => console.error("Error donating:", error));
  };

  return (
    <div>
      <h1>Donation Page</h1>
      <p>Your Total Donation: ${donation}</p>
      <input
        type="number"
        placeholder="Amount to donate"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleDonate}>Donate</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Donation;