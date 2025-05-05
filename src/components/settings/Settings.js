// src/components/Settings.js
import React, { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";       // or any switch component
const API = process.env.REACT_APP_API_URL;

export default function SettingsPage() {
  const [settings, setSettings] = useState({});
  useEffect(() => {
    fetch(`${API}/settings`)
      .then(r => r.json())
      .then(setSettings);
  }, []);

  function toggle(key) {
    const newVal = !settings[key];
    fetch(`${API}/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value: newVal })
    })
      .then(r => r.json())
      .then(() => setSettings(s => ({ ...s, [key]: newVal })));
  }

  return (
    <div>
      <h2>Feature Flags</h2>
      {Object.entries(settings).map(([key, val]) => (
        <div key={key} style={{ display: "flex", alignItems: "center", margin: "8px 0" }}>
          <span style={{ flex: 1 }}>{key}</span>
          <Switch
            checked={val}
            onChange={() => toggle(key)}
            color="primary"
          />
        </div>
      ))}
    </div>
  );
}
