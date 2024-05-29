// App.js
import React, { useState, useEffect } from 'react';
import LoginForm from './login';
import Homepage from './homepage';
import './App.css';

const App = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:5001/events');
            if (response.ok) {
                const eventData = await response.json();
                // Transforming the object into an array
                const eventsArray = Object.keys(eventData).map(key => {
                    return {
                        ...eventData[key],
                        id: key, // Adding the key as an id to the event object
                    };
                });
                setEvents(eventsArray); // Updating the events state with fetched data
                
            } else {
                setError(`Failed to fetch events with status: ${response.status}`);
            }
        } catch (error) {
            setError(`Error fetching events: ${error.message}`);
        }
    };

    useEffect(() => {
        console.log(events); // This will log whenever events is updated
    }, [events]);

    const handleLogin = (email) => {
        setLoggedInUser(email);
        fetchEvents();
    };

    return (
        <div>
            {loggedInUser ? (
                <Homepage email={loggedInUser} events={events} />
            ) : (
                <LoginForm onLogin={handleLogin} />
            )}
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default App;
