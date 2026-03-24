import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Tag } from 'lucide-react';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Derived state for active filters
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                let url = '/blogs';
                const query = [];
                if (category) query.push(`category=${encodeURIComponent(category)}`);
                if (tag) query.push(`tag=${encodeURIComponent(tag)}`);
                if (query.length > 0) url += `?${query.join('&')}`;

                const { data } = await api.get(url);
                setBlogs(Array.isArray(data) ? data : []);
            } catch { /* ignore */ }
            finally { setLoading(false); }
        };
        fetchBlogs();
    }, [category, tag]);

    const clearFilters = () => setSearchParams({});

    return (
        <div className="min-h-screen bg-slate-900 px-6 py-12 md:px-12 md:py-20 lg:px-24">
            <div className="max-w-screen-xl mx-auto">
                <header className="mb-12">
                    <Link to="/" className="group inline-flex items-center gap-2 text-sm text-slate-400 hover:text-teal-300 transition mb-6">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Portfolio
                    </Link>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl">Writings & Thoughts</h1>
                    <p className="mt-4 max-w-2xl text-lg text-slate-400">
                        Insights on software engineering, web development, and my technical journey.
                    </p>
                </header>

                {/* Filters */}
                {(category || tag) && (
                    <div className="mb-8 flex items-center gap-3">
                        <span className="text-sm text-slate-400">Filtered by:</span>
                        {category && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-3 py-1 text-sm font-medium text-teal-300">
                                Category: {category}
                            </span>
                        )}
                        {tag && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-sm font-medium text-slate-300">
                                <Tag size={12} /> {tag}
                            </span>
                        )}
                        <button onClick={clearFilters} className="text-sm text-slate-500 hover:text-slate-300 underline ml-2">
                            Clear all
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        [1,2,3,4,5,6].map(i => <div key={i} className="h-80 w-full bg-slate-800/50 rounded-lg animate-pulse" />)
                    ) : blogs.length === 0 ? (
                        <p className="text-slate-500 col-span-full">No articles found matching those filters.</p>
                    ) : (
                        blogs.map((blog) => (
                            <div key={blog._id} className="group flex flex-col items-start justify-between rounded-xl border border-slate-700/50 bg-slate-800/20 hover:bg-slate-800/40 transition p-4">
                                <Link to={`/blog/${blog._id}`} className="w-full">
                                    <div className="w-full h-48 mb-4 overflow-hidden rounded-lg bg-slate-800">
                                        {blog.imageUrl ? (
                                            <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-600 font-medium">No Image</div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <button 
                                            onClick={(e) => { e.preventDefault(); setSearchParams({ category: blog.category }); }}
                                            className="rounded-full bg-teal-500/10 hover:bg-teal-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-300 transition"
                                        >
                                            {blog.category}
                                        </button>
                                        <span className="text-sm text-slate-500">{new Date(blog.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-200 group-hover:text-teal-300 transition line-clamp-2">
                                        {blog.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-400 line-clamp-3">
                                        {/* Remove markdown hashes/stars roughly for preview */}
                                        {blog.content.replace(/[#*_>]/g, '')}
                                    </p>
                                </Link>
                                <div className="mt-5 flex items-center gap-3">
                                    {blog.author?.imageUrl ? (
                                        <img src={blog.author.imageUrl} alt={blog.author.name} className="h-8 w-8 rounded-full object-cover" />
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-teal-400 font-bold text-xs">
                                            {blog.author?.name?.charAt(0) || '?'}
                                        </div>
                                    )}
                                    <div className="text-sm text-slate-300">{blog.author?.name}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogList;
