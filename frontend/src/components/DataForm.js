import React, { useState } from 'react';

function DataForm() {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_API_URL}/data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        })
            .then(response => response.json())
            .then(newData => {
                setName('');
                console.log('Data added:', newData);
            })
            .catch(error => console.error('Error adding data:', error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button type="submit">Add Data</button>
        </form>
    );
}

export default DataForm;