import React, { useState, useEffect } from 'react';

export default function UserProfile({ user, token, refreshUser }) {
    if (!user) return <p>Loading user data...</p>;

    const [formData, setFormData] = useState({
        username: user.username,
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(user.avatar || '/default-avatar.png');

    useEffect(() => {
        setFormData({
            username: user.username,
            email: user.email,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
        });
        setAvatarPreview(user.avatar || '/default-avatar.png');
        setAvatarFile(null);
        setEditing(false);
    }, [user]);

    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const [editing, setEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file)); // pokaz podgląd
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setMessage('');
        setError('');

        try {
            const formPayload = new FormData();
            for (const key in formData) {
                formPayload.append(key, formData[key]);
            }
            if (avatarFile) {
                formPayload.append('avatar', avatarFile);
            }

            const res = await fetch('http://localhost:3000/api/user/update', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    // NIE ustawiamy Content-Type, gdyż fetch sam ustawi boundary dla multipart/form-data
                },
                body: formPayload
            });

            if (!res.ok) throw new Error(await res.text());

            setMessage('Data successfully updated!');
            setEditing(false);
            refreshUser && refreshUser();
        } catch (err) {
            setError(`Error during update: ${err.message}`);
        }
    };

    const handlePasswordUpdate = async () => {
        setMessage('');
        setError('');

        if (passwordData.new !== passwordData.confirm) {
            setError('New passwords are not compatible!');
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/api/user/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.current,
                    newPassword: passwordData.new
                })
            });

            if (!res.ok) throw new Error(await res.text());

            setMessage('The password has been changed.');
            setPasswordData({ current: '', new: '', confirm: '' });
        } catch (err) {
            setError(`Error while changing password: ${err.message}`);
        }
    };

    return (
        <div className="auth-box" style={{ margin: '40px auto', maxWidth: 500, textAlign: 'center' }}>
            <h2>User Profile</h2>
            <img
                src={avatarPreview}
                alt="Avatar"
                style={{ width: 100, borderRadius: '50%', marginBottom: 20 }}
            />

            {editing ? (
                <>
                    <div style={{marginBottom: 10, textAlign: 'left'}}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            id="avatarFileInput"
                            style={{display: 'none'}}
                        />
                        <button type="button" onClick={() => document.getElementById('avatarFileInput').click()}>
                            Choose avatar
                        </button>
                        <span style={{marginLeft: 10}}>
    {avatarFile ? avatarFile.name : 'No file chosen'}
  </span>
                    </div>

                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        style={{marginBottom: 10, width: '100%'}}
                    />
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        style={{marginBottom: 10, width: '100%'}}
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        style={{marginBottom: 10, width: '100%'}}
                    />
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        style={{marginBottom: 10, width: '100%'}}
                    />

                    <button onClick={handleSave} style={{marginRight: 10}}>Save</button>
                    <button onClick={() => setEditing(false)}>Cancel</button>
                </>
            ) : (
                <>
                    <p><strong>First Name:</strong> {user.firstName}</p>
                    <p><strong>Last Name:</strong> {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Username:</strong> {user.username}</p>
                    <button onClick={() => setEditing(true)}>Edit profile</button>
                </>
            )}

            <hr style={{margin: '30px 0'}}/>

            <h3>Change password</h3>
            <input
                type="password"
                name="current"
                value={passwordData.current}
                onChange={handlePasswordChange}
                placeholder="Current password"
                style={{ marginBottom: 10, width: '100%' }}
            />
            <input
                type="password"
                name="new"
                value={passwordData.new}
                onChange={handlePasswordChange}
                placeholder="New password"
                style={{ marginBottom: 10, width: '100%' }}
            />
            <input
                type="password"
                name="confirm"
                value={passwordData.confirm}
                onChange={handlePasswordChange}
                placeholder="Repeat the new password"
                style={{ marginBottom: 10, width: '100%' }}
            />
            <button onClick={handlePasswordUpdate}>Change password</button>

            {message && <div style={{ color: 'green', marginTop: 20 }}>{message}</div>}
            {error && <div style={{ color: 'red', marginTop: 20 }}>{error}</div>}
        </div>
    );
}
