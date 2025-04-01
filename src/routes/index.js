// src/routes/index.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import CameraFeed from '../components/camera_feed';
import StatsPage from '../components/StatsPage';
import Login from '../components/login';
import Signup from '../components/sign_up';
import Logout from '../components/logout';

const publicRoutes = [
  { path: "/logout", element: <Logout /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Signup /> },
  { path: "*", element: <Navigate to="/" /> },
];

const privateRoutes = [
  {
    path: "/dashboard/*",
    element: <DashboardLayout />,
    children: [
      { path: "cameras", element: <CameraFeed /> },
      { path: "stats", element: <StatsPage /> },
      { path: "", element: <CameraFeed /> }  // default route
    ],
  },
];

export { publicRoutes, privateRoutes };
