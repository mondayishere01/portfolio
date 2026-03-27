import React, { useEffect, useState } from "react";
import { getAbout, updateAbout } from "../../api";
import { Save, Plus, Trash2 } from "lucide-react";
import FileUpload from "../../components/FileUpload";

const PLATFORMS = ['GitHub', 'LinkedIn', 'Twitter', 'Instagram', 'Email', 'Phone', 'Website'];

const ManageAbout = () => {
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [tagline, setTagline] = useState('');
    const [bio, setBio] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [socialLinks, setSocialLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const res = await getAbout();
                setName(res.data?.name || '');
                setTitle(res.data?.title || '');
                setTagline(res.data?.tagline || '');
                setBio(res.data?.bio || '');
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
            await updateAbout({ name, title, tagline, bio, resumeUrl, socialLinks });
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
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ffeb00]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Manage About Section</h2>
                <p className="text-xs text-slate-500 mt-1">Tell your story and manage your professional presence</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-[#111111] p-6 rounded-2xl border border-white/10 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Display Name</label>
                        <input
                            type="text" value={name} onChange={e => setName(e.target.value)}
                            placeholder="e.g. Devesh Pandey"
                            className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Professional Title</label>
                        <input
                            type="text" value={title} onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. Full Stack Developer"
                            className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Tagline</label>
                    <input
                        type="text" value={tagline} onChange={e => setTagline(e.target.value)}
                        placeholder="I build accessible, performant web apps."
                        className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Bio Text *</label>
                    <textarea
                        required rows={8} value={bio} onChange={e => setBio(e.target.value)}
                        placeholder="Write something about yourself..."
                        className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none resize-y leading-relaxed"
                    />
                    <p className="text-[10px] text-slate-500 mt-2 font-medium">Character count: {bio.length}</p>
                </div>

                {/* Resume URL */}
                <div className="pt-4 border-t border-white/5">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Resume Document</label>
                    <FileUpload
                        label="Upload Resume (PDF)"
                        value={resumeUrl}
                        onChange={setResumeUrl}
                        accept="application/pdf"
                        folder="Resume"
                    />
                    {resumeUrl && (
                        <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-black border border-white/5">
                            <div className="p-2 rounded bg-red-500/10 text-red-500">
                                <span className="text-xs font-bold">PDF</span>
                            </div>
                            <p className="text-xs text-slate-400 truncate flex-1 font-mono">{resumeUrl.split('/').pop()}</p>
                        </div>
                    )}
                </div>

                {/* Social Links */}
                <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Social Presence</label>
                        <button type="button" onClick={addSocialLink} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#ffeb00] hover:text-[#ffdb00] transition">
                            <Plus size={14} /> Add Link
                        </button>
                    </div>
                    {socialLinks.length === 0 ? (
                        <div className="p-8 rounded-xl border border-dashed border-white/10 text-center">
                            <p className="text-xs text-slate-500">No social links added yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {socialLinks.map((link, index) => (
                                <div key={index} className="flex items-center gap-3 group">
                                    <select
                                        value={link.platform}
                                        onChange={e => updateSocialLink(index, 'platform', e.target.value)}
                                        className="w-40 rounded-lg border border-white/10 bg-black px-3 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors"
                                    >
                                        {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    <input
                                        value={link.url}
                                        onChange={e => updateSocialLink(index, 'url', e.target.value)}
                                        placeholder={link.platform === 'Email' ? 'your@email.com' : link.platform === 'Phone' ? '+1 234 567 890' : 'https://...'}
                                        className="flex-1 rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors font-mono"
                                    />
                                    <button type="button" onClick={() => removeSocialLink(index)} className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-40 group-hover:opacity-100">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
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
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ManageAbout;
