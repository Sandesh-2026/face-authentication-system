import { useRef, useState } from "react";
import api from "../api/axios";

function FaceLogin() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [message, setMessage] = useState("");

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      setMessage("Camera access denied ❌");
    }
  };

  const loginWithFace = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const imageBase64 = canvas.toDataURL("image/jpeg");

    try {
      const res = await api.post("/face/login", {
        image: imageBase64,
      });

      localStorage.setItem("token", res.data);
      window.location.href = "/dashboard";
    } catch (err) {
      setMessage(err.response?.data || "Face login failed ❌");
    }
  };

  return (
    <div className="face-container">
      <div className="face-card">
        <h2>Face Login</h2>

        <video ref={videoRef} autoPlay playsInline />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        <div className="btn-group">
          <button onClick={startCamera}>Start Camera</button>
          <button onClick={loginWithFace}>Login with Face</button>
        </div>

        <p>{message}</p>
      </div>
    </div>
  );
}

export default FaceLogin;
