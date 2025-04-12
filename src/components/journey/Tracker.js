import React, { useState, useEffect } from 'react';
import PersonSelector from './ListPerson';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
const API_URL = process.env.REACT_APP_API_URL;

const Tracker = () => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [movementHistory, setMovementHistory] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');


  // Convert the date string to a Date object (ensure ISO format)
  const parseDate = (dateStr) => new Date(dateStr.replace(' ', 'T'));

  const fetchMovementHistory = async (personName) => {
    console.log("Fetching journey for:", personName);
    if (!personName) return;
  
    try {
      const response = await fetch(`${API_URL}/api/movement/${encodeURIComponent(personName)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start_time: startTime,
          end_time: endTime,
        }),
      });
  
      const data = await response.json();
      console.log("API response:", data);
      setMovementHistory(data || []);
    } catch (error) {
      console.error("Error fetching movement history:", error);
      setMovementHistory([]);
    }
  };
  
  

  // Generate nodes and edges for React Flow from movementHistory
  const generateNodesAndEdges = () => {
    if (!movementHistory.length) return { nodes: [], edges: [] };

    const nodes = movementHistory.map((entry, index) => ({
      id: `node-${index}`,
      type: 'custom', 
      data: { label: `${entry.camera_tag}\n at: ${parseDate(entry.entry_time).toLocaleString()}\n Duration: ${entry.duration} s` },
      // position: { x: index * 220, y: 100 },
      position: { x: 100, y: index * 150 }, // x is fixed; y increases with each node
    }));

    const edges = movementHistory.slice(1).map((entry, index) => ({
      id: `edge-${index}`,
      source: `node-${index}`,
      target: `node-${index + 1}`,
      animated: true,
    }));

    return { nodes, edges };
  };

  const { nodes, edges } = generateNodesAndEdges();

  return (
    <div>
      <PersonSelector onSelectPerson={setSelectedPerson} />
      <button 
        onClick={() => fetchMovementHistory(selectedPerson)} 
        disabled={!selectedPerson || !startTime || !endTime}
      >
        Show Journey
      </button>

      <div style={{ marginTop: '10px' }}>
        <label>
          Start Time: 
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            style={{ margin: '0 10px' }}
          />
        </label>

        <label>
          End Time: 
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
      </div>

      {movementHistory.length > 0 ? (
        <div style={{ width: '100%', height: 300, border: '1px solid #ccc', marginTop: '20px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={{ custom: CustomNode }}
          nodesDraggable={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
        >
          <Background color="#aaa" gap={16} />
          <Controls showInteractive={false} />
        </ReactFlow>

        </div>
      ) : (
        <p>No journey data available.</p>
      )}
    </div>
  );
};

export default Tracker;
