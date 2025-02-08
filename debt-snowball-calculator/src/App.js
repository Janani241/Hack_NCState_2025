import React from 'react';
import { useEffect, useState } from "react";

function App() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("http://localhost:5001/")
            .then(res => res.text())
            .then(data => setMessage(data));
    }, []);

    return (
        <div>
            <h1>Debt Snowball Calculator</h1>
            <p>{message}</p>
        </div>
    );
}

export default App;
