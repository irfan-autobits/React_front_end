// src/components/LiveFeed.js
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './LiveFeed.css';
import BasicButtons from "../ui/MuiButton";

const LiveFeed = ({ activeCameraName, handleCloseFeed, cameraFeeds, handleFullscreen }) => {
  // We no longer maintain our own activeCameraName here.
  // We can, however, fetch frames from the socket if needed.
  // If you want to ensure the latest feed is updated, you can keep the socket logic here:
  useEffect(() => {
    const socket = io();
    socket.on('frame', ({ camera_name, status, image }) => {
      // We update the cameraFeeds prop in the parent; for simplicity, you could call a callback.
      // For now, assume parent updates cameraFeeds.
    });
    return () => socket.disconnect();
  }, []);

  return (
    <div className="live-feed-container">
      {activeCameraName && (
        <div key="activeFeed" className="camera-feed-card">
          <div className="card-header">
            <h3>{activeCameraName}</h3>
            {/* <button onClick={() => handleCloseFeed(activeCameraName)} className="close-btn">×</button> */}
            <BasicButtons
              onClickHandler={() => handleCloseFeed(activeCameraName)}
              variant={"text"} 
              content={"X"} 
            />            
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
