import React, { useState, useEffect } from "react";
import "../styles/Donation.css";

function Donation() {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState({});
  const [donation, setDonation] = useState(0);
  const [donationDetails, setDonationDetails] = useState({
    amount: "",
    operation: "",
  });
  const [selectedDonationDetails, setSelectedDonationDetails] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const donations = [
    {
      operation: "50 Trees",
      details: "Planting 50 trees in deforested areas to combat climate change.",
    },
    {
      operation: "Ocean Care",
      details: "Cleaning plastic waste from oceans and supporting marine life.",
    },
    {
      operation: "Food for All",
      details: "Providing meals for underprivileged communities worldwide.",
    },
    {
      operation: "Animal Rescue",
      details: "Saving and rehabilitating stray animals in urban areas.",
    },
    {
      operation: "Education for Kids",
      details: "Supporting education for children in remote villages.",
    },
  ];

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchUserDetails(storedUserId);
      fetchAllDonations(storedUserId);
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

  const fetchAllDonations = async (id) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/donation/${id}`);
      const data = await response.json();

      if (response.ok) {
        setDonation(data.donation || 0);
      } else {
        setError(data.error || "Failed to fetch donation data.");
      }
    } catch (err) {
      console.error("Error fetching donations:", err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleDonation = async () => {
    if (!userId) return;

    const { amount, operation } = donationDetails;

    if (!amount || !operation) {
      setError("Please fill in all donation details.");
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
        `${process.env.REACT_APP_API_URL}/donation/${userId}/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: parseFloat(amount) }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setSuccess("Donation successful!");
        setDonationDetails({ amount: "", operation: "" });
        fetchAllDonations(userId);
        fetchUserDetails(userId);
      } else {
        setError(data.error || "Donation failed.");
      }
    } catch (err) {
      console.error("Error processing donation:", err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleOperationChange = (e) => {
    const selectedOperation = e.target.value;
    setDonationDetails({ ...donationDetails, operation: selectedOperation });
    const donationDetail = donations.find(
      (donation) => donation.operation === selectedOperation
    );
    setSelectedDonationDetails(donationDetail?.details || "");
  };

  const getTitleAndDescription = () => {
    if (donation < 1000) {
      return { title: "", description: "Donate to unlock titles!" };
    } else if (donation >= 1000 && donation < 100000) {
      return {
        title: "Novice Donor",
        description:
          "As a Novice Donor, you contribute to small-scale initiatives like local tree planting. Your support helps create green spaces and promotes community well-being.",
      };
    } else if (donation >= 100000 && donation < 500000) {
      return {
        title: "Supporter of Change",
        description:
          "By reaching this level, you support community health programs, providing essential medical care to those in need. Your contribution directly impacts lives.",
      };
    } else if (donation >= 500000 && donation < 1000000) {
      return {
        title: "Champion for Education",
        description:
          "As a Champion for Education, your donations help fund resources for underprivileged children, improving their access to learning opportunities and empowering future generations.",
      };
    } else if (donation >= 1000000 && donation < 5000000) {
      return {
        title: "Guardian of the Environment",
        description:
          "This title reflects your commitment to wildlife conservation efforts. Your contributions help protect endangered species and preserve biodiversity for future generations.",
      };
    } else if (donation >= 5000000) {
      return {
        title: "Hero of Humanity",
        description:
          "As a Hero of Humanity, you play a vital role in large-scale initiatives, such as providing clean water access to communities. Your generosity leads to significant change and lasting impact.",
      };
    }
  };

  const { title, description } = getTitleAndDescription();

  return (
    <div className="donation-container">
      <h1>Donation Management</h1>
      <p><strong>Balance:</strong> Rp. {user.balance || "0.00"}</p>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      {loading && <p>Loading...</p>}

      {/* Donation Form */}
      <div className="donation-form">
        <h2>Make a Donation</h2>
        <input
          type="number"
          placeholder="Amount"
          value={donationDetails.amount}
          onChange={(e) =>
            setDonationDetails({ ...donationDetails, amount: e.target.value })
          }
        />
        <select
          value={donationDetails.operation}
          onChange={handleOperationChange}
          required
        >
          <option value="">Select a Donation</option>
          {donations.map((donation, index) => (
            <option key={index} value={donation.operation}>
              {donation.operation}
            </option>
          ))}
        </select>
        {selectedDonationDetails && (
          <p className="donation-details">
            <strong>Details:</strong> {selectedDonationDetails}
          </p>
        )}
        <button onClick={handleDonation}>Submit Donation</button>
      </div>

      {/* Donation Total */}
      <div className="donation-history">
        <h2>Total Donation</h2>
        <p>Rp. {donation}</p>

        {/* Title and Description */}
        {title && (
          <div className="donation-title">
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Donation;