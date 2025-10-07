import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileSettings from '../components/supervisor/ProfileSettings';
import JobPage from '../components/supervisor/JobPage';
import './SupervisorPortal.css';

const SupervisorPortal = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Debug logging
    useEffect(() => {
        console.log('SupervisorPortal rendered, user:', user);
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="supervisor-portal">
            <header className="supervisor-header">
                <h1>Supervisor Portal</h1>
                <div className="header-actions">
                    <span>Welcome, {user?.username || 'Supervisor'}</span>
                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                </div>
            </header>
            
            <div className="supervisor-content">
                <ProfileSettings user={user} />
                <JobPage />
            </div>
        </div>
    );
};

export default SupervisorPortal;