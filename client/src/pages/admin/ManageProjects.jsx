import React, { useEffect, useState } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from '../../api';
import { Plus, Pencil, Trash2, X, ExternalLink, Star } from 'lucide-react';
import FileUpload from '../../components/FileUpload';

const emptyForm = { title: '', description: '', imageUrl: '', link: '', githubUrl: '', tags: '', featured: false, year: new Date().getFullYear() };

const ManageProjects = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const res = await getProjects();
            setItems(Array.isArray(res.data) ? res.data : []);
        } catch { /* ignore */ } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const openCreate = () => { setEditing(null); setForm(emptyForm); setError(''); setShowModal(true); };
    const openEdit = (item) => {
        setEditing(item._id);
        setForm({ title: item.title, description: item.description, imageUrl: item.imageUrl || '', link: item.link || '', githubUrl: item.githubUrl || '', tags: (item.tags || []).join(', '), featured: item.featured || false, year: item.year || new Date().getFullYear() });
        setError('');
        setShowModal(true);
    };
    const closeModal = () => setShowModal(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true); setError('');
        const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), year: Number(form.year) };
        try {
            if (editing) { await updateProject(editing, payload); }
            else { await createProject(payload); }
            setShowModal(false);
            fetchData();
        } catch (err) { setError(err.response?.data?.error || 'Failed to save'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this project?')) return;
        try { await deleteProject(id); fetchData(); }
        catch { /* ignore */ }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white">Manage Projects</h2>
                    <p className="text-xs text-slate-500 mt-1">Showcase your best work and technical projects</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-[#ffeb00] px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-[#ffdb00] transition shadow-lg shadow-[#ffeb00]/10">
                    <Plus size={18} /> Add Project
                </button>
            </div>

            {loading ? (
                <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-16 rounded-md bg-slate-800/50 animate-pulse" />)}</div>
            ) : items.length === 0 ? (
                <p className="text-slate-500">No projects yet. Click "Add New" to create one.</p>
            ) : (
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item._id} className="flex items-start gap-6 rounded-xl border border-white/10 bg-[#111111] p-5 hover:border-[#ffeb00]/30 transition-all group">
                            {item.imageUrl ? (
                                <div className="w-40 h-24 rounded-lg overflow-hidden border border-white/5 shrink-0 bg-black">
                                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                                </div>
                            ) : (
                                <div className="w-40 h-24 rounded-lg border border-white/5 bg-black flex items-center justify-center shrink-0">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">No Preview</span>
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">{item.year}</span>
                                    {item.featured && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#ffeb00] bg-[#ffeb00]/10 px-2 py-0.5 rounded-full">
                                            <Star size={10} className="fill-[#ffeb00]" /> Featured
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-white group-hover:text-[#ffeb00] transition-colors">{item.title}</h3>
                                <p className="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">{item.description}</p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {item.tags?.map((tag, i) => (
                                        <span key={i} className="rounded-full bg-[#ffeb00]/10 border border-[#ffeb00]/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ffeb00]">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button onClick={() => openEdit(item)} className="rounded-md p-2 text-slate-500 hover:bg-white/5 hover:text-white transition" title="Edit">
                                    <Pencil size={18} />
                                </button>
                                <button onClick={() => handleDelete(item._id)} className="rounded-md p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition" title="Delete">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#111111] p-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">{editing ? 'Edit' : 'New'} Project</h3>
                            <button onClick={() => setShowModal(false)} className="rounded-full p-1 text-slate-500 hover:bg-white/5 hover:text-white transition"><X size={20} /></button>
                        </div>
                        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Project Title *</label>
                                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="My Awesome Project"
                                    className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Description *</label>
                                <textarea required rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                                    placeholder="Tell the story of your project..."
                                    className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors resize-none leading-relaxed" />
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <FileUpload
                                        label="Thumbnail Image"
                                        value={form.imageUrl}
                                        onChange={(url) => setForm({ ...form, imageUrl: url })}
                                        folder="Projects"
                                    />
                                    {form.imageUrl && (
                                        <div className="w-full h-24 rounded-lg overflow-hidden border border-white/5 bg-black">
                                            <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Project URL</label>
                                        <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://..."
                                            className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">GitHub URL</label>
                                        <input value={form.githubUrl} onChange={e => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/..."
                                            className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors" />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Project Year</label>
                                    <input type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })}
                                        className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors" />
                                </div>
                                <div className="flex items-center pt-6">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })}
                                            className="h-5 w-5 rounded border-white/10 bg-black text-[#ffeb00] focus:ring-[#ffeb00] transition-colors" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-200 transition-colors">Featured project</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Technologies Used (comma-separated)</label>
                                <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="React, Node.js, MongoDB"
                                    className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors" />
                            </div>
                            <div className="flex gap-4 pt-4 border-t border-white/5">
                                <button type="submit" disabled={saving}
                                    className="flex-1 rounded-xl bg-[#ffeb00] py-4 text-sm font-bold text-slate-900 hover:bg-[#ffdb00] transition shadow-lg shadow-[#ffeb00]/10 disabled:opacity-50">
                                    {saving ? 'Saving...' : editing ? 'Update Project' : 'Create Project'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="px-8 rounded-xl border border-white/10 text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition">
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

export default ManageProjects;
