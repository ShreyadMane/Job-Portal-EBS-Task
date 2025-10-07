import React, { useState, useEffect } from 'react';
import jobService from '../../services/jobService';
import './JobCreation.css';

const JobCreation = () => {
    const [formData, setFormData] = useState({
        jobId: '',
        customer: '',
        quantity: ''
    });
    const [existingJobs, setExistingJobs] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setIsSearching(true);
        try {
            const response = await jobService.getAll();
            setExistingJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            showError('Failed to fetch jobs');
        } finally {
            setIsSearching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.jobId || !formData.customer || !formData.quantity) {
            showError('Please fill all fields');
            return;
        }

        setIsCreating(true);
        
        try {
            const jobData = {
                ...formData,
                quantity: parseInt(formData.quantity),
                date: new Date(),
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            };
            await jobService.create(jobData);
            setFormData({ jobId: '', customer: '', quantity: '' });
            fetchJobs();
            showSuccess('Job created successfully!');
        } catch (error) {
            console.error('Error creating job:', error);
            showError('Failed to create job');
        } finally {
            setIsCreating(false);
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
        return status === 'Done' ? 'fa-check-circle' : 'fa-clock';
    };

    const getStatusColor = (status) => {
        return status === 'Done' ? 'success' : 'warning';
    };

    const generateJobId = () => {
        const prefix = 'JBC';
        const number = Math.floor(Math.random() * 900) + 100;
        setFormData({...formData, jobId: `${prefix}${number}`});
    };

    return (
        <div className="job-creation">
            <div className="creation-header">
                <h2 className="section-title">
                    <i className="fas fa-plus-circle"></i>
                    Job Creation
                </h2>
                <div className="header-decoration">
                    <i className="fas fa-briefcase"></i>
                </div>
            </div>

            <div className="creation-container">
                <div className="form-section">
                    <div className="form-card">
                        <div className="form-header">
                            <h3>Create New Job</h3>
                            <div className="form-icon">
                                <i className="fas fa-file-plus"></i>
                            </div>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="job-form">
                            <div className="form-group">
                                <label htmlFor="jobId" className="form-label">
                                    <i className="fas fa-hashtag"></i>
                                    Job Card ID
                                </label>
                                <div className="input-with-action">
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            id="jobId"
                                            value={formData.jobId}
                                            onChange={(e) => setFormData({...formData, jobId: e.target.value})}
                                            className="form-input"
                                            placeholder="Enter Job Card ID"
                                            required
                                        />
                                        <div className="input-icon">
                                            <i className="fas fa-tag"></i>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="generate-btn"
                                        onClick={generateJobId}
                                        title="Generate ID"
                                    >
                                        <i className="fas fa-magic"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="customer" className="form-label">
                                    <i className="fas fa-building"></i>
                                    Customer Name
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        id="customer"
                                        value={formData.customer}
                                        onChange={(e) => setFormData({...formData, customer: e.target.value})}
                                        className="form-input"
                                        placeholder="Enter customer name"
                                        required
                                    />
                                    <div className="input-icon">
                                        <i className="fas fa-user-tie"></i>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="quantity" className="form-label">
                                    <i className="fas fa-boxes"></i>
                                    Job Card Quantity
                                </label>
                                <div className="quantity-wrapper">
                                    <div className="input-wrapper">
                                        <input
                                            type="number"
                                            id="quantity"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                                            className="form-input"
                                            placeholder="Enter quantity"
                                            min="1"
                                            required
                                        />
                                        <div className="input-icon">
                                            <i className="fas fa-cubes"></i>
                                        </div>
                                    </div>
                                    <div className="quantity-controls">
                                        <button
                                            type="button"
                                            className="quantity-btn"
                                            onClick={() => setFormData({...formData, quantity: Math.max(1, parseInt(formData.quantity) - 1)})}
                                        >
                                            <i className="fas fa-minus"></i>
                                        </button>
                                        <button
                                            type="button"
                                            className="quantity-btn"
                                            onClick={() => setFormData({...formData, quantity: parseInt(formData.quantity) + 1 || 1})}
                                        >
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                {formData.quantity && (
                                    <div className="quantity-preview">
                                        <span className="preview-text">
                                            {formData.quantity} {formData.quantity == 1 ? 'unit' : 'units'}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            <button 
                                type="submit" 
                                className={`create-job-btn ${isCreating ? 'creating' : ''}`}
                                disabled={isCreating}
                            >
                                {isCreating ? (
                                    <>
                                        <div className="spinner"></div>
                                        Creating Job...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-plus-circle"></i>
                                        Create Job
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="jobs-section">
                    <div className="jobs-card">
                        <div className="jobs-header">
                            <h3>Existing Jobs</h3>
                            <div className="jobs-count">
                                <span className="count">{existingJobs.length}</span>
                                <span className="label">Jobs</span>
                            </div>
                        </div>
                        
                        <div className="jobs-table-container">
                            <table className="jobs-table">
                                <thead>
                                    <tr>
                                        <th>
                                            <i className="fas fa-hashtag"></i>
                                            Job ID
                                        </th>
                                        <th>
                                            <i className="fas fa-building"></i>
                                            Customer
                                        </th>
                                        <th>
                                            <i className="fas fa-boxes"></i>
                                            Quantity
                                        </th>
                                        <th>
                                            <i className="fas fa-flag"></i>
                                            Status
                                        </th>
                                        <th>
                                            <i className="fas fa-calendar"></i>
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {existingJobs.map((job, index) => (
                                        <tr key={job._id} className="table-row" style={{animationDelay: `${index * 0.1}s`}}>
                                            <td>
                                                <div className="job-id-cell">
                                                    <span className="job-id">{job.jobId}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="customer-cell">
                                                    <i className="fas fa-store"></i>
                                                    <span>{job.customer}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="quantity-cell">
                                                    <span className="quantity">{job.quantity}</span>
                                                    <span className="unit">units</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={`status-badge ${getStatusColor(job.status)}`}>
                                                    <i className={`fas ${getStatusIcon(job.status)}`}></i>
                                                    <span>{job.status}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="date-cell">
                                                    <i className="fas fa-clock"></i>
                                                    {new Date(job.date).toLocaleDateString()}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            {existingJobs.length === 0 && (
                                <div className="empty-state">
                                    <i className="fas fa-inbox"></i>
                                    <p>No jobs found</p>
                                    <span>Create your first job to get started</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobCreation;