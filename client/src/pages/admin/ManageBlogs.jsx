import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Plus, Pencil, Trash2, X, ExternalLink } from 'lucide-react';
import FileUpload from '../../components/FileUpload';

// Using local axios instance configured for Blogs
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

const emptyForm = { title: '', content: '', imageUrl: '', category: '', tags: '' };

const ManageBlogs = () => {
    const { user } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const fetchBlogs = async () => {
        try {
            const { data } = await api.get('/blogs');
            let fetchedBlogs = Array.isArray(data) ? data : [];

            // If the user is an author, filter the list so they ONLY see their own blogs.
            if (user && user.role === 'author') {
                fetchedBlogs = fetchedBlogs.filter(blog => {
                    const authorId = typeof blog.author === 'object' ? blog.author._id : blog.author;
                    return authorId === user.id;
                });
            }

            setBlogs(fetchedBlogs);
        } catch { /* ignore */ } finally { setLoading(false); }
    };

    useEffect(() => { fetchBlogs(); }, []);

    const openCreate = () => { setEditing(null); setForm(emptyForm); setError(''); setShowModal(true); };

    const openEdit = (blog) => {
        setEditing(blog._id);
        setForm({
            title: blog.title,
            content: blog.content,
            imageUrl: blog.imageUrl || '',
            category: blog.category || '',
            tags: (blog.tags || []).join(', ')
        });
        setError('');
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true); setError('');

        const payload = {
            ...form,
            tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
        };

        try {
            if (editing) {
                await api.put(`/blogs/${editing}`, payload);
            } else {
                await api.post('/blogs', payload);
            }
            setShowModal(false);
            fetchBlogs();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save blog');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this blog permanently?')) return;
        try {
            await api.delete(`/blogs/${id}`);
            fetchBlogs();
        } catch (err) {
            alert(err.response?.data?.error || 'Deletion failed');
        }
    };

    // Helper: Can the current user edit/delete a specific blog?
    const canMutate = (blog) => {
        if (!user) return false;
        if (user.role === 'admin') return true;
        // The author field might be an object (populated) or an ID string
        const authorId = typeof blog.author === 'object' ? blog.author._id : blog.author;
        return authorId === user.id;
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white">Manage Blogs</h2>
                    <p className="text-xs text-slate-500 mt-1">Share your thoughts and insights with the world</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-[#ffeb00] px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-[#ffdb00] transition shadow-lg shadow-[#ffeb00]/10">
                    <Plus size={18} /> New Blog Post
                </button>
            </div>

            {loading ? (
                <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-24 rounded-md bg-slate-800/50 animate-pulse" />)}</div>
            ) : blogs.length === 0 ? (
                <p className="text-slate-500">No blogs yet. Click "New Blog" to start writing.</p>
            ) : (
                <div className="space-y-4">
                    {blogs.map((blog) => (
                        <div key={blog._id} className="flex flex-col sm:flex-row items-center gap-6 rounded-xl border border-white/10 bg-[#111111] p-5 hover:border-[#ffeb00]/30 transition-all group">
                            {blog.imageUrl ? (
                                <div className="w-full sm:w-40 h-24 rounded-lg overflow-hidden border border-white/5 shrink-0 bg-black">
                                    <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                                </div>
                            ) : (
                                <div className="w-full sm:w-40 h-24 rounded-lg border border-white/5 bg-black flex items-center justify-center shrink-0">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">No Cover</span>
                                </div>
                            )}

                            <div className="flex-1 min-w-0 w-full">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">{new Date(blog.createdAt).toLocaleDateString()}</span>
                                    <span className="rounded-full bg-[#ffeb00]/10 border border-[#ffeb00]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ffeb00]">
                                        {blog.category}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-white group-hover:text-[#ffeb00] transition-colors truncate">{blog.title}</h3>
                                <p className="text-sm text-slate-400 mt-2 flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-500">
                                        {blog.author?.name?.charAt(0) || '?'}
                                    </span>
                                    {blog.author?.name || 'Unknown Author'}
                                </p>
                            </div>

                            {/* Mutate Controls */}
                            {canMutate(blog) && (
                                <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-white/5">
                                    <button onClick={() => openEdit(blog)} className="flex-1 sm:flex-none rounded-md p-2 text-slate-500 hover:bg-white/5 hover:text-white transition flex justify-center" title="Edit">
                                        <Pencil size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(blog._id)} className="flex-1 sm:flex-none rounded-md p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition flex justify-center" title="Delete">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-[#111111] p-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">{editing ? 'Edit' : 'Write'} Blog Post</h3>
                            <button onClick={() => setShowModal(false)} className="rounded-full p-1 text-slate-500 hover:bg-white/5 hover:text-white transition"><X size={24} /></button>
                        </div>

                        {error && <p className="text-sm text-red-400 mb-4 bg-red-500/10 p-3 border border-red-500/20 rounded-lg">{error}</p>}

                        <form onSubmit={handleSave} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Blog Title *</label>
                                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Mastering React in 2026"
                                    className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-lg font-bold text-white focus:border-[#ffeb00] focus:outline-none transition-colors" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Category *</label>
                                    <input required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Tutorial, Career, Essay"
                                        className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Tags (comma-separated)</label>
                                    <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="react, webdev, javascript"
                                        className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <FileUpload
                                    label="Cover Image"
                                    value={form.imageUrl}
                                    onChange={(url) => setForm({ ...form, imageUrl: url })}
                                    folder="Blogs"
                                />
                                {form.imageUrl && (
                                    <div className="mt-4 w-full h-48 rounded-xl overflow-hidden border border-white/5 bg-black">
                                        <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-baseline justify-between">
                                    <span>Content (Markdown) *</span>
                                    <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noreferrer" className="text-[10px] font-bold uppercase tracking-widest text-[#ffeb00] hover:underline">Formatting Help</a>
                                </label>
                                <textarea required rows={15} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                                    placeholder="Write your article here..."
                                    className="w-full rounded-lg border border-white/10 bg-black px-4 py-4 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-colors resize-y font-mono leading-relaxed" />
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-white/5">
                                <button type="submit" disabled={saving}
                                    className="flex-1 rounded-xl bg-[#ffeb00] py-4 text-sm font-bold text-slate-900 hover:bg-[#ffdb00] transition shadow-lg shadow-[#ffeb00]/10 disabled:opacity-50 uppercase tracking-widest">
                                    {saving ? 'Publishing...' : editing ? 'Update Blog' : 'Publish Blog'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="px-8 rounded-xl border border-white/10 text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition uppercase tracking-widest">
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

export default ManageBlogs;
