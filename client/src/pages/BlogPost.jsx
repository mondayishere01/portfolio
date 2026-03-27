import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar, Tag, User } from 'lucide-react';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

const BlogPost = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const { data } = await api.get(`/blogs/${id}`);
                setBlog(data);
            } catch { /* ignore */ }
            finally { setLoading(false); }
        };
        fetchBlog();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black py-24 flex justify-center">
                <div className="w-16 h-16 border-4 border-[#ffeb00] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-3xl font-bold text-slate-200 mb-2">Blog Not Found</h2>
                <p className="text-slate-400 mb-6">This article might have been moved or deleted.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black px-6 py-12 md:py-20 lg:pl-3 lg:pr-12">
            <div className="lg:max-w-none lg:mx-0">

                {/* Header */}
                <header className="mb-10">
                    <div className="flex items-center gap-3 mb-5">
                        <Link to={`/blog?category=${encodeURIComponent(blog.category)}`} className="rounded-full bg-[#ffeb00]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#ffeb00] hover:bg-[#ffeb00]/20 transition">
                            {blog.category}
                        </Link>
                        <span className="flex items-center gap-1.5 text-sm text-slate-500">
                            <Calendar size={14} />
                            {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-200 leading-tight mb-6">
                        {blog.title}
                    </h1>
                    
                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                            <Tag size={16} className="text-slate-500" />
                            {blog.tags.map(tag => (
                                <Link key={tag} to={`/blog?tag=${encodeURIComponent(tag)}`} className="text-sm font-medium text-slate-400 hover:text-[#ffeb00] transition">
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                    )}
                </header>

                {/* Cover Image */}
                {blog.imageUrl && (
                    <div className="mb-12 rounded-2xl overflow-hidden bg-slate-800 ring-1 ring-slate-700/50 shadow-2xl">
                        <img src={blog.imageUrl} alt={blog.title} className="w-full object-cover max-h-[500px]" />
                    </div>
                )}

                {/* Content (Prose) */}
                <article className="prose prose-invert prose-slate prose-a:text-[#ffeb00] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700 max-w-none mb-16">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {blog.content}
                    </ReactMarkdown>
                </article>

                <hr className="border-slate-700/50 mb-10" />

                {/* About the Author Card */}
                {blog.author && (
                    <div className="bg-slate-800/30 rounded-2xl p-6 sm:p-8 border border-slate-700/50 flex flex-col sm:flex-row gap-6 items-start">
                        {blog.author.imageUrl ? (
                            <img src={blog.author.imageUrl} alt={blog.author.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-slate-800" />
                        ) : (
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-700 flex items-center justify-center text-[#ffeb00] font-bold text-3xl shrink-0">
                                {blog.author.name?.charAt(0) || '?'}
                            </div>
                        )}
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-[#ffeb00] mb-1 block">Written by</span>
                            <h3 className="text-2xl font-bold text-slate-200">{blog.author.name}</h3>
                            <p className="mt-3 text-slate-400 leading-relaxed text-sm">
                                {blog.author.bio || "This author hasn't added a bio yet, but their words speak for themselves."}
                            </p>
                            {/* Social Links */}
                            {blog.author.socialLinks && blog.author.socialLinks.length > 0 && (
                                <div className="mt-4 flex gap-4">
                                    {blog.author.socialLinks.map((social, i) => (
                                        <a key={i} href={social.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-400 hover:text-[#ffeb00] transition">
                                            {social.platform}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogPost;
