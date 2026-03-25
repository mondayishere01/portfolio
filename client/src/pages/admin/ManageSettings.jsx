import React, { useEffect, useState } from 'react';
import { getSettings, updateSettings } from '../../api';
import { Save, Mail, Info } from 'lucide-react';

const ManageSettings = () => {
    const [notifyEmail, setNotifyEmail] = useState('');
    const [blogTitle, setBlogTitle] = useState('');
    const [blogSubtitle, setBlogSubtitle] = useState('');
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
            await updateSettings({ notifyEmail, blogTitle, blogSubtitle });
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
        <div>
            <h2 className="text-2xl font-bold text-slate-200 mb-6">Settings</h2>

            <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
                {/* Email Notification */}
                <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Mail size={18} className="text-teal-400" />
                        <h3 className="text-sm font-semibold text-slate-200">Contact Notifications</h3>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Notification Email</label>
                        <p className="text-xs text-slate-500 mb-2">
                            When a visitor submits the contact form, you'll receive an email at this address.
                        </p>
                        <input
                            type="email"
                            value={notifyEmail}
                            onChange={e => setNotifyEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full rounded-md border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-slate-200 focus:border-teal-400 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Blog Settings */}
                <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Info size={18} className="text-teal-400" />
                        <h3 className="text-sm font-semibold text-slate-200">Blog Settings</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Blog Page Title</label>
                            <input
                                type="text"
                                value={blogTitle}
                                onChange={e => setBlogTitle(e.target.value)}
                                placeholder="Writings & Thoughts"
                                className="w-full rounded-md border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-slate-200 focus:border-teal-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Blog Page Subtitle</label>
                            <textarea
                                value={blogSubtitle}
                                onChange={e => setBlogSubtitle(e.target.value)}
                                placeholder="Insights on software engineering..."
                                rows={2}
                                className="w-full rounded-md border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-slate-200 focus:border-teal-400 focus:outline-none resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* SMTP Info */}
                <div className="flex items-start gap-2 rounded-lg border border-slate-700/50 bg-slate-800/20 p-4">
                    <Info size={16} className="text-slate-500 mt-0.5 shrink-0" />
                    <div className="text-xs text-slate-500 leading-relaxed">
                        <p className="font-medium text-slate-400 mb-1">SMTP Configuration</p>
                        <p>
                            Email notifications require SMTP env variables on your server:
                            <code className="ml-1 text-teal-400/70">SMTP_HOST</code>,
                            <code className="ml-1 text-teal-400/70">SMTP_PORT</code>,
                            <code className="ml-1 text-teal-400/70">SMTP_USER</code>,
                            <code className="ml-1 text-teal-400/70">SMTP_PASS</code>.
                            Set these in your Render dashboard under Environment Variables.
                        </p>
                    </div>
                </div>

                {status.message && (
                    <p className={`text-sm ${status.type === 'success' ? 'text-teal-400' : 'text-red-400'}`}>
                        {status.message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-md bg-teal-500 px-6 py-2.5 text-sm font-semibold text-slate-900 hover:bg-teal-400 transition disabled:opacity-50"
                >
                    <Save size={16} />
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </form>
        </div>
    );
};

export default ManageSettings;
