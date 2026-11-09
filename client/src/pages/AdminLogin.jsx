import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'admin') {
            localStorage.setItem('isAdmin', 'true');
            navigate('/admin');
        } else {
            alert('Invalid credentials! Use admin / admin');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm space-y-4">
                <div className="flex justify-center mb-2">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-full">
                        <Lock className="w-6 h-6" />
                    </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 text-center">Admin Login</h2>
                <p className="text-xs text-gray-500 text-center">Enter credentials to edit shop details.</p>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Username</label>
                    <input type="text" placeholder="admin"
                        value={username} onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                    <input type="password" placeholder="admin"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                    />
                </div>

                <button type="submit" className="w-full py-2.5 bg-amber-600 text-white font-semibold rounded-xl text-sm hover:bg-amber-700 transition-colors shadow-sm">
                    Login
                </button>

                <div className="text-center pt-2">
                    <Link to="/" className="text-xs text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Menu
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default AdminLogin;