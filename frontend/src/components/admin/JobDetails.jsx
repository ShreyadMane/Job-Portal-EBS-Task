import React, { useState, useEffect } from 'react';
import jobService from '../../services/jobService';
import './JobDetails.css';

const JobDetails = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await jobService.getAll();
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    return (
        <div className="job-details">
            <div className="table-container">
                <div className="table-header">Job Details</div>
                <table>
                    <thead>
                        <tr>
                            <th>JOB ID</th>
                            <th>CUSTOMER</th>
                            <th>QUANTITY</th>
                            <th>DEFECT</th>
                            <th>DATE</th>
                            <th>TIME</th>
                            <th>STATUS</th>
                            <th>SUPERVISOR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(job => (
                            <tr key={job._id}>
                                <td>{job.jobId}</td>
                                <td>{job.customer}</td>
                                <td>{job.quantity}</td>
                                <td>{job.defect}</td>
                                <td>{new Date(job.date).toLocaleDateString()}</td>
                                <td>{job.time}</td>
                                <td>
                                    <span className={`status-badge ${job.status === 'Done' ? 'status-done' : 'status-process'}`}>
                                        {job.status}
                                    </span>
                                </td>
                                <td>{job.supervisor}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default JobDetails;