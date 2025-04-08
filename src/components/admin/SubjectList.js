// src/components/admin/SubjectList.js
import React, { useState, useEffect } from 'react';
import './SubjectList.css';
const API_URL = process.env.REACT_APP_API_URL;

const SubjectList = ({ refreshTrigger }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Change as desired

  const fetchSubjects = () => {
    fetch(`${API_URL}/api/subject_list`)
      .then(response => response.json())
      .then(data => {
        setSubjects(data.subjects || []);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching subjects:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSubjects();
  }, [refreshTrigger]);

  // Filter subjects based on search term
  const filteredSubjects = subjects.filter(sub =>
    sub.subject_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination details
  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubjects = filteredSubjects.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handleRemove = async (subjectId) => {
    try {
      // Call your backend delete endpoint
      const response = await fetch(`${API_URL}/api/remove_sub/${subjectId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      console.log("Subject removed:", result);
      fetchSubjects(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error removing subject:", error);
    }
  };

  if (loading) {
    return <div>Loading subjects...</div>;
  }

  return (
    <div className="subject-list-container">
      <h2>Subjects</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by subject name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
        />
      </div>      
      {filteredSubjects.length === 0 ? (
        <p>No subjects available.</p>
      ) : (
        <>
        <table className="subject-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Added Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSubjects.map((sub, index) => (
              <tr key={index}>
                <td>
                  {sub.images && sub.images.length > 0 ? (
                    <div
                    style={{
                      height: "70px",
                      width: "70px",
                      overflow: "hidden",
                      padding: "5px",
                      display: "flex",
                      marginBottom: "13px",justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "cover",
                      }}
                      className="subject-thumbnail"
                      src={sub.images[0]}
                      alt={sub.subject_name}
                        ></img>
                    </div>
                  ) : (
                    <span>No image</span>
                  )}
                </td>
                <td>{sub.subject_name}</td>
                {/* <td>{sub.added_date}</td> */}
                <td>{new Date(sub.added_date).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleRemove(sub.id)}>
                    Remove
                  </button>
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
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SubjectList;

// detection 2025-04-07 11:52:06.916796+00
// sub add - 2025-04-07 06:22:05.38864+00