import React from "react";
import axios from "axios";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
  try {
    const res = await axios.post("http://localhost:5000/auth/login", {
      email,
      password,
    });
    localStorage.setItem("user", JSON.stringify(res.data));
    window.location = "/test";
  } catch (err) {
    alert("Invalid email or password");
  }
};

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Login</h2>

        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={login}>
          Login
        </button>

        <p style={styles.link} onClick={() => (window.location = "/register")}>
          New user? Register
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    background: "#fff",
    padding: "30px",
    width: "350px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
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

  link: {
    textAlign: "center",
    marginTop: "15px",
    color: "#2563eb",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
