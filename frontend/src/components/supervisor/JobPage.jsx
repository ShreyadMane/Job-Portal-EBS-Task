import React, { useState, useEffect } from 'react';
import jobService from '../../services/jobService';
import './JobPage.css';

const JobPage = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [jobData, setJobData] = useState({
        defect: '',
        status: 'In Process'
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setIsSearching(true);
        try {
            const response = await jobService.getAll();
            setJobs(response.data);
            if (response.data.length > 0) {
                setSelectedJob(response.data[0]);
                setJobData({
                    defect: response.data[0].defect,
                    status: response.data[0].status
                });
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            showError('Failed to fetch jobs');
        } finally {
            setIsSearching(false);
        }
    };

    const handleJobSelect = (job) => {
        setSelectedJob(job);
        setJobData({
            defect: job.defect,
            status: job.status
        });
    };

    const handleUpdateJob = async () => {
        if (!selectedJob) return;
        
        setIsUpdating(true);
        
        try {
            await jobService.update(selectedJob._id, jobData);
            await fetchJobs();
            showSuccess('Job updated successfully!');
        } catch (error) {
            console.error('Error updating job:', error);
            showError('Failed to update job');
        } finally {
            setIsUpdating(false);
        }
    };

    const showSuccess = (message) => {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    };

    const showError = (message) => {
        const notification = document.createElement('div');
        notification.className = 'notification error';
        notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    };

    const getStatusIcon = (status) => {
        return status === 'Done' ? 'fa-check-circle' : 'fa-spinner fa-pulse';
    };

    const getStatusColor = (status) => {
        return status === 'Done' ? 'success' : 'warning';
    };

    return (
        <div className="job-section">
            <div className="job-header">
                <h2 className="section-title">
                    <i className="fas fa-tasks"></i>
                    Job Management
                </h2>
                <div className="header-decoration">
                    <i className="fas fa-cog"></i>
                </div>
            </div>
            
            <div className="job-form">
                <div className="form-group">
                    <label htmlFor="jobSelect" className="form-label">
                        <i className="fas fa-list"></i>
                        Select Job Card ID
                    </label>
                    <div className="select-wrapper">
                        <select 
                            id="jobSelect"
                            value={selectedJob?._id || ''} 
                            onChange={(e) => {
                                const job = jobs.find(j => j._id === e.target.value);
                                handleJobSelect(job);
                            }}
                            className="job-select"
                            disabled={isSearching}
                        >
                            <option value="">-- Select Job Card --</option>
                            {jobs.map(job => (
                                <option key={job._id} value={job._id}>
                                    {job.jobId} - {job.customer}
                                </option>
                            ))}
                        </select>
                        <div className="select-icon">
                            {isSearching ? (
                                <div className="mini-spinner"></div>
                            ) : (
                                <i className="fas fa-chevron-down"></i>
                            )}
                        </div>
                    </div>
                </div>
                
                {selectedJob && (
                    <div className="job-details">
                        <div className="job-info-grid">
                            <div className="info-card">
                                <div className="info-header">
                                    <i className="fas fa-building"></i>
                                    <span>Customer Name</span>
                                </div>
                                <div className="info-value">
                                    {selectedJob.customer}
                                </div>
                            </div>
                            
                            <div className="info-card">
                                <div className="info-header">
                                    <i className="fas fa-boxes"></i>
                                    <span>Quantity</span>
                                </div>
                                <div className="info-value quantity">
                                    {selectedJob.quantity}
                                    <span className="unit">units</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="defect" className="form-label">
                                <i className="fas fa-exclamation-triangle"></i>
                                Defect Description
                            </label>
                            <div className="textarea-wrapper">
                                <textarea
                                    id="defect"
                                    value={jobData.defect}
                                    onChange={(e) => setJobData({...jobData, defect: e.target.value})}
                                    className="defect-textarea"
                                    rows=""
                                    placeholder="Enter defect description..."
                                />
                                <div className="textarea-footer">
                                    <span className="char-count">{jobData.defect.length} characters</span>
                                    <div className="textarea-actions">
                                        <button type="button" className="action-btn" title="Clear">
                                            <i className="fas fa-eraser"></i>
                                        </button>
                                        <button type="button" className="action-btn" title="Copy">
                                            <i className="fas fa-copy"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="datetime-grid">
                            <div className="datetime-card">
                                <div className="datetime-header">
                                    <i className="fas fa-calendar-alt"></i>
                                    <span>Update Date</span>
                                </div>
                                <div className="datetime-value">
                                    {new Date().toLocaleDateString('en-US', { 
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                            
                            <div className="datetime-card">
                                <div className="datetime-header">
                                    <i className="fas fa-clock"></i>
                                    <span>Time</span>
                                </div>
                                <div className="datetime-value">
                                    {new Date().toLocaleTimeString('en-US', { 
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })}
                                </div>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="status" className="form-label">
                                <i className="fas fa-flag"></i>
                                Status
                            </label>
                            <div className="status-wrapper">
                                <select
                                    id="status"
                                    value={jobData.status}
                                    onChange={(e) => setJobData({...jobData, status: e.target.value})}
                                    className="status-select"
                                >
                                    <option value="In Process">In Process</option>
                                    <option value="Done">Done</option>
                                </select>
                                <div className={`status-badge ${getStatusColor(jobData.status)}`}>
                                    <i className={`fas ${getStatusIcon(jobData.status)}`}></i>
                                    <span>{jobData.status}</span>
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            className={`update-job-btn ${isUpdating ? 'updating' : ''}`}
                            onClick={handleUpdateJob}
                            disabled={isUpdating}
                        >
                            {isUpdating ? (
                                <>
                                    <div className="spinner"></div>
                                    Updating Job...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save"></i>
                                    Update Job
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobPage;