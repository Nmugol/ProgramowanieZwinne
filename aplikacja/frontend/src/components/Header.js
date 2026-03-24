import React, { useState } from 'react';
import '../styles/Header.css';

const API_URL = 'http://localhost:3000';

const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return `${API_URL}/uploads/default-avatar.png`;
    if (avatarPath.startsWith('http')) return avatarPath;
    return `${API_URL}${avatarPath.startsWith('/') ? '' : '/'}${avatarPath}`;
};

export default function Header({ isLoggedIn, onLogout, user, onNavigate }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const goHome = () => {
        onNavigate('kanban');
    };

    const openProfile = () => {
        onNavigate('profile');
        setMenuOpen(false);
    };

    return (
        <header className="header">
            <h1 style={{ cursor: 'pointer' }} onClick={goHome}>
                Kanban Application
            </h1>

            {isLoggedIn && user && (
                <div className="user-area">
                    <button className="home-btn" onClick={goHome} title="Strona główna">
                        🏠 Home
                    </button>

                    {/*<div className="user-info">*/}
                    {/*    <img*/}
                    {/*        src={getAvatarUrl(user.avatar)}*/}
                    {/*        alt="Avatar"*/}
                    {/*        className="avatar"*/}
                    {/*    />*/}
                    {/*    <span className="username">{user.username}</span>*/}
                    {/*</div>*/}

                    <div className="settings">
                        <button className="gear-btn" onClick={toggleMenu}>
                            ⚙️ Settings
                        </button>

                        {menuOpen && (
                            <div className="dropdown-menu">
                                <div className="user-summary">
                                    <img
                                        src={getAvatarUrl(user.avatar)}
                                        alt="Avatar"
                                        className="avatar small"
                                    />
                                    <span>{user.username}</span>
                                </div>

                                <button onClick={openProfile}>
                                    User Profile
                                </button>
                                <hr/>
                                <button onClick={onLogout}>
                                    Logout
                                </button>

                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
