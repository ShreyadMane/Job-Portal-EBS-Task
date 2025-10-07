import React from 'react';
import { useAuth } from '../context/AuthContext';

const DebugInfo = () => {
    const { user, loading, error } = useAuth();
    
    return (
        <div style={{
            position: 'fixed',
            bottom: 10,
            right: 10,
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px',
            zIndex: 9999,
            maxWidth: '300px'
        }}>
            <div>User: {user ? user.username : 'null'}</div>
            <div>Role: {user ? user.role : 'null'}</div>
            <div>Loading: {loading ? 'true' : 'false'}</div>
            <div>Error: {error || 'null'}</div>
            <div>Token: {localStorage.getItem('token') ? 'exists' : 'null'}</div>
        </div>
    );
};

export default DebugInfo;