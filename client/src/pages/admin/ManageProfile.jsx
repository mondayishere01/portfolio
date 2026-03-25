import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Save, Plus, Trash2 } from 'lucide-react';
import FileUpload from '../../components/FileUpload';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
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

const ManageProfile = () => {
    const { user, loginUser } = useAuth(); // Need to re-trigger AuthContext if we update our name/image
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [form, setForm] = useState({
        name: '', email: '', password: '', bio: '', imageUrl: '', socialLinks: []
    });

    useEffect(() => {
        const fetchMe = async () => {
            try {
                // To fetch full user details, we can either hit a GET /me or extrapolate from token.
                // We'll just rely on the existing token user state as fallback, 
                // but let's query the specific user object if needed. 
                // Wait, we don't have a GET /me. We will use the user context for defaults!
                if (user) {
                    setForm({
                        name: user.name || '',
                        email: user.email || '',
                        password: '', // intentionally empty
                        bio: user.bio || '',
                        imageUrl: user.imageUrl || '',
                        socialLinks: user.socialLinks || []
                    });
                }
            } finally { setLoading(false); }
        };
        fetchMe();
    }, [user]);

    const handleSocialChange = (index, field, value) => {
        const newLinks = [...form.socialLinks];
        newLinks[index][field] = value;
        setForm({ ...form, socialLinks: newLinks });
    };

    const addSocial = () => {
        setForm({ ...form, socialLinks: [...form.socialLinks, { platform: '', url: '' }] });
    };

    const removeSocial = (index) => {
        setForm({ ...form, socialLinks: form.socialLinks.filter((_, i) => i !== index) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true); setMessage({ type: '', text: '' });

        try {
            const { data } = await api.put('/users/me', form);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            
            // Re-sync local storage context so the sidebar/navbar updates instantly
            loginUser(localStorage.getItem('token'), { ...user, ...data });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return null;

    return (
        <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-200 mb-6">My Profile</h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Account & Credentials */}
                <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-6">
                    <h3 className="text-lg font-semibold text-teal-400 border-b border-slate-700 pb-3 mb-5">Account & Credentials</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                            <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                                className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-teal-400 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
                            <input type="text" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                                className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-teal-400 focus:outline-none" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1">New Password (leave blank to keep current)</label>
                            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••"
                                className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-teal-400 focus:outline-none" />
                        </div>
                    </div>
                </div>

                {/* Public Profile */}
                <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-6">
                    <h3 className="text-lg font-semibold text-teal-400 border-b border-slate-700 pb-3 mb-5">Public Profile (Blog Footer)</h3>
                    
                    <div className="mb-6">
                        <FileUpload label="Profile Avatar" value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} folder="Profile" />
                        {form.imageUrl && <img src={form.imageUrl} alt="Avatar" className="mt-4 h-24 w-24 rounded-full object-cover border border-slate-600" />}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-300 mb-1">Short Bio</label>
                        <textarea rows={4} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} placeholder="Tell readers about yourself..."
                            className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-teal-400 focus:outline-none resize-y" />
                    </div>

                    {/* Social Links */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-slate-300">Social Links</label>
                            <button type="button" onClick={addSocial} className="flex items-center gap-1 rounded bg-teal-500/20 px-2 py-1 text-xs font-semibold text-teal-300 hover:bg-teal-500/30 transition">
                                <Plus size={12} /> Add Link
                            </button>
                        </div>
                        <div className="space-y-3">
                            {form.socialLinks.map((link, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <input placeholder="Platform (e.g. Twitter)" value={link.platform} onChange={(e) => handleSocialChange(idx, 'platform', e.target.value)} required
                                        className="w-1/3 rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-teal-400 focus:outline-none" />
                                    <input placeholder="URL" type="url" value={link.url} onChange={(e) => handleSocialChange(idx, 'url', e.target.value)} required
                                        className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-teal-400 focus:outline-none" />
                                    <button type="button" onClick={() => removeSocial(idx)} className="p-2 text-slate-500 hover:text-red-400 transition rounded hover:bg-red-500/10 shrink-0">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {form.socialLinks.length === 0 && <p className="text-xs text-slate-500 italic">No social links added.</p>}
                        </div>
                    </div>
                </div>

                {message.text && (
                    <div className={`p-4 rounded-md text-sm border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                        {message.text}
                    </div>
                )}

                <button type="submit" disabled={saving} className="flex w-full md:w-auto items-center justify-center gap-2 rounded-md bg-teal-500 px-8 py-3 font-semibold text-slate-900 hover:bg-teal-400 transition disabled:opacity-50">
                    <Save size={18} /> {saving ? 'Saving...' : 'Save Profile'}
                </button>
            </form>
        </div>
    );
};

export default ManageProfile;
