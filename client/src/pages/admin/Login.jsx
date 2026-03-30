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

    const handleFocus = (e) => { e.currentTarget.style.borderColor = 'var(--interactive-base)'; };
    const handleBlur = (e) => { e.currentTarget.style.borderColor = 'var(--border-alpha-10)'; };

    return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--surface-base)' }}>
            <div className="w-full max-w-md space-y-10 rounded-3xl p-10 shadow-2xl relative overflow-hidden" style={{ border: '1px solid var(--border-alpha-10)', backgroundColor: 'var(--surface-card)' }}>
                {/* Accent Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-16 -mt-16" style={{ backgroundColor: 'var(--interactive-base-05)' }} />
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full blur-2xl -ml-12 -mb-12" style={{ backgroundColor: 'var(--interactive-base-05)' }} />

                <div className="text-center relative z-10">
                    <div className="inline-block p-4 rounded-2xl mb-6 shadow-xl" style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-alpha-05)' }}>
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center font-black text-2xl shadow-lg" style={{ backgroundColor: 'var(--interactive-base)', color: 'var(--content-primary-inv)', boxShadow: '0 10px 15px -3px var(--interactive-base-20)' }}>
                            P
                        </div>
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter" style={{ color: 'var(--content-primary)' }}>Terminal Command</h2>
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--content-tertiary)' }}>Secure Authentication Required</p>
                </div>

                <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--status-error-bg)', border: '1px solid var(--status-error-border)' }}>
                            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--status-error)' }}>{error}</p>
                        </div>
                    )}
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-widest mb-2 ml-1" style={{ color: 'var(--content-tertiary)' }}>Identity Vector</label>
                            <input type="text" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="username"
                                onFocus={handleFocus} onBlur={handleBlur}
                                className="w-full rounded-xl border px-5 py-4 focus:outline-none transition-all shadow-inner font-mono text-sm"
                                style={{ backgroundColor: 'var(--surface-base)', borderColor: 'var(--border-alpha-10)', color: 'var(--content-primary)' }} />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-widest mb-2 ml-1" style={{ color: 'var(--content-tertiary)' }}>Access Token</label>
                            <input type="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                                onFocus={handleFocus} onBlur={handleBlur}
                                className="w-full rounded-xl border px-5 py-4 focus:outline-none transition-all shadow-inner font-mono text-sm"
                                style={{ backgroundColor: 'var(--surface-base)', borderColor: 'var(--border-alpha-10)', color: 'var(--content-primary)' }} />
                        </div>
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full rounded-2xl py-5 text-sm font-black transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl disabled:opacity-50 uppercase tracking-[0.2em] mt-2"
                        style={{ backgroundColor: 'var(--interactive-base)', color: 'var(--content-primary-inv)', boxShadow: '0 20px 25px -5px var(--interactive-base-20)' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--interactive-hover)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--interactive-base)'}
                    >
                        {loading ? 'Decrypting...' : 'Initiate Session'}
                    </button>
                    <p className="text-center text-[9px] font-bold uppercase tracking-widest mt-8" style={{ color: 'var(--content-faint)' }}>
                        &copy; {new Date().getFullYear()} Portfolio Control Systems
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
