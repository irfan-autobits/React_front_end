import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './LiveFeed.css';
import { GreenIndsmncli } from '../camera_management/IndicatorComponents';
import symbolicCameraImg from '../../assets/camshutter.png';

const LiveFeed = () => {
  const [cameraList, setCameraList] = useState([]);
  const [cameraFeeds, setCameraFeeds] = useState({});
  const [activeCameraName, setActiveCameraName] = useState(localStorage.getItem('activeCamera') || null);

  useEffect(() => {
    fetchCameras();
    const socket = io();

    socket.on('frame', ({ camera_name, status, image }) => {
      setCameraFeeds(prev => ({
        ...prev,
        [camera_name]: { status, image },
      }));
    });

    return () => socket.disconnect();
  }, []);

  const fetchCameras = async () => {
    try {
      const response = await fetch('/api/camera_list');
      const data = await response.json();
      if (data.cameras) {
        const activeCameras = data.cameras.filter(cam => cam.status);
        setCameraList(activeCameras);
      }
    } catch (error) {
      console.error("Error fetching cameras:", error);
    }
  };

  const handleStartCamera = async (cameraName) => {
    try {
      await fetch('/api/start_feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ camera_name: cameraName }),
      });

      setActiveCameraName(cameraName);
      localStorage.setItem('activeCamera', cameraName); // Persist across renders
      fetchCameras();
    } catch (error) {
      console.error("Error starting camera:", error);
    }
  };

  const handleStopCamera = async (cameraName) => {
    try {
      await fetch('/api/stop_feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ camera_name: cameraName }),
      });

      if (activeCameraName === cameraName) {
        console.log("green indicator clicked and req for stop feed.")
        setActiveCameraName(null);
        localStorage.removeItem('activeCamera'); // Clear persistence
      }

      fetchCameras();
    } catch (error) {
      console.error("Error stopping camera:", error);
    }
  };

  const handleFullscreen = (cameraName) => {
    const imgElement = document.getElementById("feed_" + cameraName);
    if (imgElement?.requestFullscreen) {
      imgElement.requestFullscreen();
    }
  };

  return (
    <div className="camera-manager">
      <h2>Live Feed</h2>
      <div className="camera-list">
        {cameraList.length === 0 ? (
          <p>No cameras are currently processing.</p>
        ) : (
          cameraList.map(cam => (
            <div key={cam.camera_name} className="camera-item">
              <img src={symbolicCameraImg} alt="Camera Icon" className="feed-img" />
              <span>{cam.camera_name}</span>
              <GreenIndsmncli />
              <button onClick={() => handleStartCamera(cam.camera_name)}>Open</button>
            </div>
          ))
        )}
      </div>

      {activeCameraName && (
        <div key="activeFeed" className="camera-feed-card">
          <div className="card-header">
            <h3>{activeCameraName}</h3>
            <button onClick={() => handleStopCamera(activeCameraName)} className="close-btn">×</button>
          </div>
          <div className="card-body">
            <img
              id={'feed_' + activeCameraName}
              src={`data:image/jpeg;base64,${cameraFeeds[activeCameraName]?.image || ''}`}
              alt={activeCameraName}
              onClick={() => handleFullscreen(activeCameraName)}
              className="feed-img"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveFeed;
