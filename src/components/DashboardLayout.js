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
              <NavLink to="/cameras" className={({ isActive }) => (isActive ? 'active' : '')}>
                Camera Manager
              </NavLink>
            </li>
            <li>
              <NavLink to="/stats" className={({ isActive }) => (isActive ? 'active' : '')}>
                Stats &amp; Insights
              </NavLink>
            </li>
            <li>
              <NavLink to="/analysis" className={({ isActive }) => (isActive ? 'active' : '')}>
                Analysis
              </NavLink>
            </li>
            <li>
              <NavLink to="/tracker" className={({ isActive }) => (isActive ? 'active' : '')}>
                Person Tracker
              </NavLink>
            </li>    
            <li>
              <NavLink to="/subjectman" className={({ isActive }) => (isActive ? 'active' : '')}>
                Subjects Manager
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
