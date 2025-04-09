// src/components/AnalysisTable.js
import React, { useState, useEffect } from 'react';
const API_URL = process.env.REACT_APP_API_URL;

const AnalysisTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const itemsPerPage = 500;

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page) => {
    try {
      const response = await fetch(`${API_URL}/api/reco_table?page=${page}&limit=${itemsPerPage}`);
      const jsonData = await response.json();
      setData(jsonData.detections || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching detection table data:', error);
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    const newSortOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newSortOrder);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  const filteredData = data.filter(record =>
    Object.values(record).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  if (loading) {
    return <div>Loading detection records...</div>;
  }

  return (
    <div>
      <h2>Detection Table</h2>
      <input
        type="text"
        placeholder="Filter results..."
        value={searchTerm}
        onChange={e => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
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
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((record, index) => (
            <tr key={index}>
              <td>{record.id}</td>
              <td>{record.person}</td>
              <td>{record.camera_name}</td>
              <td>{(record.det_score).toFixed(1)}%</td>
              <td>{record.distance}</td>
              <td>{new Date(record.timestamp).toLocaleString()}</td>
              <td>
                <img src={record.det_face} alt="Detected Face" width="50" height="50" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage}
        </span>
        <button onClick={handleNextPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default AnalysisTable;
