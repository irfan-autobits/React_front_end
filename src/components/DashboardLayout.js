// src/components/DashboardLayout.js
// Example update in DashboardLayout.js
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import './DashboardLayout.css'; // Your layout CSS

const DashboardLayout = (props) => {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <nav>
          <ul>
            <li>
              <NavLink to="/cameras" className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}>
                Camera Manager
              </NavLink>
            </li>
            <li>
              <NavLink to="/stats" className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}>
                Stats & Insights
              </NavLink>
            </li>
            <li>
              <NavLink to="/analysis" className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}>
                Analysis
              </NavLink>
            </li>
            <li>
              <NavLink to="/tracker" className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}>
                Person Tracker
              </NavLink>
            </li>    
            <li>
              <NavLink to="/subjectman" className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}>
                Subjects Manager
              </NavLink>
            </li>    
            <li>
              <NavLink to="/settings" className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}>
                Settings
              </NavLink>
            </li>                              
            {/* <li>
              <NavLink to="/location" className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}>
                Location Manager
              </NavLink>
            </li>              */}
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
