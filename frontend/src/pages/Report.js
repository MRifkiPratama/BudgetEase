import React, { useState, useEffect } from "react";

function Report({ userId }) {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetch(`/api/report/income/${userId}`)
      .then((response) => response.json())
      .then((data) => setIncome(data.total_income || 0))
      .catch((error) => console.error("Error fetching income:", error));

    fetch(`/api/report/expenses/${userId}`)
      .then((response) => response.json())
      .then((data) => setExpenses(data.total_expenses || 0))
      .catch((error) => console.error("Error fetching expenses:", error));

    fetch(`/api/report/health-score/${userId}`)
      .then((response) => response.json())
      .then((data) => setScore(data.score || 0))
      .catch((error) => console.error("Error fetching health score:", error));
  }, [userId]);

  return (
    <div>
      <h1>Financial Report</h1>
      <p>Total Income: ${income}</p>
      <p>Total Expenses: ${expenses}</p>
      <p>Financial Health Score: {score}%</p>
    </div>
  );
}

export default Report;