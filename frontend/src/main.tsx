
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ShieldCheck, Smartphone, Wifi, Copy, RefreshCw } from "lucide-react";
import "./style.css";

const API_URL = "https://cyberx-core1-1.onrender.com";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [demoCode, setDemoCode] = useState("");
  const [demoStatus, setDemoStatus] = useState("Not paired");

  useEffect(() => {
    async function checkBackend() {
      try {
        const response = await fetch(`${API_URL}/health`);
        if (!response.ok) throw new Error("Backend unavailable");

        const data = await response.json();
        setBackendStatus(data.status === "ok" ? "Connected" : "Offline");
      } catch {
        setBackendStatus("Offline");
      }
    }

    checkBackend();
    const timer = setInterval(checkBackend, 30000);
    return () => clearInterval(timer);
  }, []);

  function generateDemoCode() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setDemoCode(code);
    setDemoStatus("Demo code generated — no device connected");
  }

  async function copyDemoCode() {
    if (!demoCode) return;

    try {
      await navigator.clipboard.writeText(demoCode);
      setDemoStatus("Demo code copied");
    } catch {
      setDemoStatus("Copy unavailable — select the code manually");
    }
  }

  return (
    <main className="dashboard">
      <header>
        <ShieldCheck size={32} />
        <div>
          <h1>CyberX Family Safety</h1>
          <p>Parent Dashboard</p>
        </div>
      </header>

      <section className="card">
        <Wifi size={28} />
        <h2>Backend Connection</h2>
        <p className="status">
          {backendStatus === "Connected"
            ? "🟢 Backend Connected"
            : backendStatus === "Offline"
            ? "🔴 Backend Offline"
            : "🟡 Checking backend..."}
        </p>
      </section>

      <section className="card">
        <Smartphone size={28} />
        <h2>My Family Devices</h2>
        <p>No real device connected.</p>
        <p className="status">📱 No device connected</p>
      </section>

      <section className="card">
        <h2>Demo Device Pairing</h2>
        <p>Generate a sample code to test the dashboard interface.</p>
        <p><strong>Demo status:</strong> {demoStatus}</p>

        {demoCode && (
          <h2 style={{ letterSpacing: "6px" }}>{demoCode}</h2>
        )}

        <button onClick={generateDemoCode}>
          <RefreshCw size={17} /> Generate Demo Code
        </button>

        {demoCode && (
          <button onClick={copyDemoCode}>
            <Copy size={17} /> Copy Code
          </button>
        )}

        <p><small>Demo only. This code does not pair or authorize a real device.</small></p>
      </section>

      <section className="card">
        <h2>Safety & Privacy</h2>
        <p>
          Real device pairing and any screen sharing must use
          clear consent and visible controls on the other device.
        </p>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
