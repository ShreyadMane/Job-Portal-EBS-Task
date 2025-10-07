import React, { useState, useEffect } from 'react';
import jobService from '../../services/jobService';
import userService from '../../services/userService';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalJobs: 0,
        inProcess: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [usersResponse, jobsResponse] = await Promise.all([
                userService.getAll(),
                jobService.getAll()
            ]);
            
            const jobs = jobsResponse.data;
            setStats({
                totalUsers: usersResponse.data.length,
                totalJobs: jobs.length,
                inProcess: jobs.filter(job => job.status === 'In Process').length
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    return (
        <div className="dashboard">
            <div className="stats-container">
                <div className="stat-card">
                    <div className="stat-icon users">
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalUsers}</h3>
                        <p>Total Users</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon jobs">
                        <i className="fas fa-box"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalJobs}</h3>
                        <p>Total Jobs</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon process">
                        <i className="fas fa-file"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats.inProcess}</h3>
                        <p>In Process</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;