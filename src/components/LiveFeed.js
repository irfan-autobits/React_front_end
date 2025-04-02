// src/components/LiveFeed.js
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './LiveFeed.css'; // Create this file for component-specific styling

const LiveFeed = () => {
  // State for list of cameras (fetched from API)
  const [cameraList, setCameraList] = useState([]);
  // State for open/close toggling for each camera
  const [camEnabled, setCamEnabled] = useState({});
  // State for live feed data coming from Socket.IO
  const [cameraFeeds, setCameraFeeds] = useState({});


  // Establish Socket.IO connection for live feed
  useEffect(() => {
    const socket = io();
    socket.on('frame', (data) => {
      const { camera_name, status, image } = data;
      setCameraFeeds((prevFeeds) => ({
        ...prevFeeds,
        [camera_name]: { status, image },
      }));
    });
    return () => socket.disconnect();
  }, []);

  // Fetch cameras list from your API when component mounts
  useEffect(() => {
    fetchCameras();
  }, []);

  // Fetch camera list from the backend
  const fetchCameras = async () => {
    try {
      const response = await fetch('/api/camera_list', { method: 'GET' });
      const data = await response.json();
      setCameraList(data.cameras || []);
      // Initialize each camera's enabled state if not set
      const initialEnabled = {};
      data.cameras.forEach((cam) => {
        initialEnabled[cam.camera_name] = true;
      });
      setCamEnabled(initialEnabled);
    } catch (error) {
      console.error("Error fetching cameras:", error);
    }
  };

  // API call to remove a camera
  const handleRemoveCamera = async (cameraName) => {
    try {
      const response = await fetch('/api/remove_camera', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ camera_name: cameraName })
      });
      const data = await response.json();
      console.log("Camera removed:", data);
      // Refresh the camera list
      fetchCameras();
    } catch (error) {
      console.error("Error removing camera:", error);
    }
  };

  // API call to start a camera feed (if needed)
  const handleStartCamera = async (cameraName) => {
    try {
      await fetch('/api/start_feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ camera_name: cameraName })
      });
      // Optionally update state if needed
      setCamEnabled((prev) => ({ ...prev, [cameraName]: true }));
    } catch (error) {
      console.error("Error starting camera:", error);
    }
  };

  // API call to stop a camera feed
  const handleStopCamera = async (cameraName) => {
    try {
      await fetch('/api/stop_feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ camera_name: cameraName })
      });
      // Update state to mark as closed
      setCamEnabled((prev) => ({ ...prev, [cameraName]: false }));
    } catch (error) {
      console.error("Error stopping camera:", error);
    }
  };

  // Fullscreen handler for a camera feed
  const handleFullscreen = (cameraName) => {
    const imgElement = document.getElementById("feed_" + cameraName);
    if (imgElement) {
      if (imgElement.requestFullscreen) {
        imgElement.requestFullscreen();
      } else if (imgElement.mozRequestFullScreen) {
        imgElement.mozRequestFullScreen();
      } else if (imgElement.webkitRequestFullscreen) {
        imgElement.webkitRequestFullscreen();
      } else if (imgElement.msRequestFullscreen) {
        imgElement.msRequestFullscreen();
      }
    }
  };

  return (
    <div className="camera-manager">
      <h2>Live Feed</h2>

      {/* List of cameras in sidebar style */}
      <div className="camera-list">
        {cameraList.map((cam) => (
          <div key={cam.camera_name} className="camera-item">
            <span>{cam.camera_name}</span>
            {/* <button onClick={() => handleRemoveCamera(cam.camera_name)}>Remove</button> */}
            {camEnabled[cam.camera_name] ? (
              <button onClick={() => handleStopCamera(cam.camera_name)}>Close</button>
            ) : (
              <button onClick={() => handleStartCamera(cam.camera_name)}>Open</button>
            )}
          </div>
        ))}
      </div>

      {/* Display camera feed cards */}
      <div className="camera-cards">
        {Object.keys(cameraFeeds).map((cameraName) => (
          camEnabled[cameraName] && (
            <div key={cameraName} className="camera-feed-card">
              <div className="card-header">
                <h3>{cameraName}</h3>
                {/* Button to close the feed */}
                <button onClick={() => handleStopCamera(cameraName)} className="close-btn">×</button>
              </div>
              <div className="card-body">
                <img
                  id={'feed_' + cameraName}
                  src={`data:image/jpeg;base64,${cameraFeeds[cameraName].image}`}
                  alt={cameraName}
                  onClick={() => handleFullscreen(cameraName)}
                />
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default LiveFeed;
