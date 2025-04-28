import React, { useRef } from "react";

export default function LiveFeed({ activeCameraName, cameraFeeds, onClose }) {
  const imgRef = useRef();

  if (!activeCameraName) return null;
  const feed = cameraFeeds[activeCameraName];
  if (!feed?.imageUrl) return <div>Waiting for feed…</div>;

  // Fullscreen handler
  const goFullscreen = () => {
    if (imgRef.current.requestFullscreen) {
      imgRef.current.requestFullscreen();
    }
  };

  return (
    <div className="live-feed-container">
      <div className="camera-feed-card">
        <div className="card-header">
          <h3>{activeCameraName}</h3>
          <button onClick={() => onClose(activeCameraName)}>×</button>
        </div>
        <div className="card-body">
          <img
            ref={imgRef}
            src={feed.imageUrl}
            alt={`Live feed: ${activeCameraName}`}
            className="feed-img"
            onClick={goFullscreen}       // ← make it fullscreen on click
            style={{ cursor: "pointer" }} // user hint
          />
        </div>
      </div>
    </div>
  );
}
