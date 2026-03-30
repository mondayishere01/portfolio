import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

const BlogPost = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isDark } = useTheme();

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
            <div className="min-h-screen py-24 flex justify-center" style={{ backgroundColor: 'var(--surface-base)' }}>
                <div className="w-16 h-16 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--interactive-base)', borderTopColor: 'transparent' }}></div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ backgroundColor: 'var(--surface-base)' }}>
                <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--content-body)' }}>Blog Not Found</h2>
                <p className="mb-6" style={{ color: 'var(--content-muted)' }}>This article might have been moved or deleted.</p>
                <Link to="/blog" className="px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-colors" style={{ backgroundColor: 'var(--interactive-base)', color: 'var(--content-primary-inv)' }}>
                    Back to Blog Hub
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-5 pt-28 pb-12 md:py-20 lg:pl-0 lg:pr-6" style={{ backgroundColor: 'var(--surface-base)' }}>
            <div className="max-w-[1440px] mx-auto">
                <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-start">
                    {/* Main Content Column */}
                    <div className="lg:col-span-8">
                        {/* Header */}
                        <header className="mb-10">
                            <div className="flex items-center gap-3 mb-5">
                                <Link to={`/blog?category=${encodeURIComponent(blog.category)}`} className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition" style={{ backgroundColor: 'var(--interactive-base-10)', color: 'var(--accent-brand)' }}>
                                    {blog.category}
                                </Link>
                                <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--content-tertiary)' }}>
                                    <Calendar size={14} />
                                    {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-[1.1] mb-8" style={{ color: 'var(--content-primary)' }}>
                                {blog.title}
                            </h1>

                            {/* Tags */}
                            {blog.tags && blog.tags.length > 0 && (
                                <div className="flex items-center gap-3 flex-wrap">
                                    <Tag size={16} style={{ color: 'var(--accent-brand)' }} />
                                    {blog.tags.map(tag => (
                                        <Link key={tag} to={`/blog?tag=${encodeURIComponent(tag)}`} className="text-xs font-bold uppercase tracking-widest transition-colors" style={{ color: 'var(--content-tertiary)' }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-brand)'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--content-tertiary)'}
                                        >
                                            #{tag}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </header>

                        {/* Cover Image */}
                        {blog.imageUrl && (
                            <div className="mb-12 rounded-3xl overflow-hidden" style={{ backgroundColor: 'var(--surface-accent)', border: '1px solid var(--border-alpha-05)', boxShadow: '0 32px 64px -16px var(--shadow-subtle)' }}>
                                <img src={blog.imageUrl} alt={blog.title} className="w-full object-cover max-h-[600px]" />
                            </div>
                        )}

                        {/* Content (Prose) */}
                        <article className={`prose ${isDark ? 'prose-invert' : ''} prose-slate prose-lg max-w-none 
                            prose-headings:font-black prose-headings:tracking-tight
                            prose-p:leading-relaxed
                            prose-a:no-underline hover:prose-a:underline
                            prose-img:rounded-3xl prose-pre:border prose-pre:shadow-2xl`}
                            style={{
                                '--tw-prose-headings': 'var(--content-primary)',
                                '--tw-prose-body': 'var(--content-muted)',
                                '--tw-prose-links': 'var(--accent-brand)',
                                '--tw-prose-bold': 'var(--content-primary)',
                                '--tw-prose-code': 'var(--accent-brand)',
                                '--tw-prose-pre-bg': 'var(--surface-card)',
                                '--tw-prose-pre-border': 'var(--border-alpha-05)',
                            }}
                        >
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {blog.content}
                            </ReactMarkdown>
                        </article>
                    </div>

                    {/* Sidebar Column */}
                    <aside className="lg:col-span-4 mt-16 lg:mt-0 lg:sticky lg:top-24 space-y-10">
                        {/* Author Box */}
                        {blog.author && (
                            <div className="group relative rounded-3xl backdrop-blur-xl p-6 shadow-2xl transition-all" style={{ border: '1px solid var(--border-alpha-10)', backgroundColor: 'var(--surface-card)' }}>
                                <div className="left-8">
                                    {blog.author.imageUrl ? (
                                        <img src={blog.author.imageUrl} alt={blog.author.name} className="w-20 h-20 rounded-2xl object-cover border-4 shadow-2xl transition-transform duration-500" style={{ borderColor: 'var(--surface-card)' }} />
                                    ) : (
                                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-3xl shadow-2xl transition-transform duration-500" style={{ backgroundColor: 'var(--interactive-base)', color: 'var(--content-primary-inv)' }}>
                                            {blog.author.name?.charAt(0) || '?'}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 block" style={{ color: 'var(--accent-brand)' }}>Curated By</span>
                                    <h3 className="text-2xl font-black tracking-tight mb-4" style={{ color: 'var(--content-primary)' }}>{blog.author.name}</h3>
                                    <p className="leading-relaxed text-sm font-medium" style={{ color: 'var(--content-muted)' }}>
                                        {blog.author.bio || "Crafting digital experiences through high-performance code and thoughtful design."}
                                    </p>

                                    {/* Social Links */}
                                    {blog.author.socialLinks && blog.author.socialLinks.length > 0 && (
                                        <div className="mt-6 pt-6 flex flex-wrap gap-4" style={{ borderTop: '1px solid var(--border-alpha-05)' }}>
                                            {blog.author.socialLinks.map((social, i) => (
                                                <a key={i} href={social.url} target="_blank" rel="noreferrer" className="text-[10px] font-bold uppercase tracking-widest transition-colors" style={{ color: 'var(--content-tertiary)' }}
                                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-brand)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--content-tertiary)'}
                                                >
                                                    {social.platform}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Recommendations Box */}
                        <div className="rounded-3xl p-6 shadow-2xl transition-all" style={{ border: '1px solid var(--border-alpha-10)', backgroundColor: 'var(--surface-card)' }}>
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2" style={{ color: 'var(--content-primary)' }}>
                                <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: 'var(--accent-brand)' }} />
                                Read Next
                            </h4>

                            <div className="space-y-8">
                                {blog.next ? (
                                    <Link to={`/blog/${blog.next._id}`} className="group block" onClick={() => window.scrollTo(0, 0)}>
                                        <span className="text-[9px] font-black uppercase tracking-widest mb-2 block transition-colors" style={{ color: 'var(--content-tertiary)' }}>Next Article →</span>
                                        <h5 className="text-sm font-bold line-clamp-2 leading-snug transition-colors" style={{ color: 'var(--content-body)' }}>{blog.next.title}</h5>
                                    </Link>
                                ) : (
                                    <div className="opacity-30">
                                        <span className="text-[9px] font-black uppercase tracking-widest mb-2 block" style={{ color: 'var(--content-faint)' }}>Next Article</span>
                                        <h5 className="text-sm font-bold font-mono" style={{ color: 'var(--content-faint)' }}>End of knowledge stream.</h5>
                                    </div>
                                )}

                                <div className="h-px w-full" style={{ backgroundColor: 'var(--border-alpha-05)' }} />

                                {blog.prev ? (
                                    <Link to={`/blog/${blog.prev._id}`} className="group block" onClick={() => window.scrollTo(0, 0)}>
                                        <span className="text-[9px] font-black uppercase tracking-widest mb-2 block transition-colors" style={{ color: 'var(--content-tertiary)' }}>← Previous Article</span>
                                        <h5 className="text-sm font-bold line-clamp-2 leading-snug transition-colors" style={{ color: 'var(--content-body)' }}>{blog.prev.title}</h5>
                                    </Link>
                                ) : (
                                    <div className="opacity-30">
                                        <span className="text-[9px] font-black uppercase tracking-widest mb-2 block" style={{ color: 'var(--content-faint)' }}>Previous Article</span>
                                        <h5 className="text-sm font-bold font-mono" style={{ color: 'var(--content-faint)' }}>The origin point.</h5>
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
    const [status, setStatus] = useState('idle');
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
        <div className="group relative rounded-3xl p-6 shadow-2xl overflow-hidden" style={{ backgroundColor: 'var(--interactive-base)', boxShadow: '0 25px 50px -12px var(--interactive-base-10)' }}>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150" style={{ backgroundColor: 'var(--content-primary-inv)', opacity: 0.05 }} />

            <h4 className="font-black tracking-tight text-2xl mb-3 relative z-10" style={{ color: 'var(--content-primary-inv)' }}>Newsletter</h4>
            <p className="text-sm font-bold leading-relaxed mb-8 relative z-10" style={{ color: 'var(--content-primary-inv)', opacity: 0.7 }}>
                Get my latest technical insights and project deep-dives delivered straight to your inbox.
            </p>

            {status === 'success' ? (
                <div className="rounded-2xl p-4 animate-in fade-in zoom-in duration-500" style={{ backgroundColor: 'var(--content-primary-inv)', opacity: 0.1, border: '1px solid var(--content-primary-inv)' }}>
                    <p className="font-black text-sm text-center" style={{ color: 'var(--content-primary-inv)' }}>✓ {message}</p>
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
                            className="w-full border-2 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-bold"
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                borderColor: 'var(--content-primary-inv)',
                                color: 'var(--content-primary-inv)',
                                borderOpacity: 0.1,
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-[0.98] transition-all disabled:opacity-50"
                        style={{
                            backgroundColor: 'var(--content-primary-inv)',
                            color: 'var(--interactive-base)',
                        }}
                    >
                        {status === 'loading' ? 'Joining...' : 'Subscribe Now'}
                    </button>

                    {status === 'error' && (
                        <p className="text-[10px] font-black uppercase tracking-wider text-center" style={{ color: 'var(--status-error)' }}>
                            {message}
                        </p>
                    )}
                </form>
            )}

            <p className="mt-6 text-[9px] font-bold uppercase tracking-widest text-center relative z-10" style={{ color: 'var(--content-primary-inv)', opacity: 0.4 }}>
                Weekly updates • No spam • 1-click unsubscribe
            </p>
        </div>
    );
};

export default BlogPost;
