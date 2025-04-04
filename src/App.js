// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import { privateRoutes, publicRoutes } from "./routes";
import AppRoute from "./routes/route";

function App() {
  console.log("App rendered");
  return (
    <Router>
      <Routes>
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={route.element}
            key={idx}
            exact={true}
          />
        ))}

        <Route
          path="/"
          element={
            <AppRoute>
              <DashboardLayout />
            </AppRoute>
          }
        >
          {privateRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={route.element}
              key={idx}
              exact={true}
            />
          ))}
        </Route>

        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </Router>
  );
}

export default App;
