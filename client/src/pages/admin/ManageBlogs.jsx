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
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-200">Manage Blogs</h2>
                    <p className="text-sm text-slate-400">Write and publish articles for the site.</p>
                </div>
                <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-md bg-[#ffeb00] px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-[#ffdb00] transition">
                    <Plus size={16} /> New Blog
                </button>
            </div>

            {loading ? (
                <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 rounded-md bg-slate-800/50 animate-pulse" />)}</div>
            ) : blogs.length === 0 ? (
                <p className="text-slate-500">No blogs yet. Click "New Blog" to start writing.</p>
            ) : (
                <div className="space-y-4">
                    {blogs.map((blog) => (
                        <div key={blog._id} className="flex flex-col sm:flex-row items-center gap-4 rounded-lg border border-slate-700 bg-slate-800/30 p-4">
                            {blog.imageUrl ? (
                                <img src={blog.imageUrl} alt={blog.title} className="w-full sm:w-32 h-20 rounded-md object-cover border border-slate-700 shrink-0 bg-slate-800" />
                            ) : (
                                <div className="w-full sm:w-32 h-20 rounded-md border border-slate-700 bg-slate-800 flex items-center justify-center shrink-0">
                                    <span className="text-xs text-slate-500">No Cover</span>
                                </div>
                            )}
                            
                            <div className="flex-1 min-w-0 w-full">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-semibold text-slate-500">{new Date(blog.createdAt).toLocaleDateString()}</span>
                                    <span className="rounded-full bg-[#ffeb00]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#ffeb00]">
                                        {blog.category}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-lg text-slate-200 truncate">{blog.title}</h3>
                                <p className="text-sm text-slate-400 mt-1">By {blog.author?.name || 'Unknown Author'}</p>
                            </div>

                            {/* Mutate Controls */}
                            {canMutate(blog) && (
                                <div className="flex sm:flex-col gap-2 shrink-0">
                                    <button onClick={() => openEdit(blog)} className="rounded-md p-2 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition" title="Edit">
                                        <Pencil size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(blog._id)} className="rounded-md p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition" title="Delete">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
                    <div className="w-full max-w-3xl rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-slate-200">{editing ? 'Edit' : 'Write'} Blog</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-200"><X size={24} /></button>
                        </div>
                        
                        {error && <p className="text-sm text-red-400 mb-4 bg-red-500/10 p-3 rounded">{error}</p>}
                        
                        <form onSubmit={handleSave} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Blog Title *</label>
                                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Mastering React in 2026"
                                    className="w-full rounded-md border border-slate-600 bg-slate-700/50 px-3 py-2 text-lg font-medium text-slate-200 focus:border-[#ffeb00] focus:outline-none" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Category *</label>
                                    <input required value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="e.g. Tutorial, Career, Essay"
                                        className="w-full rounded-md border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-slate-200 focus:border-[#ffeb00] focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Tags (comma-separated)</label>
                                    <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="react, webdev, javascript"
                                        className="w-full rounded-md border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-slate-200 focus:border-[#ffeb00] focus:outline-none" />
                                </div>
                            </div>

                            <div>
                                <FileUpload
                                    label="Cover Image"
                                    value={form.imageUrl}
                                    onChange={(url) => setForm({ ...form, imageUrl: url })}
                                    folder="Blogs"
                                />
                                {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="mt-3 h-32 rounded-lg object-cover border border-slate-600" />}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1 flex items-baseline justify-between">
                                    <span>Content (Markdown Support) *</span>
                                    <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noreferrer" className="text-xs text-[#ffeb00] hover:underline">Formatting Help</a>
                                </label>
                                <textarea required rows={12} value={form.content} onChange={e => setForm({...form, content: e.target.value})}
                                    placeholder="Write your article here..."
                                    className="w-full rounded-md border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-slate-200 focus:border-[#ffeb00] focus:outline-none resize-y font-mono" />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={saving}
                                    className="flex-1 rounded-md bg-[#ffeb00] py-2.5 font-semibold text-slate-900 hover:bg-[#ffdb00] transition disabled:opacity-50">
                                    {saving ? 'Publishing...' : editing ? 'Update Blog' : 'Publish Blog'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="rounded-md border border-slate-600 px-6 py-2.5 text-slate-400 hover:text-slate-200 transition">
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
