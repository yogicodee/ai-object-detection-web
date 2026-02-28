import { useState, useRef, useEffect } from "react";

export default function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const canvasRef = useRef(null);

  function handleUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      setResult(null);
    }
  }

  function handleDetect() {
    // dummy bbox: x, y, w, h
    setResult([
      { label: "elephant", conf: 0.92, x: 50, y: 40, w: 120, h: 90 },
      { label: "human", conf: 0.88, x: 220, y: 150, w: 80, h: 120 },
    ]);
  }

  useEffect(() => {
    if (!image || !result) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = image;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.font = "16px Arial";

      result.forEach((r) => {
        ctx.strokeRect(r.x, r.y, r.w, r.h);
        ctx.fillText(r.label, r.x, r.y - 5);
      });
    };
  }, [image, result]);

 return (
  <div
    style={{
      minHeight: "100vh",
      background: "#f4f6f8",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Arial",
    }}
  >
    <div
      style={{
        background: "white",
        padding: 30,
        borderRadius: 12,
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        maxWidth: 800,
        width: "100%",
      }}
    >
      <h1 style={{ marginBottom: 20 }}>AI Object Detection</h1>

      <input type="file" accept="image/*" onChange={handleUpload} />

      {image && (
        <div style={{ marginTop: 20 }}>
          <canvas ref={canvasRef} style={{ width: "100%" }} />
        </div>
      )}

      {image && (
        <div style={{ marginTop: 20 }}>
          <button
            onClick={handleDetect}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Detect Objects
          </button>
        </div>
      )}
    </div>
  </div>
);
}