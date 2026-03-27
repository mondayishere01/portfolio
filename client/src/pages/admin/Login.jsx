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
        <div className="min-h-screen flex items-center justify-center bg-black p-6">
            <div className="w-full max-w-md space-y-10 rounded-3xl border border-white/10 bg-[#111111] p-10 shadow-2xl relative overflow-hidden">
                {/* Accent Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffeb00]/5 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#ffeb00]/5 rounded-full blur-2xl -ml-12 -mb-12" />

                <div className="text-center relative z-10">
                    <div className="inline-block p-4 rounded-2xl bg-black border border-white/5 mb-6 shadow-xl">
                        <div className="w-12 h-12 rounded-lg bg-[#ffeb00] flex items-center justify-center text-slate-900 font-black text-2xl shadow-lg shadow-[#ffeb00]/20">
                            P
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Terminal Command</h2>
                    <p className="mt-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Secure Authentication Required</p>
                </div>

                <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-400/10 border border-red-400/20 rounded-xl p-4 text-center">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-red-400">{error}</p>
                        </div>
                    )}
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Identity Vector</label>
                            <input type="text" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="username"
                                className="w-full rounded-xl border border-white/10 bg-black px-5 py-4 text-white focus:border-[#ffeb00] focus:outline-none transition-all shadow-inner font-mono text-sm" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Access Token</label>
                            <input type="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                                className="w-full rounded-xl border border-white/10 bg-black px-5 py-4 text-white focus:border-[#ffeb00] focus:outline-none transition-all shadow-inner font-mono text-sm" />
                        </div>
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full rounded-2xl bg-[#ffeb00] py-5 text-sm font-black text-slate-900 hover:bg-[#ffdb00] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-[#ffeb00]/20 disabled:opacity-50 uppercase tracking-[0.2em] mt-2">
                        {loading ? 'Decrypting...' : 'Initiate Session'}
                    </button>
                    <p className="text-center text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-8">
                        &copy; {new Date().getFullYear()} Portfolio Control Systems
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
