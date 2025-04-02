// Example update in DashboardLayout.js
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import './DashboardLayout.css'; // Your layout CSS

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <nav>
          <ul>
            <li>
              <NavLink to="/dashboard/cameras" className={({ isActive }) => (isActive ? 'active' : '')}>
                Camera Manager
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/stats" className={({ isActive }) => (isActive ? 'active' : '')}>
                Stats &amp; Insights
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/analysis" className={({ isActive }) => (isActive ? 'active' : '')}>
                Analysis
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/live" className={({ isActive }) => (isActive ? 'active' : '')}>
                Live Feed
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
