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
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-200">Manage Users</h2>
                <button onClick={openNew} className="flex items-center gap-1.5 rounded-md bg-teal-500/20 px-3 py-2 text-sm font-medium text-teal-300 hover:bg-teal-500/30 transition">
                    <Plus size={16} /> Add User
                </button>
            </div>

            {loading ? (
                <div className="animate-pulse space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-lg bg-slate-800/50" />)}
                </div>
            ) : (
                <div className="space-y-3">
                    {users.map((u) => (
                        <div key={u._id} className="flex items-center justify-between gap-4 rounded-lg border border-slate-700 bg-slate-800/30 p-4">
                            <div className="flex items-center gap-4">
                                {u.imageUrl ? (
                                    <img src={u.imageUrl} alt={u.name} className="h-12 w-12 rounded-full object-cover border border-slate-600" />
                                ) : (
                                    <div className="h-12 w-12 rounded-full bg-slate-700 flex items-center justify-center text-teal-400 font-bold text-lg">
                                        {u.name?.charAt(0) || '?'}
                                    </div>
                                )}
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-slate-200">{u.name}</h3>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                            u.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-teal-500/20 text-teal-300'
                                        }`}>
                                            {u.role}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-400 mt-0.5">{u.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {u.role !== 'admin' && (
                                    <button onClick={() => handleDelete(u._id)} className="text-slate-500 hover:text-red-400 transition ml-2">
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-200">Add New User</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-200"><X size={20} /></button>
                        </div>
                        {error && <p className="text-xs text-red-400 mb-4">{error}</p>}
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Jane Doe"
                                    className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-teal-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
                                <input type="text" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="e.g. dev_jane"
                                    className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-teal-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Temporary Password</label>
                                <input required value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Secret123!"
                                    className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-teal-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-teal-500 focus:outline-none">
                                    <option value="author">Author (Blogs Only)</option>
                                    <option value="admin">Admin (Full Access)</option>
                                </select>
                            </div>
                            <button type="submit" disabled={saving}
                                className="w-full rounded-md bg-teal-500 py-2 mt-2 text-sm font-semibold text-slate-900 hover:bg-teal-400 transition disabled:opacity-50">
                                {saving ? 'Creating...' : 'Create User'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
