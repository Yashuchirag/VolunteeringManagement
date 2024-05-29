import React, { useState, useRef } from 'react';
import "./login.css";

const LoginForm = ({ onLogin }) => {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("");

    const handleSignup = (event) => {
        event.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        if (email && password) {
            fetch('http://localhost:5001/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
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
                    emailRef.current.value = "";
                    passwordRef.current.value = "";
                    console.log(data.message);
                    setMessage(data.message);
                    setMessageColor('darkgreen');
                }
            })
            .catch(error => {
                console.error(error);
                setMessage('Error registering the user. Please try again.');
                setMessageColor('brown');
            });
        } else {
            setMessage("Email and/or password is missing.");
            setMessageColor('brown');
        }
        emailRef.current.value = "";
        passwordRef.current.value = "";
    };

    const handleLogin = (event) => {
        event.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        var status = 0;
        if (email && password) {
            fetch('http://localhost:5001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            .then(response => {
                status = response.status;
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                    setMessage(data.error);
                    setMessageColor('brown');
                }
                else {
                    emailRef.current.value = "";
                    passwordRef.current.value = "";
                    console.log(data.message);
                    setMessage(data.message);
                    setMessageColor('darkgreen');
                    if (status == 200){
                        onLogin(email);
                    }
                }
            })
            .catch(error => {
                console.error(error);
                setMessage('Error logging in the user. Please try again.');
                setMessageColor('brown');
            });
        } else {
            console.log("Email and/or password is missing.")
            setMessage("Email and/or password is missing.");
            setMessageColor('brown');
        }
        emailRef.current.value = "";
        passwordRef.current.value = "";
    };

    return (
        <div className='container'>
            <div className='header'>
                <div className='text'><b>Volunteer Management Platform</b></div>
                <div className='underline'></div>
            </div>
            {message && <div className='message' style={{ color: messageColor }}>{message}</div>}
            <div className='inputs'>
                <div className='input'>
                    <input type="email" placeholder="Email Id" ref={emailRef} />
                </div>
                <div className='input'>
                    <input type="password" placeholder="Password" ref={passwordRef} />
                </div>
            </div>
            <div className="submit-container">
                <div className="submit" onClick={handleSignup}>Sign up</div>
                <div className="submit" onClick={handleLogin}>Log in</div>
            </div>
        </div>
    );
}

export default LoginForm;
