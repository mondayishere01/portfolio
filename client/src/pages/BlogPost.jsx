import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

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
            } catch (err) {
                console.error("Failed to fetch blog:", err);
            } finally {
                setLoading(false);
            }
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
                <Link to="/blog" className="px-6 py-3 rounded-full bg-[#ffeb00] text-slate-900 font-bold uppercase tracking-widest text-sm hover:bg-[#ffdb00] transition-colors">
                    Back to Blog Hub
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black px-5 pt-28 pb-12 md:py-20 lg:pl-0 lg:pr-6">
            <div className="max-w-[1440px] mx-auto">
                <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-start">
                    {/* Main Content Column */}
                    <div className="lg:col-span-8">
                        {/* Header */}
                        <header className="mb-10">
                            <div className="flex items-center gap-3 mb-5">
                                <Link to={`/blog?category=${encodeURIComponent(blog.category)}`} className="rounded-full bg-[#ffeb00]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ffeb00] hover:bg-[#ffeb00]/20 transition">
                                    {blog.category}
                                </Link>
                                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                    <Calendar size={14} />
                                    {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white leading-[1.1] mb-8">
                                {blog.title}
                            </h1>

                            {/* Tags */}
                            {blog.tags && blog.tags.length > 0 && (
                                <div className="flex items-center gap-3 flex-wrap">
                                    <Tag size={16} className="text-[#ffeb00]" />
                                    {blog.tags.map(tag => (
                                        <Link key={tag} to={`/blog?tag=${encodeURIComponent(tag)}`} className="text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-[#ffeb00] transition-colors">
                                            #{tag}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </header>

                        {/* Cover Image */}
                        {blog.imageUrl && (
                            <div className="mb-12 rounded-3xl overflow-hidden bg-slate-900 border border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
                                <img src={blog.imageUrl} alt={blog.title} className="w-full object-cover max-h-[600px]" />
                            </div>
                        )}

                        {/* Content (Prose) */}
                        <article className="prose prose-invert prose-slate prose-lg max-w-none 
                            prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                            prose-p:text-slate-400 prose-p:leading-relaxed
                            prose-a:text-[#ffeb00] prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-white prose-code:text-[#ffeb00]
                            prose-img:rounded-3xl prose-pre:bg-[#111] prose-pre:border prose-pre:border-white/5 prose-pre:shadow-2xl">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {blog.content}
                            </ReactMarkdown>
                        </article>
                    </div>

                    {/* Sidebar Column */}
                    <aside className="lg:col-span-4 mt-16 lg:mt-0 lg:sticky lg:top-24 space-y-10">
                        {/* Author Box */}
                        {blog.author && (
                            <div className="group relative rounded-3xl border border-white/10 bg-[#111111]/80 backdrop-blur-xl p-6 shadow-2xl transition-all hover:border-[#ffeb00]/30">
                                <div className="left-8">
                                    {blog.author.imageUrl ? (
                                        <img src={blog.author.imageUrl} alt={blog.author.name} className="w-20 h-20 rounded-2xl object-cover border-4 border-[#111] shadow-2xl transition-transform duration-500" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-2xl bg-[#ffeb00] flex items-center justify-center text-slate-900 font-black text-3xl shadow-2xl transition-transform duration-500">
                                            {blog.author.name?.charAt(0) || '?'}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ffeb00] mb-2 block">Curated By</span>
                                    <h3 className="text-2xl font-black text-white tracking-tight mb-4">{blog.author.name}</h3>
                                    <p className="text-slate-400 leading-relaxed text-sm font-medium">
                                        {blog.author.bio || "Crafting digital experiences through high-performance code and thoughtful design."}
                                    </p>

                                    {/* Social Links */}
                                    {blog.author.socialLinks && blog.author.socialLinks.length > 0 && (
                                        <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-4">
                                            {blog.author.socialLinks.map((social, i) => (
                                                <a key={i} href={social.url} target="_blank" rel="noreferrer" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-[#ffeb00] transition-colors">
                                                    {social.platform}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Recommendations Box */}
                        <div className="rounded-3xl border border-white/10 bg-[#111111]/40 p-6 shadow-2xl transition-all hover:border-white/20">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-8 flex items-center gap-2">
                                <div className="w-1.5 h-6 bg-[#ffeb00] rounded-full" />
                                Read Next
                            </h4>

                            <div className="space-y-8">
                                {blog.next ? (
                                    <Link to={`/blog/${blog.next._id}`} className="group block" onClick={() => window.scrollTo(0, 0)}>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2 block group-hover:text-[#ffeb00] transition-colors">Next Article →</span>
                                        <h5 className="text-sm font-bold text-slate-200 line-clamp-2 leading-snug group-hover:text-white transition-colors">{blog.next.title}</h5>
                                    </Link>
                                ) : (
                                    <div className="opacity-30">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-2 block">Next Article</span>
                                        <h5 className="text-sm font-bold text-slate-600 font-mono">End of knowledge stream.</h5>
                                    </div>
                                )}

                                <div className="h-px bg-white/5 w-full" />

                                {blog.prev ? (
                                    <Link to={`/blog/${blog.prev._id}`} className="group block" onClick={() => window.scrollTo(0, 0)}>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2 block group-hover:text-[#ffeb00] transition-colors">← Previous Article</span>
                                        <h5 className="text-sm font-bold text-slate-200 line-clamp-2 leading-snug group-hover:text-white transition-colors">{blog.prev.title}</h5>
                                    </Link>
                                ) : (
                                    <div className="opacity-30">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-2 block">Previous Article</span>
                                        <h5 className="text-sm font-bold text-slate-600 font-mono">The origin point.</h5>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Newsletter Box */}
                        <NewsletterBox />
                    </aside>
                </div>
            </div>
        </div>
    );
};

const NewsletterBox = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            const { data } = await api.post('/newsletter/subscribe', { email });
            setStatus('success');
            setMessage(data.message || 'Welcome to the inner circle.');
            setEmail('');
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.error || 'Subscription failed. Try again?');
        }
    };

    return (
        <div className="group relative rounded-3xl bg-[#ffeb00] p-6 shadow-2xl shadow-[#ffeb00]/10 overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-black/5 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150" />

            <h4 className="text-slate-900 font-black tracking-tight text-2xl mb-3 relative z-10">Newsletter</h4>
            <p className="text-slate-900/70 text-sm font-bold leading-relaxed mb-8 relative z-10">
                Get my latest technical insights and project deep-dives delivered straight to your inbox.
            </p>

            {status === 'success' ? (
                <div className="bg-black/10 rounded-2xl p-4 border border-black/5 animate-in fade-in zoom-in duration-500">
                    <p className="text-slate-900 font-black text-sm text-center">✓ {message}</p>
                </div>
            ) : (
                <form onSubmit={handleSubscribe} className="relative z-10 space-y-4">
                    <div className="relative group/input">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full bg-white/20 border-2 border-slate-900/10 rounded-2xl px-6 py-4 text-sm text-slate-900 placeholder:text-slate-900/40 focus:outline-none focus:border-slate-900/40 focus:bg-white/40 transition-all font-bold"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-slate-900 text-[#ffeb00] py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {status === 'loading' ? 'Joining...' : 'Subscribe Now'}
                    </button>

                    {status === 'error' && (
                        <p className="text-red-600 text-[10px] font-black uppercase tracking-wider text-center animate-shake">
                            {message}
                        </p>
                    )}
                </form>
            )}

            <p className="mt-6 text-[9px] text-slate-900/40 font-bold uppercase tracking-widest text-center relative z-10">
                Weekly updates • No spam • 1-click unsubscribe
            </p>
        </div>
    );
};

export default BlogPost;
