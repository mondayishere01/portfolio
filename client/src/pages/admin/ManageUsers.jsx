import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, X } from 'lucide-react';

// Using local axios instance strictly configured for Users
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});
api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
});
api.interceptors.response.use((res) => res, (err) => {
    if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/admin/login';
    }
    return Promise.reject(err);
});

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'author' });

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(Array.isArray(data) ? data : []);
        } catch { /* ignore */ }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchUsers(); }, []);

    const openNew = () => { setForm({ name: '', email: '', password: '', role: 'author' }); setError(''); setShowModal(true); };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await api.post('/users', form);
            setShowModal(false);
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create user');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
        try {
            await api.delete(`/users/${id}`);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.error || 'Deletion failed');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white">Manage Users</h2>
                    <p className="text-xs text-slate-500 mt-1">Control administrative access and editor permissions</p>
                </div>
                <button onClick={openNew} className="flex items-center gap-2 rounded-lg bg-[#ffeb00] px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-[#ffdb00] transition shadow-lg shadow-[#ffeb00]/10">
                    <Plus size={18} /> Add New User
                </button>
            </div>

            {loading ? (
                <div className="animate-pulse space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-lg bg-slate-800/50" />)}
                </div>
            ) : (
                <div className="space-y-3">
                    {users.map((u) => (
                        <div key={u._id} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#111111] p-5 hover:border-[#ffeb00]/30 transition-all group">
                            <div className="flex items-center gap-5">
                                {u.imageUrl ? (
                                    <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-white/5 bg-black p-0.5 shadow-xl">
                                        <img src={u.imageUrl} alt={u.name} className="h-full w-full rounded-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="h-14 w-14 rounded-full bg-black border border-white/5 flex items-center justify-center text-[#ffeb00] font-black text-xl shadow-xl">
                                        {u.name?.charAt(0) || '?'}
                                    </div>
                                )}
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-white group-hover:text-[#ffeb00] transition-colors">{u.name}</h3>
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-[#ffeb00]/10 text-[#ffeb00] border-[#ffeb00]/20'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1 font-medium">{u.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {u.role !== 'admin' && (
                                    <button onClick={() => handleDelete(u._id)} className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-40 group-hover:opacity-100" title="Delete User">
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111111] p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Initialize New User</h3>
                            <button onClick={() => setShowModal(false)} className="rounded-full p-1 text-slate-500 hover:bg-white/5 hover:text-white transition"><X size={24} /></button>
                        </div>
                        {error && <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-6 bg-red-400/10 p-3 border border-red-400/20 rounded-lg text-center">{error}</p>}
                        <form onSubmit={handleSave} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Full Name</label>
                                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe"
                                    className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Username / Email</label>
                                <input type="text" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="e.g. dev_jane"
                                    className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Temporary Password</label>
                                <input required type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••"
                                    className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors font-mono" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Access Privileges</label>
                                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors">
                                    <option value="author">Author (Blogs Only)</option>
                                    <option value="admin">Admin (Full Access)</option>
                                </select>
                            </div>
                            <div className="flex gap-4 pt-4 border-t border-white/5">
                                <button type="submit" disabled={saving}
                                    className="flex-1 rounded-xl bg-[#ffeb00] py-4 text-sm font-bold text-slate-900 hover:bg-[#ffdb00] transition shadow-lg shadow-[#ffeb00]/10 disabled:opacity-50 uppercase tracking-widest">
                                    {saving ? 'Creating...' : 'Finalize User'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="px-6 rounded-xl border border-white/10 text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition uppercase tracking-widest">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
