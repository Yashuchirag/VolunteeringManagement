import React, {useState} from 'react';
import './homepage.css';

const Homepage = ({ email, events }) => {
    const user = email.split('@')[0];
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("");
    const [volunteerCount, setVolunteerCount] = useState(0);

    useEffect(() => {
        fetchVolunteerCount();
    }, []);

    const fetchVolunteerCount = () => {
        fetch('http://localhost:5001/volunteer-count') // Replace with your actual backend URL
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                } else {
                    setVolunteerCount(data.volunteerCount);
                }
            })
            .catch(error => {
                console.error('Error fetching volunteer count:', error);
            });
    };
    
    const handleRegister = (eventId) => {
        fetch('http://localhost:5001/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, eventId })
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data.error) {
                console.log(data.error);
                setMessage(data.error);
                setMessageColor('brown');
            }
            else {
                console.log(data.message);
                setMessage(data.message);
                setMessageColor('darkgreen');
            }
        })
        .catch(error => {
            console.error('Error registering user for event:', error);
            setMessage('Error registering user for event. Please try again.');
            setMessageColor('brown');
        });
    };

    return (
        <div className="homepage-container">
            <div className="heading">Volunteer Management Platform </div>
            <div className="title">Welcome, {user}! </div>
            <div className="subtitle"><b>Upcoming Events:</b>
                <div className='message' style={{ color: messageColor }}>{message}</div></div>
            <div className="event-cards">
                {events.map((event, index) => {
                    return (
                        <div className="event-card" key={index}>
                            <div className="event-name">{event.event_name}</div>
                            <div className="event-description">{event.event_description}</div>
                            <div className="event-date-time">{`${event.date} - ${event.time}`}
                            <div className="register-button" onClick={() => handleRegister(event.index)}>Register</div> </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Homepage;