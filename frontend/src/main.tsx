import React from "react";
import { createRoot } from "react-dom/client";
import { ShieldCheck, Smartphone, Wifi } from "lucide-react";
import "./style.css";

function App() {
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
    <Smartphone size={28} />
    <h2>My Family Devices</h2>
    <p>Pair a device to begin setting up family safety.</p>
    <p className="status">
      <Wifi size={17} /> No device connected
    </p>
  </section>

  <section className="card">
    <h2>Safety & Privacy</h2>
    <p>
      Device pairing and any screen sharing must use
      clear consent and visible controls on the child's device.
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
