import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignIn.css'

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [notification, setNotification] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { email, password, role : 'user' };
        if (password === password2 ){
            try {
                await signIn(data);
            } catch (error) {
                console.error("Error during sign in", error);
            }
        }else{
            setNotification("password doesn't match");
        }
       
    };

    async function signIn(data) {
        try {
            const response = await axios.post('http://localhost:8000/api/signin', data);
            
            if (response.status === 201) {
                const { token } = response.data;
                localStorage.setItem('token', token);
                setNotification("successful registration");
                
                setTimeout(() => {
                    navigate('/');
                }, 3000);

            } else if (response.status === 400) {
                setNotification("User already exist");
            } else {
                setNotification("Something append.. oups");
            }

            setTimeout(() => {
            setNotification(null);
            }, 3000);

        } catch (error) {
            console.error(error);
            setNotification("Erreur réseau");
        }
    }


    return (
        <div>
            <div className="signIn-container">
                <form className="signIn-form" onSubmit={handleSubmit}>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password2}
                            onChange={e => setPassword2(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Sign In</button>
                </form>
            </div>
            {notification && notification === 'successful registration' ? 
                <div
                className="notification"
                style={{
                    position: "fixed",
                    bottom: "1.5%",
                    right: "0%",
                    transform: "translateX(-20%)",
                    zIndex: 1000,
                }}
                >
                    {notification}
                </div>:
                <div
                className="notification"
                style={{
                    position: "fixed",
                    bottom: "1.5%",
                    right: "0%",
                    transform: "translateX(-20%)",
                    zIndex: 1000,
                }}
                >
                    {notification}
                </div>
            }
        </div>
    );
}

export default SignIn;
