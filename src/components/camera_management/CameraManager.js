// src/components/CameraManager.js
import React, { useState, useEffect } from 'react';
import './CameraManager.css';
import AddCameraModal from './AddCameraModal';
import { GreenIndsm, RedIndsm } from './IndicatorComponents'; // your indicator components
import symbolicCameraImg from '../../assets/camshutter.png'; // a symbolic camera icon image

const CameraManager = () => {
  const [cameraList, setCameraList] = useState([]);
  const [camEnabled, setCamEnabled] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);

  // Fetch camera list from the backend
  useEffect(() => {
    console.log("CameraManager mounted");
    fetchCameras();
  }, []);

  const fetchCameras = async () => {
    try {
      const response = await fetch('/api/camera_list');
      const data = await response.json();
      setCameraList(data.cameras || []);
      const initialEnabled = {};
      data.cameras.forEach(cam => {
        initialEnabled[cam.camera_name] = cam.status; // assume backend provides a 'status' field (true for on, false for off)
      });
      console.log("processing camera list : ",initialEnabled)
      setCamEnabled(initialEnabled);
    } catch (error) {
      console.error("Error fetching cameras:", error);
    }
  };

  const handleAddCamera = ({ name, url }) => {
    if (!name || !url) {
      alert("Please fill in all fields");
      return;
    }
    fetch('/api/add_camera', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ camera_name: name, camera_url: url })
    })
      .then(res => res.json())
      .then(data => {
        console.log("Camera added:", data);
        fetchCameras();
      })
      .catch(error => console.error("Error adding camera:", error));
  };

  const handleRemoveCamera = async (cameraName) => {
    try {
      await fetch('/api/remove_camera', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ camera_name: cameraName })
      });
      fetchCameras();
    } catch (error) {
      console.error("Error removing camera:", error);
    }
  };

  const handleStartCamera = async (cameraName) => {
    try {
      await fetch('/api/start_proc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ camera_name: cameraName })
      });
      setCamEnabled(prev => ({ ...prev, [cameraName]: true }));
    } catch (error) {
      console.error("Error starting camera:", error);
    }
  };

  const handleStopCamera = async (cameraName) => {
    try {
      await fetch('/api/stop_proc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ camera_name: cameraName })
      });
      setCamEnabled(prev => ({ ...prev, [cameraName]: false }));
    } catch (error) {
      console.error("Error stopping camera:", error);
    }
  };

  return (
    <div className="camera-manager">
      <h2>Camera Management (Status View)</h2>
      <button onClick={() => setModalVisible(true)}>Add Camera</button>
      {isModalVisible && (
        <AddCameraModal onClose={() => setModalVisible(false)} onAddCamera={handleAddCamera} />
      )}
      <div className="camera-list">
        {cameraList.map(cam => (
          <div key={cam.camera_name} className="camera-item">
            <img src={symbolicCameraImg} alt="Camera Icon" className="feed-img"/>

            <span>{cam.camera_name}</span>
            {camEnabled[cam.camera_name] ? (
              <GreenIndsm onClick={() => handleStopCamera(cam.camera_name)} />
            ) : (
              <RedIndsm onClick={() => handleStartCamera(cam.camera_name)} />
            )}
            <button onClick={() => handleRemoveCamera(cam.camera_name)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CameraManager;
