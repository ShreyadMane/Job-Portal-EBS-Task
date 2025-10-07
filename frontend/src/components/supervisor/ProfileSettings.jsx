import React, { useState, useRef, useEffect } from 'react';
import './ProfileSettings.css';

const ProfileSettings = ({ user }) => {
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState({
        newPassword: false,
        confirmPassword: false
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showCropModal, setShowCropModal] = useState(false);
    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const savedImage = localStorage.getItem(`profileImage_${user?.username}`);
        if (savedImage) {
            setImagePreview(savedImage);
        }
    }, [user]);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showError('Passwords do not match');
            return;
        }
        
        setIsUpdating(true);
        
        setTimeout(() => {
            setIsUpdating(false);
            showSuccess('Password updated successfully!');
            setPasswordData({ newPassword: '', confirmPassword: '' });
        }, 1500);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showError('Image size should be less than 5MB');
                return;
            }

            if (!file.type.startsWith('image/')) {
                showError('Please select an image file');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
                setProfileImage(file);
                setShowCropModal(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropAndUpload = async () => {
        if (!profileImage || !canvasRef.current) return;

        setIsUploading(true);
        
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 200);

        try {
            const croppedImage = canvasRef.current.toDataURL('image/jpeg', 0.9);
            
            setTimeout(() => {
                localStorage.setItem(`profileImage_${user?.username}`, croppedImage);
                setImagePreview(croppedImage);
                setUploadProgress(100);
                
                setTimeout(() => {
                    setIsUploading(false);
                    setUploadProgress(0);
                    setShowCropModal(false);
                    showSuccess('Profile photo updated successfully!');
                }, 500);
            }, 2000);
        } catch (error) {
            console.error('Upload error:', error);
            showError('Failed to upload photo');
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const removePhoto = () => {
        setImagePreview(null);
        setProfileImage(null);
        localStorage.removeItem(`profileImage_${user?.username}`);
        showSuccess('Photo removed successfully!');
    };

    const showSuccess = (message) => {
        createNotification(message, 'success');
    };

    const showError = (message) => {
        createNotification(message, 'error');
    };

    const createNotification = (message, type) => {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleCrop = () => {
        if (canvasRef.current && imagePreview) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                canvas.width = 300;
                canvas.height = 300;
                
                const size = Math.min(img.width, img.height);
                const x = (img.width - size) / 2;
                const y = (img.height - size) / 2;
                
                ctx.drawImage(img, x, y, size, size, 0, 0, 300, 300);
            };
            
            img.src = imagePreview;
        }
    };

    return (
        <div className="profile-section">
            <div className="profile-header">
                <h2 className="section-title">Profile Settings</h2>
                <div className="header-decoration">
                    <i className="fas fa-user-cog"></i>
                </div>
            </div>
            
            <div className="profile-avatar-container">
                <div className="profile-avatar">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Profile" />
                    ) : (
                        <img 
                            src={`https://ui-avatars.com/api/?name=${user?.username}&background=6a5acd&color=fff&size=150&bold=true`} 
                            alt="Profile" 
                        />
                    )}
                    <div className="avatar-overlay">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                        />
                        <button 
                            className="camera-icon"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <div className="upload-spinner"></div>
                            ) : (
                                <i className="fas fa-camera"></i>
                            )}
                        </button>
                    </div>
                    <div className="avatar-ring"></div>
                    
                </div>
                
                <div className="profile-info">
                    <div className="profile-name">
                        {user?.username}
                        <span className="verified-badge">
                            <i className="fas fa-check-circle"></i>
                        </span>
                    </div>
                   
                    
                </div>

                {/* Photo Actions */}
                <div className="photo-actions">
                    <button 
                        className="photo-action-btn"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        <i className="fas fa-upload"></i>
                        Upload Photo
                    </button>
                    {imagePreview && (
                        <button 
                            className="photo-action-btn remove"
                            onClick={removePhoto}
                            disabled={isUploading}
                        >
                            <i className="fas fa-trash"></i>
                            Remove Photo
                        </button>
                    )}
                </div>
            </div>
            
            <div className="password-section">
                <div className="section-divider">
                    <div className="divider-line"></div>
                    <div className="divider-text">
                        <i className="fas fa-lock"></i>
                        Security Settings
                    </div>
                    <div className="divider-line"></div>
                </div>
                
                <form onSubmit={handlePasswordUpdate} className="password-form">
                    <div className="form-group">
                        <label htmlFor="newPassword" className="form-label">
                            <i className="fas fa-key"></i>
                            New Password
                        </label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword.newPassword ? "text" : "password"}
                                id="newPassword"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                className="password-input"
                                placeholder="Enter new password"
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => togglePasswordVisibility('newPassword')}
                            >
                                <i className={`fas fa-${showPassword.newPassword ? 'eye-slash' : 'eye'}`}></i>
                            </button>
                            <div className="input-strength-indicator">
                                <div className={`strength-bar ${passwordData.newPassword.length > 0 ? 'active' : ''}`}></div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                            <i className="fas fa-lock"></i>
                            Confirm Password
                        </label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword.confirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                className={`password-input ${passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword ? 'error' : ''}`}
                                placeholder="Confirm new password"
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => togglePasswordVisibility('confirmPassword')}
                            >
                                <i className={`fas fa-${showPassword.confirmPassword ? 'eye-slash' : 'eye'}`}></i>
                            </button>
                            {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                                <div className="error-message">
                                    <i className="fas fa-exclamation-triangle"></i>
                                    Passwords do not match
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        className={`update-password-btn ${isUpdating ? 'updating' : ''}`}
                        disabled={isUpdating || !passwordData.newPassword || !passwordData.confirmPassword}
                    >
                        {isUpdating ? (
                            <>
                                <div className="spinner"></div>
                                Updating...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-shield-alt"></i>
                                Update Password
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Image Crop Modal */}
            {showCropModal && (
                <div className="crop-modal-overlay" onClick={() => !isUploading && setShowCropModal(false)}>
                    <div className="crop-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="crop-modal-header">
                            <h3>Crop Profile Photo</h3>
                            <button 
                                className="close-btn"
                                onClick={() => setShowCropModal(false)}
                                disabled={isUploading}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <div className="crop-modal-body">
                            <div className="crop-container">
                                <canvas 
                                    ref={canvasRef}
                                    width={300}
                                    height={300}
                                    className="crop-canvas"
                                ></canvas>
                            </div>
                            
                            <div className="crop-instructions">
                                <i className="fas fa-info-circle"></i>
                                <span>Adjust your photo and click "Save" to update</span>
                            </div>
                        </div>
                        
                        <div className="crop-modal-footer">
                            <button 
                                className="btn btn-secondary"
                                onClick={() => setShowCropModal(false)}
                                disabled={isUploading}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn btn-primary"
                                onClick={handleCropAndUpload}
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <>
                                        <div className="spinner"></div>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save"></i>
                                        Save Photo
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileSettings;