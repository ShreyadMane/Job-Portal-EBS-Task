import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import './RoleCreation.css';

const RoleCreation = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: ''
    });
    const [isCreating, setIsCreating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await userService.getAll();
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            showError('Failed to fetch users');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.username || !formData.password || !formData.role) {
            showError('Please fill all fields');
            return;
        }

        setIsCreating(true);
        
        try {
            await userService.create(formData);
            setFormData({ username: '', password: '', role: '' });
            setPasswordStrength(0);
            fetchUsers();
            showSuccess('User created successfully!');
        } catch (error) {
            console.error('Error creating user:', error);
            showError('Failed to create user');
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (userId, username) => {
        if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) {
            return;
        }

        setIsDeleting(userId);
        
        try {
            await userService.delete(userId);
            fetchUsers();
            showSuccess('User deleted successfully!');
        } catch (error) {
            console.error('Error deleting user:', error);
            showError('Failed to delete user');
        } finally {
            setIsDeleting(null);
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

    const calculatePasswordStrength = (password) => {
        if (!password) return 0;
        
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (password.length >= 12) strength += 25;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 12.5;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 12.5;
        
        return Math.min(strength, 100);
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setFormData({...formData, password});
        setPasswordStrength(calculatePasswordStrength(password));
    };

    const getRoleIcon = (role) => {
        return role === 'Admin' ? 'fa-user-shield' : 'fa-user-tie';
    };

    const getRoleColor = (role) => {
        return role === 'Admin' ? 'admin' : 'supervisor';
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength < 30) return 'weak';
        if (passwordStrength < 60) return 'medium';
        if (passwordStrength < 80) return 'strong';
        return 'very-strong';
    };

    return (
        <div className="role-creation">
            <div className="creation-header">
                <h2 className="section-title">
                    <i className="fas fa-users-cog"></i>
                    Role Creation
                </h2>
                <div className="header-decoration">
                    <i className="fas fa-plus-circle"></i>
                </div>
            </div>

            <div className="creation-container">
                <div className="form-section">
                    <div className="form-card">
                        <div className="form-header">
                            <h3>Create New User</h3>
                           
                        </div>
                        
                        <form onSubmit={handleSubmit} className="user-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="username" className="form-label">
                                        <i className="fas fa-user"></i>
                                        Username
                                    </label>
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            id="username"
                                            value={formData.username}
                                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                                            className="form-input"
                                            placeholder="Enter username"
                                            required
                                        />
                                        
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">
                                        <i className="fas fa-lock"></i>
                                        Password
                                    </label>
                                    <div className="password-wrapper">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            value={formData.password}
                                            onChange={handlePasswordChange}
                                            className="form-input"
                                            placeholder="Enter password"
                                            required
                                        />
                                        <div className="input-icon">
                                            <i className="fas fa-lock"></i>
                                        </div>
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                                        </button>
                                    </div>
                                    {formData.password && (
                                        <div className="password-strength">
                                            <div className="strength-bar">
                                                <div 
                                                    className={`strength-fill ${getPasswordStrengthColor()}`}
                                                    style={{ width: `${passwordStrength}%` }}
                                                ></div>
                                            </div>
                                            <span className="strength-text">
                                                Password strength: {getPasswordStrengthColor().replace('-', ' ')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="role" className="form-label">
                                    <i className="fas fa-user-tag"></i>
                                    Role
                                </label>
                                <div className="role-wrapper">
                                    <select
                                        id="role"
                                        value={formData.role}
                                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                                        className="role-select"
                                        required
                                    >
                                        <option value="">Select Role</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Supervisor">Supervisor</option>
                                        <option value="Floor attendant">Floor attendant</option>

                                    </select>
                                    <div className="role-icon">
                                        {formData.role && <i className={`fas ${getRoleIcon(formData.role)}`}></i>}
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                type="submit" 
                                className={`create-user-btn ${isCreating ? 'creating' : ''}`}
                                disabled={isCreating}
                            >
                                {isCreating ? (
                                    <>
                                        <div className="spinner"></div>
                                        Creating User...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-user-plus"></i>
                                        Create User
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="users-section">
                    <div className="users-card">
                        <div className="users-header">
                            <h3>Existing Users</h3>
                            <div className="users-count">
                                <span className="count">{users.length}</span>
                                <span className="label">Users</span>
                            </div>
                        </div>
                        
                        <div className="users-table-container">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>
                                            <i className="fas fa-user"></i>
                                            Username
                                        </th>
                                        <th>
                                            <i className="fas fa-user-tag"></i>
                                            Role
                                        </th>
                                        <th>
                                            <i className="fas fa-calendar"></i>
                                            Created
                                        </th>
                                        <th>
                                            <i className="fas fa-cogs"></i>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, index) => (
                                        <tr key={user._id} className="table-row" style={{animationDelay: `${index * 0.1}s`}}>
                                            <td>
                                                <div className="user-cell">
                                                    <div className="user-avatar">
                                                        <img 
                                                            src={`https://ui-avatars.com/api/?name=${user.username}&background=6a5acd&color=fff&size=40`} 
                                                            alt={user.username}
                                                        />
                                                    </div>
                                                    <span className="username">{user.username}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={`role-badge ${getRoleColor(user.role)}`}>
                                                    <i className={`fas ${getRoleIcon(user.role)}`}></i>
                                                    <span>{user.role}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="date-cell">
                                                    <i className="fas fa-clock"></i>
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="actions-cell">
                                                    <button 
                                                        className={`delete-btn ${isDeleting === user._id ? 'deleting' : ''}`}
                                                        onClick={() => handleDelete(user._id, user.username)}
                                                        disabled={isDeleting === user._id}
                                                        title="Delete user"
                                                    >
                                                        {isDeleting === user._id ? (
                                                            <div className="mini-spinner"></div>
                                                        ) : (
                                                            <i className="fas fa-trash"></i>
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            {users.length === 0 && (
                                <div className="empty-state">
                                    <i className="fas fa-users-slash"></i>
                                    <p>No users found</p>
                                    <span>Create your first user to get started</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleCreation;