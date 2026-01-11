import { useState } from "react";
import api from "../api/axios";
import "./Login.css"; // 👈 add this

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

     localStorage.setItem("token", res.data.token);
    window.location.href = "/dashboard";
    } catch (err) {
      setMessage("Invalid credentials ❌");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>FaceAuth Login</h2>

        <form onSubmit={handleLogin}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default Login;
