import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [rank, setRank] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get("http://localhost:5000/score/leaderboard")
      .then((res) => setScores(res.data));

    axios
      .get(`http://localhost:5000/score/rank/${user.username}`)
      .then((res) => setRank(res.data));
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🏆 Leaderboard</h2>

        {rank && (
          <div style={styles.rankBox}>
            <span>Your Rank</span>
            <h1>
              {rank.rank} / {rank.total}
            </h1>
          </div>
        )}

        <table style={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>WPM</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, i) => (
              <tr
                key={i}
                style={
                  s.username === user.username
                    ? styles.highlightRow
                    : {}
                }
              >
                <td>{i + 1}</td>
                <td>{s.username}</td>
                <td>{s.wpm}</td>
                <td>{s.difficulty}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          style={styles.button}
          onClick={() => (window.location = "/test")}
        >
          🔁 Try Again
        </button>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    background: "#fff",
    padding: "30px",
    width: "600px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
  },

  rankBox: {
    textAlign: "center",
    background: "#eef2ff",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },

  highlightRow: {
    backgroundColor: "#dbeafe",
    fontWeight: "bold",
  },

  button: {
    width: "100%",
    padding: "10px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
};
