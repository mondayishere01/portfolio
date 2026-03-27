import React, { useEffect, useState } from 'react';
import { getSettings, updateSettings } from '../../api';
import { Save, Mail, Info, Award } from 'lucide-react';

const ManageSettings = () => {
    const [notifyEmail, setNotifyEmail] = useState('');
    const [blogTitle, setBlogTitle] = useState('');
    const [blogSubtitle, setBlogSubtitle] = useState('');
    const [footerText, setFooterText] = useState('');
    const [copyrightText, setCopyrightText] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await getSettings();
                setNotifyEmail(data?.notifyEmail || '');
                setBlogTitle(data?.blogTitle || '');
                setBlogSubtitle(data?.blogSubtitle || '');
                setFooterText(data?.footerText || '');
                setCopyrightText(data?.copyrightText || '');
            } catch { /* ignore */ }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setStatus({ type: '', message: '' });
        try {
            await updateSettings({ notifyEmail, blogTitle, blogSubtitle, footerText, copyrightText });
            setStatus({ type: 'success', message: 'Settings saved successfully!' });
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to save settings' });
        } finally { setSaving(false); }
    };

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-8 w-48 rounded bg-slate-700/50" />
                <div className="h-20 w-full rounded bg-slate-700/50" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Project Settings</h2>
                <p className="text-xs text-slate-500 mt-1">Configure global site behavior and notification preferences</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-[#111111] p-6 rounded-2xl border border-white/10 shadow-2xl">
                {/* Email Notification */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#ffeb00]/10 text-[#ffeb00]">
                            <Mail size={18} />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Contact Notifications</h3>
                    </div>
                    <div className="pl-11 pr-4">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Notification Email</label>
                        <input
                            type="email"
                            value={notifyEmail}
                            onChange={e => setNotifyEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors"
                        />
                        <p className="text-[10px] text-slate-500 mt-2 font-medium">When a visitor submits the contact form, you'll receive an email at this address.</p>
                    </div>
                </div>

                {/* Blog Settings */}
                <div className="space-y-4 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#ffeb00]/10 text-[#ffeb00]">
                            <Info size={18} />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Blog Hub Configuration</h3>
                    </div>
                    <div className="pl-11 space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Hub Title</label>
                            <input
                                type="text"
                                value={blogTitle}
                                onChange={e => setBlogTitle(e.target.value)}
                                placeholder="Writings & Thoughts"
                                className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Hub Subtitle</label>
                            <textarea
                                value={blogSubtitle}
                                onChange={e => setBlogSubtitle(e.target.value)}
                                placeholder="Insights on software engineering..."
                                rows={3}
                                className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors resize-none leading-relaxed"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Configuration */}
                <div className="space-y-4 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#ffeb00]/10 text-[#ffeb00]">
                            <Award size={18} />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Interface Footer</h3>
                    </div>
                    <div className="pl-11 space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Footer Credits & Message</label>
                            <textarea
                                value={footerText}
                                onChange={e => setFooterText(e.target.value)}
                                placeholder="Designed in Figma and coded in VS Code..."
                                rows={2}
                                className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors resize-none leading-relaxed"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Copyright Identity</label>
                            <input
                                type="text"
                                value={copyrightText}
                                onChange={e => setCopyrightText(e.target.value)}
                                placeholder="Devesh. All rights reserved."
                                className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors font-bold"
                            />
                        </div>
                    </div>
                </div>

                {/* Info Alert */}
                <div className="flex items-start gap-4 p-5 rounded-xl bg-black border border-[#ffeb00]/10">
                    <Info size={20} className="text-[#ffeb00] mt-0.5 shrink-0" />
                    <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-white">System Infrastructure</p>
                        <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                            Email notifications require SMTP variables on your server:
                            <code className="mx-1 px-1.5 py-0.5 rounded bg-white/5 text-[#ffeb00] font-mono">SMTP_HOST</code>,
                            <code className="mx-1 px-1.5 py-0.5 rounded bg-white/5 text-[#ffeb00] font-mono">SMTP_PORT</code>,
                            <code className="mx-1 px-1.5 py-0.5 rounded bg-white/5 text-[#ffeb00] font-mono">SMTP_USER</code>,
                            <code className="mx-1 px-1.5 py-0.5 rounded bg-white/5 text-[#ffeb00] font-mono">SMTP_PASS</code>.
                        </p>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                    {status.message && (
                        <div className={`text-xs font-bold uppercase tracking-wider ${status.type === 'success' ? 'text-[#ffeb00]' : 'text-red-400'}`}>
                            {status.message}
                        </div>
                    )}
                    <button type="submit" disabled={saving}
                        className="ml-auto inline-flex items-center gap-2 rounded-xl bg-[#ffeb00] px-8 py-4 text-sm font-bold text-slate-900 hover:bg-[#ffdb00] transition shadow-lg shadow-[#ffeb00]/10 disabled:opacity-50 uppercase tracking-widest">
                        <Save size={18} />
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ManageSettings;
