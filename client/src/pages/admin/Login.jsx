import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await login({ email, password });
            loginUser(res.data.token, res.data.user);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <div className="w-full max-w-md space-y-8 rounded-xl border border-slate-700 bg-slate-800/50 p-8 backdrop-blur">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-slate-200">Admin Login</h2>
                    <p className="mt-2 text-sm text-slate-400">Sign in to manage your portfolio</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Username</label>
                        <input type="text" id="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-md border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-200 focus:border-[#ffeb00] focus:outline-none focus:ring-1 focus:ring-[#ffeb00] transition" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                        <input type="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-md border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-200 focus:border-[#ffeb00] focus:outline-none focus:ring-1 focus:ring-[#ffeb00] transition" />
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full rounded-md bg-[#ffeb00] py-2.5 text-sm font-semibold text-slate-900 hover:bg-[#ffdb00] transition disabled:opacity-50">
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
