import { useRef, useState } from "react";
import api from "../api/axios";

function FaceRegister() {
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

  const captureFace = async () => {
    if (!videoRef.current) {
      setMessage("Start camera first ❌");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const imageBase64 = canvas.toDataURL("image/jpeg");

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/face/register",
        {
          image: imageBase64,   // ✅ FIXED KEY
         }
        //,
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`, // ✅ JWT
        //   },
        // }
      );

      setMessage("Face registered successfully ✅");
    } catch (err) {
      setMessage("Face registration failed ❌");
    }
  };

  return (
    <div className="face-container">
      <div className="face-card">
        <h2>Face Registration</h2>

        <video ref={videoRef} autoPlay playsInline />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        <div className="btn-group">
          <button onClick={startCamera}>Start Camera</button>
          <button onClick={captureFace}>Capture Face</button>
        </div>

        <p>{message}</p>
      </div>
    </div>
  );
}

export default FaceRegister;
