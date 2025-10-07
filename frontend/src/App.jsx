import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import SupervisorPortal from './pages/SupervisorPortal';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/admin/*" element={
                            <PrivateRoute role="Admin">
                                <AdminDashboard />
                            </PrivateRoute>
                        } />
                        <Route path="/supervisor" element={
                            <PrivateRoute role="Supervisor">
                                <SupervisorPortal />
                            </PrivateRoute>
                        } />
                        <Route path="*" element={<Login />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;