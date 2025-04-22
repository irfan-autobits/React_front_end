// src/components/CameraManager.js
import React, { useState, useEffect } from "react";
import "./CameraManager.css";
import AddCameraModal from "./AddCameraModal";
import { GreenIndicator, RedIndicator } from "./IndicatorComponents";
import symbolicCameraImg from "../../assets/camshutter.png";
import LiveFeed from "./LiveFeed";
import { io } from "socket.io-client";
const API_URL = process.env.REACT_APP_API_URL;

const CameraManager = () => {
  const [cameraList, setCameraList] = useState([]);
  const [camEnabled, setCamEnabled] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeCameraName, setActiveCameraName] = useState(
    localStorage.getItem("activeCamera") || null
  );
  const [cameraFeeds, setCameraFeeds] = useState({});

  // Socket connection and initial fetch
  useEffect(() => {
    console.log("CameraManager mounted");
    fetchCameras();

    const socket = io();
    socket.on("frame", ({ camera_name, status, image }) => {
      setCameraFeeds((prev) => ({
        ...prev,
        [camera_name]: { status, image },
      }));
    });

    return () => socket.disconnect();
  }, []);

  // Fetch cameras from backend
  const fetchCameras = async () => {
    try {
      const response = await fetch(`${API_URL}/api/camera_list`);
      const data = await response.json();
      setCameraList(data.cameras || []);
      const initialEnabled = {};
      data.cameras.forEach((cam) => {
        initialEnabled[cam.camera_name] = cam.status; // true if processing
      });
      console.log("processing camera list : ", initialEnabled);
      setCamEnabled(initialEnabled);
    } catch (error) {
      console.error("Error fetching cameras:", error);
    }
  };

  // Add a new camera
  const handleAddCamera = ({ name, url, tag}) => {
    if (!name || !url) {
      alert("Please fill in all fields");
      return;
    }
    fetch(`${API_URL}/api/add_camera`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ camera_name: name, camera_url: url , tag: tag}),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Camera added:", data);
        fetchCameras();
      })
      .catch((error) => console.error("Error adding camera:", error));
  };

  // Remove a camera
  const handleRemoveCamera = async (cameraName) => {
    try {
      await fetch(`${API_URL}/api/remove_camera`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ camera_name: cameraName }),
      });
      fetchCameras();
    } catch (error) {
      console.error("Error removing camera:", error);
    }
  };

  // Start/stop processing (for status indicator)
  const handleStartCamera = async (cameraName) => {
    try {
      await fetch(`${API_URL}/api/start_proc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ camera_name: cameraName }),
      });
      setCamEnabled((prev) => ({ ...prev, [cameraName]: true }));
    } catch (error) {
      console.error("Error starting camera:", error);
    }
  };

  const handleRestartAllCamera = async () => {
    try {
      const response = await fetch(`${API_URL}/api/restart_all_proc`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      // Optionally, log or inspect the response:
      const data = await response.json();
      console.log("Restart all response:", data);
      // After restart, re-fetch the camera list to update statuses.
      fetchCameras();
    } catch (error) {
      console.error("Error restarting cameras:", error);
    }
  };
  
  const handleStartAllCamera = async () => {
    try {
      const response = await fetch(`${API_URL}/api/start_all_proc`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      // Optionally, log or inspect the response:
      const data = await response.json();
      console.log("Start all response:", data);
      // After start, re-fetch the camera list to update statuses.
      fetchCameras();
    } catch (error) {
      console.error("Error starting cameras:", error);
    }
  };

  const handleStopAllCamera = async () => {
    try {
      const response = await fetch(`${API_URL}/api/stop_all_proc`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      // Optionally, log or inspect the response:
      const data = await response.json();
      console.log("Stop all response:", data);
      // After start, re-fetch the camera list to update statuses.
      fetchCameras();
    } catch (error) {
      console.error("Error stopping cameras:", error);
    }
  };

  const handleStopCamera = async (cameraName) => {
    try {
      await fetch(`${API_URL}/api/stop_proc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ camera_name: cameraName }),
      });
      setCamEnabled((prev) => ({ ...prev, [cameraName]: false }));
    } catch (error) {
      console.error("Error stopping camera:", error);
    }
  };

  // Feed control functions
  const handleOpenFeed = async (cameraName) => {
    try {
      await fetch(`${API_URL}/api/start_feed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ camera_name: cameraName }),
      });
      localStorage.setItem("activeCamera", cameraName);
      setActiveCameraName(cameraName);
      fetchCameras();
    } catch (error) {
      console.error("Error opening feed:", error);
    }
  };

  const handleCloseFeed = async (cameraName) => {
    try {
      await fetch(`${API_URL}/api/stop_feed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ camera_name: cameraName }),
      });
      if (activeCameraName === cameraName) {
        setActiveCameraName(null);
        localStorage.removeItem("activeCamera");
      }
      fetchCameras();
    } catch (error) {
      console.error("Error closing feed:", error);
    }
  };

  // Fullscreen handler for feed image
  const handleFullscreen = (cameraName) => {
    const imgElement = document.getElementById("feed_" + cameraName);
    if (imgElement?.requestFullscreen) {
      imgElement.requestFullscreen();
    }
  };

  return (
    <div className="camera-manager">
      <h2>Camera Management (Status View)</h2>
      <button onClick={() => setModalVisible(true)}>Add Camera</button>
      {isModalVisible && (
        <AddCameraModal
          onClose={() => setModalVisible(false)}
          onAddCamera={handleAddCamera}
        />
      )}
      <button onClick={() => handleRestartAllCamera()}>Restart all Camera</button>
      <button onClick={() => handleStartAllCamera()}>Start all Camera</button>
      <button onClick={() => handleStopAllCamera()}>Stop all Camera</button>

      <div className="camera-list">
        {cameraList.map((cam) => (
          <div key={cam.camera_name} className="camera-item">
            <img
              src={symbolicCameraImg}
              alt="Camera Icon"
              className="feed-img"
            />
            <span>{cam.camera_name}</span>
            {camEnabled[cam.camera_name] ? (
              <GreenIndicator />
            ) : (
              <RedIndicator />
            )}
            <button onClick={() => handleStartCamera(cam.camera_name)}>
              Start Cam
            </button>
            <button onClick={() => handleStopCamera(cam.camera_name)}>
              Stop Cam
            </button>
            {activeCameraName === cam.camera_name ? (
              <button onClick={() => handleCloseFeed(cam.camera_name)}>
                Close Feed
              </button>
            ) : (
              <button onClick={() => handleOpenFeed(cam.camera_name)}>
                Open Feed
              </button>
            )}
            <button onClick={() => handleRemoveCamera(cam.camera_name)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <LiveFeed
        activeCameraName={activeCameraName}
        handleCloseFeed={handleCloseFeed}
        cameraFeeds={cameraFeeds}
        handleFullscreen={handleFullscreen}
      />
    </div>
  );
};

export default CameraManager;
