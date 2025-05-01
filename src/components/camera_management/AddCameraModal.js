// src/components/AddCameraModal.js
import React, { useState } from 'react';
import './AddCameraModal.css';

const AddCameraModal = ({ onClose, onAddCamera }) => {
  const [mode, setMode] = useState('direct'); // 'direct' or 'construct'
  const [cameraName, setCameraName] = useState('');
  const [directUrl, setDirectUrl] = useState('');
  const [tag, setTag] = useState(''); // New field for the tag
  // Fields for constructing URL
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [ip, setIp] = useState('');
  const [port, setPort] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    let cameraUrl = '';
    if (mode === 'direct') {
      cameraUrl = directUrl;
    } else {
      // Construct RTSP URL from the inputs
      cameraUrl = `rtsp://${username}:${password}@${ip}:${port}`;
    }
    // Pass both the camera name and URL to the parent component
    onAddCamera({ camera_name: cameraName, camera_url: cameraUrl, tag: tag });
    // Close the modal after submission
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Add Camera</h2>
        <form onSubmit={handleSubmit}>

          
          {/* Mode Selector */}
          <div className="mode-selector">
            <button type="button" onClick={() => setMode('direct')} className={mode === 'direct' ? 'active' : ''}>
              Direct URL
            </button>
            <button type="button" onClick={() => setMode('construct')} className={mode === 'construct' ? 'active' : ''}>
              Construct URL
            </button>
          </div>

          {/* Common input for Camera Name */}
          <div>
          <br/><label>Camera Name:</label>
            <input
              type="text"
              value={cameraName}
              onChange={(e) => setCameraName(e.target.value)}
              placeholder="Enter camera name"
              required
            />
          </div>
          <div>
          <br/><label>Camera Tag:</label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Enter camera tag"
              required
            />
          </div>

          {mode === 'direct' ? (
            <div>
              <br/><label>Camera URL:</label>
              <input
                type="text"
                value={directUrl}
                onChange={(e) => setDirectUrl(e.target.value)}
                placeholder="Enter camera URL"
                required
              />
            </div>
          ) : (
            <div>
              <br/><label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
                required
              />
              <br/><br/><label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
              />
              <br/><br/><label>Camera IP:</label>
              <input
                type="text"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="Enter camera IP"
                required
              />
              <br/><br/><label>Port:</label>
              <input
                type="text"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="Enter camera Port"
                required
              />
            </div>
          )}
          <br/><button type="submit">Add Camera</button>
        </form>
      </div>
    </div>
  );
};

export default AddCameraModal;