// src/components/camera_management/CameraManager.js
import React, { useState, useEffect } from "react";
import "./CameraManager.css";
import AddCameraModal from "./AddCameraModal";
import { GreenIndicator, RedIndicator } from "./IndicatorComponents";
import symbolicCameraImg from "../../assets/camshutter.png";
import LiveFeed from "./LiveFeed";
import { useQuery } from '@tanstack/react-query';
import socket from "../../socket";

const API_URL = process.env.REACT_APP_API_URL;

export default function CameraManager() {
  const [cameraList, setCameraList] = useState([]);
  const [camEnabled, setCamEnabled] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [cameraFeeds, setCameraFeeds] = useState({});

  // 1️⃣ Poll the active feed. Query result is your source of truth.
  const { data: activeFeed } = useQuery({
    queryKey: ['activeFeed'],
    queryFn: () =>
      fetch(`${API_URL}/api/active_feed`)
        .then(r => r.json())
        .then(j => j.active_camera),
    refetchInterval: 5000,
  });

  // 2️⃣ One-time fetch of camera list
  useEffect(() => { fetchCameras(); }, []);

  // 3️⃣ Listen for raw frames over the socket
  useEffect(() => {
    const handler = ({ camera_name, image }) => {
      const blob = new Blob([image], { type: "image/jpeg" });
      const url  = URL.createObjectURL(blob);
      setCameraFeeds(prev => {
        prev[camera_name]?._url && URL.revokeObjectURL(prev[camera_name]._url);
        return {
          ...prev,
          [camera_name]: { imageUrl: url, _url: url }
        };
      });
    };

    socket.off("frame-bin", handler);
    socket.on("frame-bin", handler);
    return () => socket.off("frame-bin", handler);
  }, []);

  // Fetch list of cameras and their statuses
  const fetchCameras = async () => {
    try {
      const res = await fetch(`${API_URL}/api/camera_list`);
      const { cameras } = await res.json();
      setCameraList(cameras);
      const init = {};
      cameras.forEach(c => { init[c.camera_name] = c.status; });
      setCamEnabled(init);
    } catch (e) {
      console.error(e);
    }
  };

  // Helper to POST to an endpoint
  const post = (url, body) =>
    fetch(`${API_URL}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  // Camera controls
  const handleAddCamera = (data) => {post("/api/add_camera", data).then(fetchCameras);}
  const handleRemoveCamera = name => post("/api/remove_camera", { camera_name: name }).then(fetchCameras);
  const handleStartCamera = name => post("/api/start_proc", { camera_name: name }).then(() => setCamEnabled(p => ({ ...p, [name]: true })));
  const handleStopCamera  = name => post("/api/stop_proc",  { camera_name: name }).then(() => setCamEnabled(p => ({ ...p, [name]: false })));
  const handleStartAllCamera   = () => fetch(`${API_URL}/api/start_all_proc`).then(fetchCameras);
  const handleStopAllCamera    = () => fetch(`${API_URL}/api/stop_all_proc`).then(fetchCameras);
  const handleRestartAllCamera = () => fetch(`${API_URL}/api/restart_all_proc`).then(fetchCameras);

  // Feed controls (no local state update; query will pick up)
  const handleOpenFeed = name =>
    post("/api/start_feed", { camera_name: name }).then(fetchCameras);

  const handleCloseFeed = name =>
    post("/api/stop_feed", { camera_name: name }).then(fetchCameras);

  return (
    <div className="camera-manager">
      <h2>Camera Management (Status View)</h2>
      <button onClick={() => setModalVisible(true)}>Add Camera</button>
      <button onClick={handleRestartAllCamera}>Restart all</button>
      <button onClick={handleStartAllCamera}>Start all</button>
      <button onClick={handleStopAllCamera}>Stop all</button>

      {isModalVisible && (
        <AddCameraModal
          onClose={() => setModalVisible(false)}
          onAddCamera={handleAddCamera}
        />
      )}

      <div className="camera-list">
        {cameraList.map(cam => (
          <div key={cam.camera_name} className="camera-item">
            <img src={symbolicCameraImg} alt="" className="feed-img" />
            <span>{cam.camera_name}</span>
            {camEnabled[cam.camera_name] ? <GreenIndicator /> : <RedIndicator />}
            <button onClick={() => handleStartCamera(cam.camera_name)}>Start Cam</button>
            <button onClick={() => handleStopCamera(cam.camera_name)}>Stop Cam</button>
            {activeFeed === cam.camera_name
              ? <button onClick={() => handleCloseFeed(cam.camera_name)}>Close Feed</button>
              : <button onClick={() => handleOpenFeed(cam.camera_name)}>Open Feed</button>
            }
            <button onClick={() => handleRemoveCamera(cam.camera_name)}>Remove</button>
          </div>
        ))}
      </div>

      <LiveFeed
        activeCameraName={activeFeed}
        cameraFeeds={cameraFeeds}
        onClose={handleCloseFeed}
      />
    </div>
  );
}
