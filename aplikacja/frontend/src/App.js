import React, { useState, useEffect } from 'react';
import LoginRegister from './components/LoginRegister';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';

const API_URL = 'http://localhost:3000';

export default function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [token, setToken] = useState(null);
    const [theme, setTheme] = useState('light');
    const [user, setUser] = useState(null);
    const [view, setView] = useState('kanban'); // 'kanban' lub 'profile'
    const [isLoading, setIsLoading] = useState(false); // <--- nowy stan

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
            setLoggedIn(true);

            fetch(`${API_URL}/api/user`, {
                headers: { Authorization: `Bearer ${savedToken}` },
            })
                .then((res) => res.json())
                .then((userData) => {
                    if (userData.avatar && !userData.avatar.startsWith('http')) {
                        userData.avatar = `${API_URL}${userData.avatar}`;
                    }
                    setUser(userData);
                })
                .catch((err) => {
                    console.error('Błąd podczas pobierania użytkownika:', err);
                    handleLogout();
                });
        }

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) setTheme(savedTheme);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleLogin = async (passedToken = token, stayOnCurrentView = false) => {
        if (!passedToken) return;

        localStorage.setItem('token', passedToken);
        setToken(passedToken);
        setLoggedIn(true);

        const res = await fetch(`${API_URL}/api/user`, {
            headers: { Authorization: `Bearer ${passedToken}` }
        });

        const userData = await res.json();

        if (userData.avatar && !userData.avatar.startsWith('http')) {
            userData.avatar = `${API_URL}${userData.avatar}`;
        }

        setUser(userData);

        // Tylko jeśli nie chcemy zostać na obecnym widoku
        if (!stayOnCurrentView) {
            setView('kanban');
        }
    };

    const refreshUser = async () => {
        if (!token) return;
        const res = await fetch(`${API_URL}/api/user`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const userData = await res.json();
        if (userData.avatar && !userData.avatar.startsWith('http')) {
            userData.avatar = `${API_URL}${userData.avatar}`;
        }
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setLoggedIn(false);
        setUser(null);
        setView('kanban'); // wracamy do domyślnego widoku
    };

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };
    const handleNavigate = (newView) => {
        if (newView === view) return;
        setIsLoading(true);
        setTimeout(() => {
            setView(newView);
            setIsLoading(false);
        }, 400); // czas animacji ładowania
    };

    return (
        <>
            <Header
                isLoggedIn={loggedIn}
                onLogout={handleLogout}
                user={user}
                onNavigate={handleNavigate}
            />

            <main style={{minHeight: 'calc(100vh - 120px)', margin: '0 auto'}}>
                {isLoading ? (
                    <div className="loader-container">
                        <div className="spinner"/>
                    </div>
                ) : loggedIn ? (
                    <div className="fade-in-view">
                        <Dashboard
                            token={token}
                            view={view}
                            handleLogin={handleLogin}
                            user={user}          // <- dodane
                            setUser={setUser}    // <- dodane, jeśli chcesz mieć możliwość aktualizacji
                        />
                    </div>
                ) : (
                    <LoginRegister onLogin={handleLogin}/>
                )}
            </main>


            <Footer/>

            <button
                onClick={toggleTheme}
                style={{
                    position: 'fixed',
                    right: 20,
                    bottom: 20,
                    padding: '10px 15px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: theme === 'light' ? '#333' : '#ddd',
                    color: theme === 'light' ? '#fff' : '#333',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                    userSelect: 'none',
                }}
                aria-label="Toggle theme"
                title="Toggle theme"
            >
                {theme === 'light' ? '🌙' : '☀️'}
            </button>
        </>
    );
}
