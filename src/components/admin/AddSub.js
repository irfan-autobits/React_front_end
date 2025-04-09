import React, { useState } from 'react';
const API_URL = process.env.REACT_APP_API_URL;

const AddSubjectForm = ({ onSubjectAdded }) => {
  const [subjectName, setSubjectName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [csv, setCsv] = useState(null);
  const [files, setFiles] = useState(null); // now storing FileList

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      alert("Please select at least one image");
      return;
    }
    
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }
    
    if (subjectName.trim() || age || gender || email || phone || aadhar) {
      // Single subject mode
      formData.append('subject_name', subjectName);
      formData.append('Age', age);
      formData.append('Gender', gender);
      formData.append('Email', email);
      formData.append('Phone', phone);
      formData.append('Aadhar', aadhar);
    } else if (csv) {
      // Bulk CSV mode
      formData.append('csv', csv);
    } else {
      alert("Please either fill the subject details or upload a CSV for bulk import.");
      return;
    }    
    
    try {
      const response = await fetch(`${API_URL}/api/add_sub`, {
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
        <label>Age</label>
        <input
          type="number"
          min="0"
          max="120"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter age"
        />
      </div>

      <div>
        <label>Gender</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@domain.com"
        />
      </div>

      <div>
        <label>Phone</label>
        <input
          type="tel"
          pattern="[0-9]{10}"
          maxLength="10"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="10-digit phone number"
        />
      </div>

      <div>
        <label>Aadhar</label>
        <input
          type="text"
          pattern="\d{12}"
          maxLength="12"
          value={aadhar}
          onChange={(e) => setAadhar(e.target.value)}
          placeholder="12-digit Aadhar number"
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
      <div>
        <label>Upload CSV (for bulk import):</label>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setCsv(e.target.files[0])}
        />
      </div>
      <button type="submit">Add Subject(s)</button>
    </form>
  );
};

export default AddSubjectForm;
