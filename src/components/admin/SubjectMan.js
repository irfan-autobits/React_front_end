// src/components/admin/SubjectMan.js
import React, { useState } from 'react';
import AddSubjectForm from './AddSub';
import SubjectList from './SubjectList';
import './SubjectMan.css'; // Create CSS for overlay styles

const SubjectMan = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSubjectAdded = () => {
    // Close the modal and trigger a refresh of the subject list
    setModalVisible(false);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="subject-man-container">
      <button onClick={() => setModalVisible(true)}>Add Subject</button>
      
      {isModalVisible && (
        <div className="overlay">
          <div className="modal-content">
            <AddSubjectForm onSubjectAdded={handleSubjectAdded} />
            <button onClick={() => setModalVisible(false)}>Close</button>
          </div>
        </div>
      )}
      
      <SubjectList refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default SubjectMan;
