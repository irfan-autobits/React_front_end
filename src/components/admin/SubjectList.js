// src/components/admin/SubjectList.js
import React, { useState, useEffect } from 'react';
import './SubjectList.css';
import BasicButtons from "../ui/MuiButton";
import UploadSingleImage from './AddImg';
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
        console.log("Fetched subjects:", JSON.stringify(data.subjects, null, 2));

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

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await fetch(`${API_URL}/api/remove_subject_img/${imageId}`, {
        method: 'DELETE',
      });
      fetchSubjects(); // Refresh after deletion
    } catch (error) {
      console.error("Error deleting image:", error);
    }
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
            <th>Age</th>
            <th>Gender</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Aadhar</th>
            <th>Added Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedSubjects.map((sub, index) => (
            <tr key={index}>
              {/* Image cell */}
              <td>
                {sub.images && sub.images.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {sub.images.map((img) => (
                      <div key={img.id} style={{ position: "relative", width: "60px", height: "60px" }}>
                        <img src={img.url} alt="subject-img" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }} />
                        <button
                          onClick={() => handleDeleteImage(img.id)}
                          title="Remove Image"
                          style={{
                            position: "absolute",
                            top: "-6px",
                            right: "-6px",
                            background: "red",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span>No image</span>
                )}
                <UploadSingleImage subjectId={sub.id} onUploadSuccess={fetchSubjects} />
              </td>

              <td>{sub.subject_name || "N/A"}</td>
              <td>{sub.age || "N/A"}</td>
              <td>{sub.gender || "N/A"}</td>
              <td>{sub.email || "N/A"}</td>
              <td>{sub.phone || "N/A"}</td>
              <td>{sub.aadhar || "N/A"}</td>
              <td>{new Date(sub.added_date).toLocaleString()}</td>
              <td>
                <button onClick={() => handleRemove(sub.id)}>Remove</button>
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
