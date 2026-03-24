import React, { useEffect, useState } from 'react';
import { getAbout, updateAbout } from '../../api';
import { Save } from 'lucide-react';

const ManageAbout = () => {
    const [bio, setBio] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const res = await getAbout();
                setBio(res.data?.bio || '');
                setImageUrl(res.data?.imageUrl || '');
            } catch { /* ignore */ }
            finally { setLoading(false); }
        };
        fetchAbout();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setStatus({ type: '', message: '' });
        try {
            await updateAbout({ bio, imageUrl });
            setStatus({ type: 'success', message: 'About section updated successfully!' });
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to update' });
        } finally { setSaving(false); }
    };

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-8 w-48 rounded bg-slate-700/50" />
                <div className="h-40 w-full rounded bg-slate-700/50" />
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-200 mb-6">Manage About Section</h2>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Bio Text *</label>
                    <p className="text-xs text-slate-500 mb-2">Use line breaks to separate paragraphs. This text appears in the "About" section of your portfolio.</p>
                    <textarea
                        required rows={8} value={bio} onChange={e => setBio(e.target.value)}
                        placeholder="Write something about yourself..."
                        className="w-full rounded-md border border-slate-600 bg-slate-700/50 px-4 py-3 text-sm text-slate-200 focus:border-teal-400 focus:outline-none resize-y leading-relaxed"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Profile Image URL</label>
                    <input
                        value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                        placeholder="https://example.com/your-photo.jpg"
                        className="w-full rounded-md border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-slate-200 focus:border-teal-400 focus:outline-none"
                    />
                    {imageUrl && (
                        <div className="mt-3">
                            <p className="text-xs text-slate-500 mb-1">Preview:</p>
                            <img src={imageUrl} alt="Preview" className="h-24 w-24 rounded-lg object-cover border border-slate-600" onError={(e) => { e.target.style.display = 'none'; }} />
                        </div>
                    )}
                </div>

                {status.message && (
                    <p className={`text-sm ${status.type === 'success' ? 'text-teal-400' : 'text-red-400'}`}>
                        {status.message}
                    </p>
                )}

                <button type="submit" disabled={saving}
                    className="inline-flex items-center gap-2 rounded-md bg-teal-500 px-6 py-2.5 text-sm font-semibold text-slate-900 hover:bg-teal-400 transition disabled:opacity-50">
                    <Save size={16} />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default ManageAbout;
