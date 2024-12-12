import React, { useState, useEffect } from "react";
import "../styles/Profile.css";

function Profile() {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError("User ID is missing. Please log in again.");
    }
  }, []);

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
    <div className="profile-container">
      <h1>User Profile</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {userId && (
        <>
          <p><strong>User ID:</strong> {userId}</p>
          <p><strong>Name:</strong> {user.name || "N/A"}</p>
          <p><strong>Email:</strong> {user.email || "N/A"}</p>
          <p><strong>Balance:</strong> Rp. {user.balance || "0.00"}</p>
        </>
      )}
    </div>
  );
}

export default Profile;