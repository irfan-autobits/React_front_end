// src/components/admin/AddSub.js
import React, { useState } from 'react';

const AddSubjectForm = ({ onSubjectAdded }) => {
  const [subjectName, setSubjectName] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select an image");
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    if (subjectName.trim()) {
      formData.append('subject_name', subjectName);
    }
    try {
      const response = await fetch('/api/add_sub', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log("Subject added:", result);
      onSubjectAdded(); // Notify parent to refresh list
    } catch (error) {
      console.error("Error adding subject:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Subject Name (optional):</label>
        <input
          type="text"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          placeholder="Enter subject name (or leave blank)"
        />
      </div>
      <div>
        <label>Upload Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>
      <button type="submit">Add Subject</button>
    </form>
  );
};

export default AddSubjectForm;
