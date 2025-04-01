// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import CameraFeed from './components/camera_feed';
import CameraManager from './components/CameraManager';
import StatsPage from './components/StatsPage';

function App() {
  console.log("App rendered");
  return (
    <Router>
      <Routes>
        {/* Redirect root to /dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        {/* Dashboard layout with nested routes */}
        <Route path="/dashboard/*" element={<DashboardLayout />}>
          {/* Default nested route */}
          {/* <Route index element={<CameraFeed />} />
          <Route path="cameras" element={<CameraFeed />} /> */}
        
          <Route index element={<CameraManager />} />
          <Route path="cameras" element={<CameraManager />} />
                    
          <Route path="stats" element={<StatsPage />} />
        </Route>
        
        {/* Fallback for undefined routes */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
