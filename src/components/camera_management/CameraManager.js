// src/components/camera_management/CameraManager.js
import React, { useState, useEffect } from "react";
import "./CameraManager.css";
import AddCameraModal from "./AddCameraModal";
import { GreenIndicator, RedIndicator } from "./IndicatorComponents";
import symbolicCameraImg from "../../assets/camshutter.png";
import LiveFeed from "./LiveFeed";
import socket from "../../socket";
const API_URL = process.env.REACT_APP_API_URL;

const CameraManager = () => {
  const [cameraList,  setCameraList]  = useState([]);
  const [camEnabled,  setCamEnabled]  = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeCameraName, setActiveCameraName] = useState(null);
  const [cameraFeeds,  setCameraFeeds]  = useState({});
  // ─── fetch cameras & socket handlers ───────────────────────────────────
  useEffect(() => {
    fetchCameras();
    socket.on("connect",         () => console.log("socket connected"));
    socket.on("feed_started",    ({ camera_name }) => {
      console.log("feed started for", camera_name);
      setActiveCameraName(camera_name);
    });
    socket.on("feed_stopped",    ({ camera_name }) => {
      console.log("feed stopped for", camera_name);
      setActiveCameraName(prev => prev === camera_name ? null : prev);
    });

    socket.on("frame-bin", payload => {
      console.log("🔴 front-end got frame-bin:", payload.camera_name, payload.image);
      // now you get one “payload” object with two fields
      const { camera_name, image } = payload;
      console.log("got frame-bin:", camera_name, image);
      const blob = new Blob([image], { type: "image/jpeg" });
      const url  = URL.createObjectURL(blob);
      setCameraFeeds(prev => {
        prev[camera_name]?._url && URL.revokeObjectURL(prev[camera_name]._url);
        return { 
          ...prev,
          [camera_name]: { imageUrl: url, _url: url }
        };
      });
    });

    return () => {
      socket.off("feed_started");
      socket.off("feed_stopped");      
      socket.off("frame-bin");
    };
  }, []);

  const fetchCameras = async () => {
    try {
      const res = await fetch(`${API_URL}/api/camera_list`);
      const { cameras } = await res.json();
      setCameraList(cameras);
      const init = {};
      cameras.forEach(c => { init[c.camera_name] = c.status; });
      setCamEnabled(init);
    } catch (e) { console.error(e) }
  };

  // ─── camera control helpers ────────────────────────────────────────────
  const post = (url, body) =>
    fetch(`${API_URL}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  const handleAddCamera = data => {
    post("/api/add_camera", data).then(fetchCameras);
  };
  const handleRemoveCamera = name => {
    post("/api/remove_camera", { camera_name: name }).then(fetchCameras);
  };
  const handleStartCamera = name => {
    post("/api/start_proc", { camera_name: name })
      .then(() => setCamEnabled(e => ({ ...e, [name]: true })));
  };
  const handleStopCamera = name => {
    post("/api/stop_proc", { camera_name: name })
      .then(() => setCamEnabled(e => ({ ...e, [name]: false })));
  };
  const handleStartAllCamera = () =>
    fetch(`${API_URL}/api/start_all_proc`).then(fetchCameras);
  const handleStopAllCamera = () =>
    fetch(`${API_URL}/api/stop_all_proc`).then(fetchCameras);
  const handleRestartAllCamera = () =>
    fetch(`${API_URL}/api/restart_all_proc`).then(fetchCameras);

  const handleOpenFeed = name => {
    post("/api/start_feed", { camera_name: name }).then(() => {
      fetchCameras();
      setActiveCameraName(name); // 🛠️ Tell React to show feed
    });
  };
  
  const handleCloseFeed = name => {
    post("/api/stop_feed", { camera_name: name }).then(() => {
      fetchCameras();
      setActiveCameraName(name);
    });
  }
    

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
            <img src={symbolicCameraImg} alt="" className="feed-img"/>
            <span>{cam.camera_name}</span>
            {camEnabled[cam.camera_name] ? <GreenIndicator/> : <RedIndicator/>}
            <button onClick={()=>handleStartCamera(cam.camera_name)}>Start Cam</button>
            <button onClick={()=>handleStopCamera(cam.camera_name)}>Stop Cam</button>
            {activeCameraName === cam.camera_name
              ? <button onClick={()=>handleCloseFeed(cam.camera_name)}>Close Feed</button>
              : <button onClick={()=>handleOpenFeed(cam.camera_name)}>Open Feed</button>
            }
            <button onClick={()=>handleRemoveCamera(cam.camera_name)}>Remove</button>
          </div>
        ))}
      </div>

      <LiveFeed
        activeCameraName={activeCameraName}
        cameraFeeds={cameraFeeds}
        onClose={handleCloseFeed}
      />
    </div>
  );
};

export default CameraManager;
