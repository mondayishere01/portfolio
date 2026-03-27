import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Save, Plus, Trash2, Award } from 'lucide-react';
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
                // Fetch the absolute latest user data from the server
                const { data } = await api.get('/users/me');
                if (data) {
                    setForm({
                        name: data.name || '',
                        email: data.email || '',
                        password: '', // intentionally empty
                        bio: data.bio || '',
                        imageUrl: data.imageUrl || '',
                        socialLinks: data.socialLinks || []
                    });
                }
            } catch (err) {
                console.error("Failed to fetch profile details:", err);
            } finally { setLoading(false); }
        };
        fetchMe();
    }, []);

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
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">My Profile</h2>
                <p className="text-xs text-slate-500 mt-1">Manage your identity and public-facing credentials</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Account & Credentials */}
                <div className="rounded-2xl border border-white/10 bg-[#111111] p-6 shadow-2xl">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                        <div className="p-2 rounded-lg bg-[#ffeb00]/10 text-[#ffeb00]">
                            <Save size={18} />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Account & Credentials</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Display Name</label>
                            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Username / Email</label>
                            <input type="text" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">New Password (leave blank to keep current)</label>
                            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••"
                                className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors font-mono" />
                        </div>
                    </div>
                </div>

                {/* Public Profile */}
                <div className="rounded-2xl border border-white/10 bg-[#111111] p-6 shadow-2xl">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                        <div className="p-2 rounded-lg bg-[#ffeb00]/10 text-[#ffeb00]">
                            <Award size={18} />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Public Profile</h3>
                    </div>

                    <div className="mb-8">
                        <FileUpload label="Profile Avatar" value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} folder="Profile" />
                        {form.imageUrl && (
                            <div className="mt-4 w-28 h-28 rounded-full overflow-hidden border-4 border-white/5 bg-black ml-1 shadow-2xl">
                                <img src={form.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    <div className="mb-8">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Short Bio</label>
                        <textarea rows={4} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Tell readers about yourself..."
                            className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors resize-y leading-relaxed" />
                    </div>

                    {/* Social Links */}
                    <div className="pt-4 border-t border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Social Connections</label>
                            <button type="button" onClick={addSocial} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#ffeb00] hover:text-[#ffdb00] transition">
                                <Plus size={14} /> Add Connection
                            </button>
                        </div>
                        <div className="space-y-3">
                            {form.socialLinks.map((link, idx) => (
                                <div key={idx} className="flex items-center gap-3 group">
                                    <input placeholder="Platform" value={link.platform} onChange={(e) => handleSocialChange(idx, 'platform', e.target.value)} required
                                        className="w-40 rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors" />
                                    <input placeholder="URL" type="url" value={link.url} onChange={(e) => handleSocialChange(idx, 'url', e.target.value)} required
                                        className="flex-1 rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors font-mono" />
                                    <button type="button" onClick={() => removeSocial(idx)} className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all opacity-40 group-hover:opacity-100">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            {form.socialLinks.length === 0 && (
                                <div className="p-6 rounded-xl border border-dashed border-white/5 text-center">
                                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">No social links configured.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex items-center justify-between gap-6">
                    {message.text && (
                        <div className={`text-xs font-bold uppercase tracking-wider ${message.type === 'success' ? 'text-[#ffeb00]' : 'text-red-400'}`}>
                            {message.text}
                        </div>
                    )}
                    <button type="submit" disabled={saving} className="ml-auto flex items-center justify-center gap-2 rounded-xl bg-[#ffeb00] px-10 py-5 text-sm font-bold text-slate-900 hover:bg-[#ffdb00] transition shadow-lg shadow-[#ffeb00]/10 disabled:opacity-50 uppercase tracking-widest">
                        <Save size={20} /> {saving ? 'Updating...' : 'Save Profile Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ManageProfile;
