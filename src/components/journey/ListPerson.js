import React, { useState, useEffect } from 'react';
const API_URL = process.env.REACT_APP_API_URL;

const PersonSelector = ({ onSelectPerson }) => {
    const [people, setPeople] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/api/subject_list`)
            .then(response => response.json())
            .then(data => {
                console.log("Fetched people:", data); // Log API response
                setPeople(data.subjects.map(person => person.subject_name) || []); 
            })
            .catch(error => {
                console.error("Error fetching known people:", error);
                setPeople([]);
            });
    }, []);
    

    return (
        <select onChange={(e) => onSelectPerson(e.target.value)}>
            <option value="">Select a Person</option>
            {people.map((person, index) => (
                <option key={index} value={person}>{person}</option>
            ))}
        </select>
    );
};

export default PersonSelector;