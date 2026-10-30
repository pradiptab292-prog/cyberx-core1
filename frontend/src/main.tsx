
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ShieldCheck, Smartphone, Wifi, Copy, RefreshCw,
  Trash2, Plus, Info, X
} from "lucide-react";
import "./style.css";

const API_URL = "https://cyberx-core1-1.onrender.com";

type DemoDevice = {
  id: number;
  name: string;
  type: string;
  addedAt: string;
};

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [demoCode, setDemoCode] = useState("");
  const [demoStatus, setDemoStatus] = useState("Not paired");
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("Android phone");
  const [selectedDevice, setSelectedDevice] = useState<DemoDevice | null>(null);

  const [devices, setDevices] = useState<DemoDevice[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("cyberx-demo-devices") || "[]");
    } catch {
      return [];
    }
  });

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

  useEffect(() => {
    localStorage.setItem("cyberx-demo-devices", JSON.stringify(devices));
  }, [devices]);

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

  function addDevice() {
    const name = deviceName.trim();
    if (!name) return;

    const newDevice: DemoDevice = {
      id: Date.now(),
      name,
      type: deviceType,
      addedAt: new Date().toLocaleString()
    };

    setDevices(current => [...current, newDevice]);
    setDeviceName("");
  }

  function removeDevice(id: number) {
    setDevices(current => current.filter(device => device.id !== id));
    if (selectedDevice?.id === id) setSelectedDevice(null);
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

        {devices.length === 0 ? (
          <p>No demo devices added yet.</p>
        ) : (
          devices.map(device => (
            <div key={device.id} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
              padding: "12px 0",
              borderBottom: "1px solid #334155"
            }}>
              <div>
                <strong>📱 {device.name}</strong>
                <p>{device.type} — Demo only, not connected</p>
              </div>
              <div>
                <button onClick={() => setSelectedDevice(device)}>
                  <Info size={17} /> View Details
                </button>
                <button onClick={() => removeDevice(device.id)}>
                  <Trash2 size={17} /> Remove
                </button>
              </div>
            </div>
          ))
        )}

        <p className="status">{devices.length} demo device(s) added</p>
      </section>

      <section className="card">
        <h2>Demo Device Management</h2>
        <p>Add a sample device to test your dashboard.</p>

        <input
          type="text"
          placeholder="Enter demo device name"
          value={deviceName}
          onChange={event => setDeviceName(event.target.value)}
        />

        <select
          value={deviceType}
          onChange={event => setDeviceType(event.target.value)}
        >
          <option>Android phone</option>
          <option>Android tablet</option>
          <option>Other demo device</option>
        </select>

        <button onClick={addDevice} disabled={!deviceName.trim()}>
          <Plus size={17} /> Add Demo Device
        </button>

        <p><small>Demo only. This does not connect or monitor a real device.</small></p>
      </section>

      <section className="card">
        <h2>Demo Device Pairing</h2>
        <p>Generate a sample code to test the dashboard interface.</p>
        <p><strong>Demo status:</strong> {demoStatus}</p>

        {demoCode && <h2 style={{ letterSpacing: "6px" }}>{demoCode}</h2>}

        <button onClick={generateDemoCode}>
          <RefreshCw size={17} /> Generate Demo Code
        </button>

        {demoCode && (
          <button onClick={copyDemoCode}>
            <Copy size={17} /> Copy Code
          </button>
        )}

        <p><small>This code is for display testing only. It cannot authorize a real device.</small></p>
      </section>

      <section className="card">
        <h2>Safety & Privacy</h2>
        <p>
          Real device pairing and any screen sharing must use
          clear consent and visible controls on the other device.
        </p>
      </section>

      {selectedDevice && (
        <section className="card">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2>Device Details</h2>
            <button onClick={() => setSelectedDevice(null)}>
              <X size={17} /> Close
            </button>
          </div>
          <p><strong>Name:</strong> {selectedDevice.name}</p>
          <p><strong>Type:</strong> {selectedDevice.type}</p>
          <p><strong>Added:</strong> {selectedDevice.addedAt}</p>
          <p><strong>Connection:</strong> Demo only — Not connected</p>
          <p><small>No real device is connected or monitored.</small></p>
        </section>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
