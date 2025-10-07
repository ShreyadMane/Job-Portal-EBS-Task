import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);
    const { login, error, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const response = await login(username, password);
            
            if (response.user.role === 'Admin') {
                navigate('/admin', { replace: true });
            } else if (response.user.role === 'Supervisor') {
                navigate('/supervisor', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        } catch (err) {
            console.error('Login error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDemoLogin = (role) => {
        if (role === 'admin') {
            setUsername('admin');
            setPassword('admin123');
        } else if (role === 'supervisor') {
            setUsername('supervisor1');
            setPassword('sup123');
        }else {
            setUsername('floor1');
            setPassword('floor123');
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Loading amazing experience...</p>
            </div>
        );
    }

    return (
        <div className="login-container">
            
            <div className="bg-animation">
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                    <div className="shape shape-4"></div>
                    <div className="shape shape-5"></div>
                    <div className="shape shape-6"></div>
                </div>
            </div>

            <div className="login-content">
                <div className="welcome-section">
                    <div className="welcome-content">
                        <div className="logo-container">
                            <div className="logo">
                                <div className="logo-icon">
                                    <i className="fas fa-briefcase"></i>
                                </div>
                                <h1>JobMaster</h1>
                            </div>
                        </div>
                        
                        <div className="welcome-text">
                            <h2>Welcome to the Future of Job Management</h2>
                            <p>Streamline your workflow, track progress, and manage tasks with our powerful dashboard.</p>
                        </div>

                    </div>
                </div>

                <div className="login-form-section">
                    <div className="login-card">
                        <div className="login-header">
                            <div className="login-icon">
                                <i className="fas fa-user-circle"></i>
                            </div>
                            <h2>Welcome Back</h2>
                            <p>Sign in to continue to your dashboard</p>
                        </div>

                        <div className="demo-buttons">
                            <p className="demo-label">Quick Access:</p>
                            <div className="demo-btns">
                                <button 
                                    type="button" 
                                    className="demo-btn admin-btn"
                                    onClick={() => handleDemoLogin('admin')}
                                >
                                    <i className="fas fa-user-shield"></i>
                                    Admin Demo
                                </button>
                                <button 
                                    type="button" 
                                    className="demo-btn supervisor-btn"
                                    onClick={() => handleDemoLogin('supervisor')}
                                >
                                    <i className="fas fa-user-tie"></i>
                                    Supervisor Demo
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className={`input-group ${focusedInput === 'username' ? 'focused' : ''}`}>
                                <div className="input-wrapper">
                                    <i className="fas fa-user input-icon"></i>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        onFocus={() => setFocusedInput('username')}
                                        onBlur={() => setFocusedInput(null)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div className={`input-group ${focusedInput === 'password' ? 'focused' : ''}`}>
                                <div className="input-wrapper">
                                    <i className="fas fa-lock input-icon"></i>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-input"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setFocusedInput('password')}
                                        onBlur={() => setFocusedInput(null)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="error-message">
                                    <i className="fas fa-exclamation-circle"></i>
                                    {error}
                                </div>
                            )}

                            <div className="form-options">
                                <label className="checkbox-container">
                                    <input type="checkbox" />
                                    <span className="checkmark"></span>
                                    Remember me
                                </label>
                                <a href="#" className="forgot-password">Forgot password?</a>
                            </div>

                            <button 
                                type="submit" 
                                className={`login-btn ${isSubmitting ? 'submitting' : ''}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="btn-spinner"></div>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <i className="fas fa-arrow-right"></i>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="divider">
                            <span>OR</span>
                        </div>

                        <div className="social-login">
                            <button className="social-btn google-btn">
                                <i className="fab fa-google"></i>
                                Continue with Google
                            </button>
                            <button className="social-btn github-btn">
                                <i className="fab fa-github"></i>
                                Continue with GitHub
                            </button>
                        </div>

                        <div className="signup-link">
                            <p>Don't have an account? <a href="#">Sign up</a></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="login-footer">
                <p>&copy; 2025 ShreeyCorp. All rights reserved.</p>
                <div className="footer-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Contact Support</a>
                </div>
            </div>
        </div>
    );
};

export default Login;