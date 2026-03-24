import React, { useState, useEffect } from 'react';
import '../styles/LoginRegister.css';

export default function LoginRegister({ onLogin }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [form, setForm] = useState({});
    const [avatarFile, setAvatarFile] = useState(null);
    const [message, setMessage] = useState('');
    const [animating, setAnimating] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[\p{L}\s'-]+$/u;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setAvatarFile(e.target.files[0]);
    };

    const validateForm = () => {
        const { username, password, repeatPassword, firstName, lastName, email } = form;

        if (!username || !password || !repeatPassword || !firstName || !lastName || !email) {
            setMessage('All fields are required');
            return false;
        }

        if (!nameRegex.test(firstName)) {
            setMessage('First name must not contain numbers or special characters');
            return false;
        }

        if (!nameRegex.test(lastName)) {
            setMessage('Last name must not contain numbers or special characters');
            return false;
        }

        if (!emailRegex.test(email)) {
            setMessage('Invalid email format');
            return false;
        }

        if (password.length < 6) {
            setMessage('Password must be at least 6 characters');
            return false;
        }

        if (password !== repeatPassword) {
            setMessage("Passwords don't match");
            return false;
        }

        return true;
    };

    const register = async () => {
        if (!validateForm()) return;

        const formData = new FormData();
        for (let key in form) {
            formData.append(key, form[key]);
        }
        if (avatarFile) formData.append('avatar', avatarFile);

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                body: formData
            });
            const text = await res.text();
            setMessage(text);
        } catch (e) {
            setMessage('Registration failed');
        }
    };

    const login = async () => {
        if (!form.username || !form.password) {
            setMessage('Username and password are required');
            return;
        }

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: form.username,
                    password: form.password
                })
            });

            const data = await res.json();
            if (res.ok) {
                setMessage('Login successful');
                onLogin(data.token); // wywołaj funkcję rodzica z tokenem
            } else {
                setMessage(data.message || 'Login failed');
            }
        } catch (err) {
            console.error(err);
            setMessage('Login error');
        }
    };

    const switchMode = () => {
        setAnimating(true);
        setTimeout(() => {
            setIsRegistering(!isRegistering);
            setForm({});
            setAvatarFile(null);
            setMessage('');
            setAnimating(false);
        }, 300); // czas animacji musi zgadzać się z CSS fade
    };

    return (
        <div className="auth-container">
            <div className={`auth-box ${animating ? 'fade-out' : 'fade-in'}`}>
                <h2>{isRegistering ? 'Register' : 'Login'}</h2>

                {isRegistering && (
                    <>
                        <input name="firstName" placeholder="First Name" value={form.firstName || ''} onChange={handleChange} />
                        <input name="lastName" placeholder="Last Name" value={form.lastName || ''} onChange={handleChange} />
                        <input name="email" placeholder="Email" type="email" value={form.email || ''} onChange={handleChange} />
                    </>
                )}

                <input name="username" placeholder="Username" value={form.username || ''} onChange={handleChange} />
                <input name="password" placeholder="Password" type="password" value={form.password || ''} onChange={handleChange} />

                {isRegistering && (
                    <>
                        <input name="repeatPassword" placeholder="Repeat Password" type="password" value={form.repeatPassword || ''} onChange={handleChange} />
                        <div style={{ marginTop: 10, marginBottom: 15 }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                id="registerAvatarInput"
                                style={{ display: 'none' }}
                            />
                            <button
                                type="button"
                                onClick={() => document.getElementById('registerAvatarInput').click()}
                            >
                                Choose avatar
                            </button>
                            <span style={{ marginLeft: 10 }}>
    {avatarFile ? avatarFile.name : 'No file chosen'}
  </span>
                        </div>
                    </>
                )}

                <button onClick={isRegistering ? register : login}>
                    {isRegistering ? 'Register' : 'Login'}
                </button>

                <p className="switch-text">
                    {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                    <span onClick={animating ? null : switchMode} style={{ pointerEvents: animating ? 'none' : 'auto' }}>
                        {isRegistering ? ' Login' : ' Register'}
                    </span>
                </p>

                <p className="message">{message}</p>
            </div>
        </div>
    );
}