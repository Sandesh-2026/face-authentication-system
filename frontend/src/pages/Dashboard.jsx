import { useEffect } from "react";

function Dashboard() {

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If no token, redirect to face login
    if (!token) {
      window.location.href = "/face-login";
    }
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "#1e1e1e",
      color: "white"
    }}>
      <h1>Dashboard</h1>
      <p>✅ Face Authentication Successful</p>

      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer"
        }}
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/face-login";
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
