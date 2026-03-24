import React, { useState, useEffect } from 'react';
import KanbanBoard from './KanbanBoard';
import UserProfile from './UserProfile';

export default function Dashboard({ token, view, handleLogin, user }) {
    return (
        <div style={{ padding: '10px', paddingTop: '80px' }}>
            {view === 'kanban' && <KanbanBoard />}
            {view === 'profile' && (
                <UserProfile
                    user={user}
                    token={token}
                    refreshUser={() => handleLogin(token, true)}
                />
            )}
        </div>
    );
}

