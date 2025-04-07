import React, { useState } from 'react';

const AddSubjectForm = ({ onSubjectAdded }) => {
  const [subjectName, setSubjectName] = useState('');
  const [files, setFiles] = useState(null); // now storing FileList

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      alert("Please select at least one image");
      return;
    }
    const formData = new FormData();
    
    // Append each selected file. The backend will use request.files.getlist('file')
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }
    
    // Append subject name if provided.
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
      onSubjectAdded(); // trigger a refresh
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
        <label>Upload Image(s):</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(e.target.files)}
        />
      </div>
      <button type="submit">Add Subject(s)</button>
    </form>
  );
};

export default AddSubjectForm;
