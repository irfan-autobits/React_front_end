// src/components/camera_feed.js
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const CameraFeed = () => {
  console.log("CameraFeed rendered");
  const [cameraFeeds, setCameraFeeds] = useState({});

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

  return (
    <div id="camera-feeds">
      {Object.keys(cameraFeeds).length === 0 ? (
        <p>No camera feeds yet.</p>
      ) : (
        Object.keys(cameraFeeds).map((cameraName) => (
          <div key={cameraName} className="camera-feed">
            <h3>{cameraName}</h3>
            <img
              id={'feed_' + cameraName}
              src={`data:image/jpeg;base64,${cameraFeeds[cameraName].image}`}
              alt={cameraName}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default CameraFeed;
