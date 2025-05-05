// src/components/StatsPage.js
import React, { useState, useEffect } from "react";
import "./StatsPage.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import GanttChart from '../../components/ui/GanttChart';
import { BarChartBig, User, Camera, Clock, Cpu} from "lucide-react";
import { parseTimestamp, formatTimestamp } from "../utils/time";
const API_URL = process.env.REACT_APP_API_URL;

const StatsPage = () => {
  console.log("StatsPage rendered");
  const [sysstats, setSysStats] = useState({
    model: "",
    total_subjects: 0,
    total_cameras: 0,
    total_detections: 0,
    avg_response_time: 0,
    subjects: [],
  });
  const [dayData, setDayData] = useState([]);
  const [camData, setCamData] = useState([]);
  const [subData, setSubData] = useState([]);
  const [camTmln, setCamTmln] = useState([]);
  const [camRange, setCamRange] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // → new state for date window:
  const today = new Date().toISOString().slice(0,10); // "YYYY-MM-DD"
  const [startDate, setStartDate] = useState(today);
  const [endDate,   setEndDate]   = useState(today);
  
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/api/system_stats`).then((r) => r.json()),
      fetch(
        `${API_URL}/api/detections_stats?start=${startDate}&end=${endDate}`
      ).then((r) => r.json()),
      fetch(
        `${API_URL}/camera_timeline?start=${startDate}&end=${endDate}`
      ).then((r) => r.json()),
    ])
      .then(([sys, det, camtl]) => {
        console.log("Sys:", sys, "Det:", det, "CamTimeLine:", camtl);
        setSysStats(sys);
        setDayData(det.day_stats);
        setCamData(det.camera_stats);
        setSubData(det.subject_stats);
        setCamTmln(camtl.camData);
        setCamRange(camtl.range);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [startDate, endDate]);
  
  if (loading) return <div>Loading stats…</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      <div className="stats-page p-6 bg-muted min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Stats & Insights</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex items-center gap-3">
              {/* Swap to a CPU / processor icon for “model” */}
              <Cpu className="text-primary" />
              <CardTitle>Model Used</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-foreground">
              {sysstats.model || "–"}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center gap-3">
              {/* a video-camera icon makes more sense for “active cameras” */}
              <Camera className="text-primary" />
              <CardTitle>Active Cameras</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-foreground">
              {sysstats.active_cameras}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center gap-3">
              <BarChartBig className="text-primary" />
              <CardTitle>Total Detections</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-foreground">
              {sysstats.total_detections}
            </CardContent>
          </Card>

          {/* If you really want four cards, either add a new metric in your API
              or repurpose this slot (e.g. count of returned subjects): */}
          <Card>
            <CardHeader className="flex items-center gap-3">
              {/* switch to a “people” or “user” icon for subjects */}
              <User className="text-primary" />
              <CardTitle>Total Subjects</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-foreground">
              {sysstats.subjects.length}
            </CardContent>
          </Card>
        </div>

        <div className="bg-background rounded-2xl p-6 shadow-md">
          <div >
          <div className="date-picker-row" style={{ marginBottom: '1rem' }}>
          <label>
            start Date:&nbsp;
            <input
              type="date"
              value={startDate}
              max={endDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </label>
          &nbsp;&nbsp;
          <label>
          end Date:&nbsp;
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </label>
        </div>            
          </div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Activity Overview
          </h2>
          {/* Add graph or table here */}
          <div className="text-muted-foreground">
            <div>
              <h2>Day‑wise Detections</h2>
              <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dayData}>
                <CartesianGrid strokeDasharray="3 3" />
                {/* format each tick via your util */}
                <XAxis 
                  dataKey="date"
                  tickFormatter={ts => formatTimestamp(new Date(ts))}  // Direct conversion
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={ts => formatTimestamp(new Date(ts))}
                />
                <Line type="monotone" dataKey="count" />
              </LineChart>
              </ResponsiveContainer>

              <h2>Camera‑wise Detections</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={camData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="camera" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>

              <h2>Subject‑wise Detections</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="gantt-container">

            <GanttChart
                title="Camera / Feed Timeline"
                categories={camTmln.map(c => c.camera)}
                tasks={camTmln.flatMap(cam =>
                  // activePeriods ⇒ big blue bars
                  cam.activePeriods.map(p => ({
                    camera: cam.camera,
                    name:   'Camera On',
                    start:  new Date(p.start),
                    end:    new Date(p.end),
                    type:   'camera'
                  }))
                  .concat(
                    // feeds ⇒ smaller green bars
                    cam.feeds.map(f => ({
                      camera: cam.camera,
                      name:   'Feed',
                      // you can leave them as ISO strings, assuming GanttChart parses them
                      start:  new Date(f.start),
                      end:    new Date(f.end),
                      type:   'feed'
                    }))
                  )
              )}
                // If your GanttChart wants Date objects instead of ISO, you could do:
                // range={[ parseTimestamp(camRange.min), parseTimestamp(camRange.max) ]}
              range={{
                min: camRange.min,   // ISO, e.g. "2025-05-03T05:30:00Z"
                max: camRange.max
              }}
              />  
              </div>
            {sysstats.subjects && sysstats.subjects.length > 0 && (

              <table>
                <thead>
                  <tr>
                    {/* <th>Subject ID</th> */}
                    <th>Subject Name</th>
                    <th>Image Count</th>
                    <th>Embedding Count</th>
                  </tr>
                </thead>
                <tbody>
                  {sysstats.subjects.map((subject) => (
                    <tr key={subject.subject_id}>
                      {/* <td>{subject.subject_id}</td> */}
                      <td>{subject.subject_name}</td>
                      <td>{subject.image_count}</td>
                      <td>{subject.embedding_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          {/* text muted div close */}
          </div>
        {/* activity overview div close */}
        </div>
      {/* full page div close */}
      </div>
    {/* main div close */}
    </div>
  );
};

export default StatsPage;
