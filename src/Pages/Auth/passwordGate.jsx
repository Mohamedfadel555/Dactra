import React, { useState } from "react";

export default function PasswordGate({ children }) {
  const correctPassword = "12345678dactra"; // ← غيّر الباسورد اللي انت عايزه
  const [input, setInput] = useState("");
  const [authorized, setAuthorized] = useState(
    localStorage.getItem("auth") === "true"
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === correctPassword) {
      localStorage.setItem("auth", "true");
      setAuthorized(true);
    } else {
      alert("Wrong password");
    }
  };

  if (authorized) return children;

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "15px",
        background: "#f5f5f5",
      }}
    >
      <h2>Enter Password</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "17px",
            width: "230px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Enter
        </button>
      </form>
    </div>
  );
}
