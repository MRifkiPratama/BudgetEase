import React, { useEffect, useState } from 'react';

function DataList() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/data`)
            .then((response) => response.json())
            .then((data) => setData(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const deleteData = (id) => {
        fetch(`${process.env.REACT_APP_API_URL}/data/${id}`, {
            method: 'DELETE',
        })
            .then(() => setData(data.filter(item => item.id !== id)))
            .catch(error => console.error('Error deleting data:', error));
    };

    return (
        <div className="data-list">
            <h2>Data List</h2>
            <ul>
                {data.map((item) => (
                    <li key={item.id}>
                        {item.name} 
                        <button onClick={() => deleteData(item.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DataList;