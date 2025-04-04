// src/routes/index.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import Logout        from '../components/user_auth/logout';
import Login         from '../components/user_auth/login';
import Signup        from '../components/user_auth/sign_up';
import CameraManager from '../components/camera_management/CameraManager';
import AnalysisTable from '../components/analy_tab/AnalysisTable';
import StatsPage     from '../components/stats/StatsPage';
import LiveFeed      from '../components/live_stream/LiveFeed';
import Tracker       from '../components/journey/Tracker';

const publicRoutes = [
  { path: "/logout", element: <Logout /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Signup /> },
  { path: "*", element: <Navigate to="/" /> },
];

const privateRoutes = [
  { path: "", element: <Navigate to="/cameras" /> },
  { path: "cameras", element: <CameraManager /> },
  { path: "analysis", element: <AnalysisTable /> },
  { path: "stats", element: <StatsPage /> },
  { path: "live", element: <LiveFeed /> },
  { path: "tracker", element: <Tracker /> },
];

export { publicRoutes, privateRoutes };
