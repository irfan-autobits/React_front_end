// src/components/DashboardLayout.js
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import './DashboardLayout.css'; // Import the CSS file

const DashboardLayout = () => {
  console.log("DashboardLayout rendered");
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <nav>
          <ul>
            <li>
              <NavLink 
                to="/dashboard/cameras" 
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Camera Feed
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/dashboard/stats" 
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Stats &amp; Insights
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
