// src/components/AnalysisTable.js
import React, { useState, useEffect } from 'react';

const AnalysisTable = () => {
  // State to hold detection records
  const [data, setData] = useState([]);
  // State for sorting
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  // State for filtering (simple text search)
  const [filterText, setFilterText] = useState('');

  // Fetch detection data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/reco_table');
        const jsonData = await response.json();
        console.log("Fetched data:", jsonData);
        // setData(jsonData); // assume jsonData is an array of objects
        setData(jsonData.detections || []); // assume jsonData is an object which has array of objects
      } catch (error) {
        console.error('Error fetching detection table data:', error);
      }
    };

    fetchData();
  }, []);
 
  // Handle sorting when a header is clicked
  const handleSort = (field) => {
    // Toggle sort order if the same field is clicked again
    const newSortOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newSortOrder);
  };

  // Filter data based on filterText
  const filteredData = data.filter(record =>
    Object.values(record).some(val => String(val).toLowerCase().includes(filterText.toLowerCase()))
  );

  // Sort the filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div>
      <h2>Detection Table</h2>
      <input 
         type="text" 
         placeholder="Filter results..." 
         value={filterText} 
         onChange={e => setFilterText(e.target.value)} 
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>ID</th>
            <th onClick={() => handleSort('person')}>Person Name</th>
            <th onClick={() => handleSort('camera_name')}>Camera Name</th>
            <th onClick={() => handleSort('det_score')}>Detection Score</th>
            <th onClick={() => handleSort('distance')}>Distance from known</th>
            <th onClick={() => handleSort('timestamp')}>Timestamp</th>
            <th onClick={() => handleSort('det_face')}>Image</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((record, index) => (
            <tr key={index}>
              <td>{record.id}</td>
              <td>{record.person}</td>
              <td>{record.camera_name}</td>
              <td>{record.det_score}</td>
              <td>{record.distance}</td>
              <td>{record.timestamp}</td>
              <td><img src={record.det_face} alt="Detected Face" width="50" height="50" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnalysisTable;
