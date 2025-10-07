import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Dashboard from '../components/admin/Dashboard';
import RoleCreation from '../components/admin/RoleCreation';
import JobCreation from '../components/admin/JobCreation';
import JobDetails from '../components/admin/JobDetails';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const getActiveTab = () => {
        if (location.pathname.includes('role-creation')) return 'roleCreation';
        if (location.pathname.includes('job-creation')) return 'jobCreation';
        if (location.pathname.includes('job-details')) return 'jobDetails';
        return 'dashboard';
    };

    const activeTab = getActiveTab();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Debug logging
    React.useEffect(() => {
        console.log('AdminDashboard rendered, user:', user);
        console.log('Current path:', location.pathname);
    }, [user, location.pathname]);

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <h1>Admin Portal</h1>
                <div className="header-actions">
                    <span>Welcome, {user?.username || 'Admin'}</span>
                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                </div>
            </header>
            
            <nav className="admin-nav">
                <ul>
                    <li className={activeTab === 'dashboard' ? 'active' : ''}>
                        <Link to="/admin">Dashboard</Link>
                    </li>
                    <li className={activeTab === 'roleCreation' ? 'active' : ''}>
                        <Link to="/admin/role-creation">Role Creation</Link>
                    </li>
                    <li className={activeTab === 'jobCreation' ? 'active' : ''}>
                        <Link to="/admin/job-creation">Job Creation</Link>
                    </li>
                    <li className={activeTab === 'jobDetails' ? 'active' : ''}>
                        <Link to="/admin/job-details">Job Details</Link>
                    </li>
                </ul>
            </nav>

            <main className="admin-content">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="role-creation" element={<RoleCreation />} />
                    <Route path="job-creation" element={<JobCreation />} />
                    <Route path="job-details" element={<JobDetails />} />
                </Routes>
            </main>
        </div>
    );
};

export default AdminDashboard;