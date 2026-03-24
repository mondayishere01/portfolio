import React, { useEffect, useState } from 'react';
import { getAbout, updateAbout } from '../../api';
import { Save, Plus, Trash2 } from 'lucide-react';
import FileUpload from '../../components/FileUpload';

const PLATFORMS = ['GitHub', 'LinkedIn', 'Twitter', 'Instagram', 'Email', 'Website'];

const ManageAbout = () => {
    const [bio, setBio] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [socialLinks, setSocialLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const res = await getAbout();
                setBio(res.data?.bio || '');
                setImageUrl(res.data?.imageUrl || '');
                setResumeUrl(res.data?.resumeUrl || '');
                setSocialLinks(res.data?.socialLinks || []);
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
            await updateAbout({ bio, imageUrl, resumeUrl, socialLinks });
            setStatus({ type: 'success', message: 'About section updated successfully!' });
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to update' });
        } finally { setSaving(false); }
    };

    const addSocialLink = () => {
        setSocialLinks([...socialLinks, { platform: 'GitHub', url: '' }]);
    };

    const updateSocialLink = (index, field, value) => {
        const updated = [...socialLinks];
        updated[index] = { ...updated[index], [field]: value };
        setSocialLinks(updated);
    };

    const removeSocialLink = (index) => {
        setSocialLinks(socialLinks.filter((_, i) => i !== index));
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
                    <p className="text-xs text-slate-500 mb-2">Use line breaks to separate paragraphs.</p>
                    <textarea
                        required rows={8} value={bio} onChange={e => setBio(e.target.value)}
                        placeholder="Write something about yourself..."
                        className="w-full rounded-md border border-slate-600 bg-slate-700/50 px-4 py-3 text-sm text-slate-200 focus:border-teal-400 focus:outline-none resize-y leading-relaxed"
                    />
                </div>
                {/* Profile Image */}
                <div>
                    <FileUpload
                        label="Profile Image"
                        value={imageUrl}
                        onChange={setImageUrl}
                    />
                    {imageUrl && (
                        <div className="mt-3">
                            <p className="text-xs text-slate-500 mb-1">Preview:</p>
                            <img src={imageUrl} alt="Preview" className="h-24 w-24 rounded-lg object-cover border border-slate-600" onError={(e) => { e.target.style.display = 'none'; }} />
                        </div>
                    )}
                </div>

                {/* Resume URL */}
                <div className="pt-2">
                    <p className="text-xs text-slate-500 mb-2">Upload your resume PDF. Visitors can download it directly from your site.</p>
                    <FileUpload
                        label="Resume PDF"
                        value={resumeUrl}
                        onChange={setResumeUrl}
                        accept="application/pdf"
                    />
                </div>

                {/* Social Links */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-slate-300">Social Links</label>
                        <button type="button" onClick={addSocialLink} className="flex items-center gap-1 text-xs font-medium text-teal-400 hover:text-teal-300 transition">
                            <Plus size={14} /> Add Link
                        </button>
                    </div>
                    {socialLinks.length === 0 ? (
                        <p className="text-xs text-slate-500">No social links added yet. Click "Add Link" to add one.</p>
                    ) : (
                        <div className="space-y-3">
                            {socialLinks.map((link, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <select
                                        value={link.platform}
                                        onChange={e => updateSocialLink(index, 'platform', e.target.value)}
                                        className="w-36 rounded-md border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-slate-200 focus:border-teal-400 focus:outline-none"
                                    >
                                        {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    <input
                                        value={link.url}
                                        onChange={e => updateSocialLink(index, 'url', e.target.value)}
                                        placeholder={link.platform === 'Email' ? 'your@email.com' : 'https://...'}
                                        className="flex-1 rounded-md border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-slate-200 focus:border-teal-400 focus:outline-none"
                                    />
                                    <button type="button" onClick={() => removeSocialLink(index)} className="text-slate-500 hover:text-red-400 transition p-1">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
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
