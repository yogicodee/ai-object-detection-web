import { useState, useRef, useEffect } from "react";

export default function App() {
 const [image, setImage] = useState(null);
const [imageFile, setImageFile] = useState(null);
const [result, setResult] = useState(null);
  const canvasRef = useRef(null);

 function handleUpload(e) {
  const file = e.target.files[0];
  if (file) {
    setImage(URL.createObjectURL(file)); // untuk preview
    setImageFile(file);                  // untuk kirim ke backend
    setResult(null);
  }
}

  async function handleDetect() {
  if (!imageFile) return;

  const formData = new FormData();
  formData.append("file", imageFile);

  const res = await fetch("https://ai-object-detection-api-8mc4.onrender.com/detect", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  setResult(data.objects);
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
  ctx.fillText(
    `${r.label} ${r.confidence.toFixed(2)}`,
    r.x,
    r.y - 5
  );
});
    };
  }, [image, result]);

return (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
      fontFamily: "Inter, Arial, sans-serif",
    }}
  >
    <div
      style={{
        background: "white",
        padding: "30px 35px",
        borderRadius: 16,
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        width: "90%",
        maxWidth: 900,
      }}
    >
      <h1
        style={{
          marginBottom: 20,
          fontSize: 32,
          fontWeight: 700,
          color: "#0f172a",
        }}
      >
        AI Object Detection
      </h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        style={{
          marginBottom: 20,
        }}
      />

      {image && (
        <div
          style={{
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid #e2e8f0",
          }}
        >
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
              padding: "12px 22px",
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(37,99,235,0.3)",
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
