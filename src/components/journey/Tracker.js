import React, { useState, useEffect } from 'react';
import PersonSelector from './ListPerson';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import { localToUtcIso, parseTimestamp, formatTimestamp } from '../utils/time';
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
      const response = await fetch(
        `${API_URL}/api/movement/${encodeURIComponent(personName)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // convert local inputs into full UTC ISO strings:
            start_time: localToUtcIso(startTime),
            end_time:   localToUtcIso(endTime),
          }),
        }
      );
  
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
  
    // Specify how many nodes per row (grid width)
    const numPerRow = 5;
    const xSpacing = 300; // horizontal spacing between nodes
    const ySpacing = 150; // vertical spacing between rows

    const nodes = movementHistory.map((entry, index) => {
      const row = Math.floor(index / numPerRow);
      const col = index % numPerRow;
      // For even rows (0, 2, ...): left-to-right order
      // For odd rows (1, 3, ...): right-to-left order
      const x = row % 2 === 0 ? col * xSpacing : (numPerRow - 1 - col) * xSpacing;
      const y = row * ySpacing;
      
    const date = parseTimestamp(entry.entry_time); // entry_time is ISO with offset
    return {
        id: `node-${index}`,
        type: 'custom',
        data: { 
          label: `${entry.camera_tag}\n at: ${formatTimestamp(date)}\n Duration: ${entry.duration}`
        },
        position: { x, y },
      };
    });
  
    // Create edges connecting sequential nodes
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
      {/* Time inputs remain as-is */}
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
        <div style={{ width: '100%', height: 700, border: '1px solid #ccc', marginTop: '20px' }}>
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
