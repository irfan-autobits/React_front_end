// src/components/admin/UploadSingleImage.js
import React, { useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

const API_URL = process.env.REACT_APP_API_URL;

const UploadSingleImage = ({ subjectId, onUploadSuccess }) => {
  const fileInputRef = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/api/add_subject_img/${subjectId}`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log('Image added:', result);
      onUploadSuccess?.(); // Refresh the list
    } catch (err) {
      console.error('Error uploading image:', err);
    } finally {
      fileInputRef.current.value = ''; // Clear input
    }
  };

  return (
    <>
      <IconButton
        color="primary"
        size="small"
        onClick={() => fileInputRef.current.click()}
        title="Add new image"
      >
        <AddIcon />
      </IconButton>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </>
  );
};

export default UploadSingleImage;
