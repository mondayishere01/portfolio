import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
    ArrowLeft, Calendar, Tag, Clock, List, Info,
    AlertTriangle, Lightbulb, Check, Copy, ChevronRight
} from 'lucide-react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

// --- Custom Markdown Components ---

const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const [copied, setCopied] = useState(false);
    const codeString = String(children).replace(/\n$/, '');

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(codeString);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    return !inline && match ? (
        <div className="relative group my-10 transition-all duration-500">
            <div className="absolute right-4 top-4 z-10 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-4px] group-hover:translate-y-0">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-white/5 text-white/40 backdrop-blur-md border border-white/10">
                    {match[1]}
                </span>
                <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                    title="Copy Code"
                >
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
            </div>
            <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                className="!rounded-3xl !p-8 !m-0 !bg-[#0d1117] border border-white/5 shadow-2xl transition-all duration-500 hover:border-white/10"
                {...props}
            >
                {codeString}
            </SyntaxHighlighter>
        </div>
    ) : (
        <code className="px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 font-mono text-sm" {...props}>
            {children}
        </code>
    );
};

const AlertBlock = ({ children }) => {
    const content = React.Children.toArray(children)[0]?.props?.children?.[0] || '';

    let type = 'note';
    let icon = <Info size={18} />;
    let colorClass = 'border-blue-500/50 bg-blue-500/5';
    let title = 'Note';

    if (content.includes('[!IMPORTANT]')) {
        type = 'important';
        icon = <AlertTriangle size={18} />;
        colorClass = 'border-red-500/50 bg-red-500/5';
        title = 'Important';
    } else if (content.includes('[!TIP]')) {
        type = 'tip';
        icon = <Lightbulb size={18} />;
        colorClass = 'border-yellow-500/50 bg-yellow-500/5';
        title = 'Tip';
    } else if (content.includes('[!WARNING]')) {
        type = 'warning';
        icon = <AlertTriangle size={18} />;
        colorClass = 'border-orange-500/50 bg-orange-500/5';
        title = 'Warning';
    }

    const cleanChildren = React.Children.map(children, child => {
        if (!child?.props) return child;

        if (typeof child.props.children === 'string') {
            return {
                ...child,
                props: {
                    ...child.props,
                    children: child.props.children.replace(/\[!(NOTE|IMPORTANT|TIP|WARNING)\]/g, '').trim()
                }
            };
        }
        if (Array.isArray(child.props.children)) {
            return {
                ...child,
                props: {
                    ...child.props,
                    children: child.props.children.map(c =>
                        typeof c === 'string' ? c.replace(/\[!(NOTE|IMPORTANT|TIP|WARNING)\]/g, '').trim() : c
                    )
                }
            };
        }
        return child;
    });

    return (
        <div className={`my-8 p-5 border-l-4 rounded-r-2xl ${colorClass} animate-in fade-in slide-in-from-left-2 duration-500`}>
            <div className="flex items-center gap-2 mb-2 font-black uppercase tracking-widest text-[10px]" style={{ color: colorClass.split(' ')[0].replace('border-', 'text-').replace('/50', '') }}>
                {icon}
                {title}
            </div>
            <div className="prose-sm italic opacity-90">
                {cleanChildren}
            </div>
        </div>
    );
};

const BlogPost = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toc, setToc] = useState([]);
    const [activeId, setActiveId] = useState('');
    const [readingTime, setReadingTime] = useState(0);
    const { isDark } = useTheme();

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const { data } = await api.get(`/blogs/${id}`);
                setBlog(data);

                // Calculate reading time
                const words = data.content.split(/\s+/).length;
                setReadingTime(Math.ceil(words / 225));

                // Robust slugify function to match heading IDs
                const slugify = (text) => text
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/^-+|-+$/g, '');

                // Extract TOC
                const headings = [];
                const regex = /^(#{2,3})\s+(.+)$/gm;
                let match;
                while ((match = regex.exec(data.content)) !== null) {
                    const textContent = match[2].replace(/[`*#\[\]]/g, ''); // Clean markdown formatting
                    headings.push({
                        level: match[1].length,
                        text: textContent,
                        id: slugify(textContent)
                    });
                }
                setToc(headings);
            } catch (err) {
                console.error("Failed to fetch blog:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
        window.scrollTo(0, 0);
    }, [id]);

    // Intersection Observer for Active TOC Link
    useEffect(() => {
        if (loading || !blog || toc.length === 0) return;

        const callback = (entries) => {
            const visibleSection = entries.find(entry => entry.isIntersecting);
            if (visibleSection) {
                setActiveId(visibleSection.target.id);
            }
        };

        const observer = new IntersectionObserver(callback, {
            rootMargin: '0px 0px -70% 0px',
            threshold: 0.1
        });

        toc.forEach(h => {
            const element = document.getElementById(h.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [loading, blog, toc]);

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
            {/* Reading Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 z-[1001] origin-left"
                style={{ scaleX, backgroundColor: isDark ? '#818cf8' : '#4f46e5' }}
            />

            <div className="max-w-[1440px] mx-auto">
                <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-start">
                    {/* Main Content Column */}
                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            {/* Header */}
                            <header className="mb-10">
                                <div className="flex items-center gap-6 mb-8">
                                    <Link to={`/blog?category=${encodeURIComponent(blog.category)}`} className="rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest transition shadow-lg hover:brightness-110 active:scale-95" style={{ backgroundColor: 'var(--interactive-base)', color: 'var(--content-primary-inv)' }}>
                                        {blog.category}
                                    </Link>
                                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-40" style={{ color: 'var(--content-primary)' }}>
                                        <Calendar size={14} />
                                        {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-40" style={{ color: 'var(--content-primary)' }}>
                                        <Clock size={14} />
                                        {readingTime} min read
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] mb-12" style={{ color: 'var(--content-primary)' }}>
                                    {blog.title}
                                </h1>

                                {/* Tags */}
                                {blog.tags && blog.tags.length > 0 && (
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {blog.tags.map(tag => (
                                            <Link key={tag} to={`/blog?tag=${encodeURIComponent(tag)}`} className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl transition-all hover:scale-105"
                                                style={{
                                                    color: 'var(--content-tertiary)',
                                                    border: '1px solid var(--border-alpha-10)',
                                                    backgroundColor: 'var(--surface-accent)'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.color = isDark ? '#818cf8' : '#4f46e5';
                                                    e.currentTarget.style.borderColor = isDark ? '#818cf8' : '#4f46e5';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.color = 'var(--content-tertiary)';
                                                    e.currentTarget.style.borderColor = 'var(--border-alpha-10)';
                                                }}
                                            >
                                                #{tag}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </header>

                            {/* Cover Image */}
                            {blog.imageUrl && (
                                <div className="mb-20 rounded-[3rem] overflow-hidden group border border-white/5" style={{ backgroundColor: 'var(--surface-accent)', boxShadow: '0 50px 100px -20px var(--shadow-heavy)' }}>
                                    <img src={blog.imageUrl} alt={blog.title} className="w-full object-cover max-h-[800px] group-hover:scale-[1.02] transition-transform duration-[2s] ease-out" />
                                </div>
                            )}

                            <article className={`prose ${isDark ? 'prose-invert' : ''} prose-slate prose-xl max-w-[800px] mx-auto
                            prose-headings:font-black prose-headings:tracking-tighter prose-headings:mb-10
                            prose-h2:text-4xl prose-h2:md:text-5xl prose-h2:mt-28 prose-h2:pb-6 prose-h2:border-b prose-h2:border-indigo-500/10
                            prose-h3:text-2xl prose-h3:mt-16
                            prose-p:leading-[1.8] prose-p:text-lg prose-p:mb-10 prose-p:opacity-90
                            prose-a:no-underline prose-a:font-black hover:prose-a:underline prose-a:transition-all
                            prose-img:rounded-[2.5rem] prose-img:my-20 prose-img:shadow-[0_40px_80px_rgba(0,0,0,0.3)]
                            prose-strong:text-content-primary
                            prose-li:text-lg prose-li:mb-3
                            prose-blockquote:border-l-indigo-500/50 prose-blockquote:bg-indigo-500/5 prose-blockquote:rounded-r-2xl prose-blockquote:p-8 prose-blockquote:italic
                            prose-hr:my-28 prose-hr:border-white/5`}
                                style={{
                                    '--tw-prose-headings': isDark ? '#a5b4fc' : '#4f46e5', // Indigo 300 / 600
                                    '--tw-prose-body': 'var(--content-muted)',
                                    '--tw-prose-links': isDark ? '#818cf8' : '#6366f1', // Indigo 400 / 500
                                    '--tw-prose-bold': 'var(--content-primary)',
                                    '--tw-prose-code': isDark ? '#818cf8' : '#6366f1',
                                    '--tw-prose-pre-bg': 'transparent',
                                    '--tw-prose-pre-border': 'transparent',
                                    '--tw-prose-bullets': isDark ? '#818cf8' : '#6366f1',
                                    '--tw-prose-hr': 'var(--border-alpha-15)',
                                }}
                            >
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        code: CodeBlock,
                                        blockquote: AlertBlock,
                                        h2: ({ node, ...props }) => {
                                            const text = React.Children.toArray(props.children)
                                                .map(child => (typeof child === 'string' ? child : child.props?.children))
                                                .flat()
                                                .join('');
                                            const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/^-+|-+$/g, '');
                                            return <h2 id={id} {...props} />;
                                        },
                                        h3: ({ node, ...props }) => {
                                            const text = React.Children.toArray(props.children)
                                                .map(child => (typeof child === 'string' ? child : child.props?.children))
                                                .flat()
                                                .join('');
                                            const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/^-+|-+$/g, '');
                                            return <h3 id={id} {...props} />;
                                        }
                                    }}
                                >
                                    {blog.content}
                                </ReactMarkdown>
                            </article>
                        </motion.div>
                    </div>

                    {/* Sidebar Column */}
                    <aside className="lg:col-span-4 mt-16 lg:mt-0 space-y-12">
                        {/* Author Box */}
                        {blog.author && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="group relative rounded-[2.5rem] backdrop-blur-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all hover:translate-y-[-4px] hover:shadow-[0_30px_70px_rgba(0,0,0,0.6)]"
                                style={{
                                    border: '1px solid var(--border-alpha-15)',
                                    backgroundColor: isDark ? 'rgba(25, 25, 25, 0.8)' : 'var(--surface-card)',
                                    boxShadow: isDark ? '0 0 40px rgba(129, 140, 248, 0.03)' : ''
                                }}
                            >
                                <div className="flex items-center gap-6 mb-8">
                                    {blog.author.imageUrl ? (
                                        <img src={blog.author.imageUrl} alt={blog.author.name} className="w-16 h-16 rounded-2xl object-cover border-2 shadow-xl" style={{ borderColor: 'var(--surface-card)' }} />
                                    ) : (
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl" style={{ backgroundColor: 'var(--interactive-base)', color: 'var(--content-primary-inv)' }}>
                                            {blog.author.name?.charAt(0) || '?'}
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest block opacity-40" style={{ color: 'var(--content-primary)' }}>Author</span>
                                        <h3 className="text-xl font-black tracking-tight" style={{ color: 'var(--content-primary)' }}>{blog.author.name}</h3>
                                    </div>
                                </div>

                                <p className="leading-relaxed text-sm font-medium opacity-70" style={{ color: 'var(--content-muted)' }}>
                                    {blog.author.bio || "Building the next generation of digital tools through high-performance code and thoughtful design."}
                                </p>

                                {/* Social Links */}
                                {blog.author.socialLinks && blog.author.socialLinks.length > 0 && (
                                    <div className="mt-8 pt-8 flex items-center gap-5 flex-wrap border-t border-white/5">
                                        {blog.author.socialLinks.map((social, i) => (
                                            <a key={i} href={social.url} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest transition-all hover:scale-110 active:scale-95" style={{ color: 'var(--content-tertiary)' }}
                                                onMouseEnter={(e) => e.currentTarget.style.color = isDark ? '#818cf8' : '#4f46e5'}
                                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--content-tertiary)'}
                                            >
                                                {social.platform}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        <NewsletterBox />

                        {/* Recommendations Box */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="rounded-[2.5rem] p-9 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all"
                            style={{
                                border: '1px solid var(--border-alpha-15)',
                                backgroundColor: isDark ? 'rgba(25, 25, 25, 0.8)' : 'var(--surface-card)',
                                boxShadow: isDark ? '0 0 40px rgba(129, 140, 248, 0.03)' : ''
                            }}
                        >
                            <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-10 flex items-center gap-3" style={{ color: 'var(--content-primary)' }}>
                                <div className="w-1.5 h-6 rounded-full bg-indigo-500/20" />
                                Up Next
                            </h4>

                            <div className="space-y-10">
                                {blog.next ? (
                                    <Link to={`/blog/${blog.next._id}`} className="group block" onClick={() => window.scrollTo(0, 0)}>
                                        <span className="text-[9px] font-black uppercase tracking-widest mb-3 block opacity-30 flex items-center gap-2">
                                            Forward <ArrowLeft size={10} className="rotate-180" />
                                        </span>
                                        <h5 className="text-base font-black line-clamp-2 leading-tight group-hover:text-indigo-400 transition-colors" style={{ color: 'var(--content-body)' }}>{blog.next.title}</h5>
                                    </Link>
                                ) : (
                                    <div className="opacity-20">
                                        <span className="text-[9px] font-black uppercase tracking-widest mb-3 block">Horizon</span>
                                        <h5 className="text-base font-black leading-tight italic" style={{ color: 'var(--content-faint)' }}>You've reached the edge.</h5>
                                    </div>
                                )}

                                <div className="h-px w-full bg-white/5" />

                                {blog.prev ? (
                                    <Link to={`/blog/${blog.prev._id}`} className="group block" onClick={() => window.scrollTo(0, 0)}>
                                        <span className="text-[9px] font-black uppercase tracking-widest mb-3 block opacity-30 flex items-center gap-2">
                                            <ArrowLeft size={10} /> History
                                        </span>
                                        <h5 className="text-base font-black line-clamp-2 leading-tight group-hover:text-indigo-400 transition-colors" style={{ color: 'var(--content-body)' }}>{blog.prev.title}</h5>
                                    </Link>
                                ) : (
                                    <div className="opacity-20">
                                        <span className="text-[9px] font-black uppercase tracking-widest mb-3 block">Origin</span>
                                        <h5 className="text-base font-black leading-tight italic" style={{ color: 'var(--content-faint)' }}>The first sequence.</h5>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Table of Contents - Sticky at the bottom of the sidebar stack */}
                        {toc.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="hidden lg:block sticky top-28 rounded-[2.5rem] p-10 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all group z-20"
                                style={{
                                    border: '1px solid var(--border-alpha-20)',
                                    backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'var(--surface-card)',
                                    boxShadow: isDark ? '0 0 60px rgba(129, 140, 248, 0.05)' : ''
                                }}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -z-10 group-hover:scale-150 transition-transform duration-700" />

                                <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-10 flex items-center gap-3" style={{ color: 'var(--content-primary)' }}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                    Directory
                                </h4>
                                <nav className="max-h-[50vh] overflow-y-auto sidebar-scroll space-y-1.5 pr-2">
                                    {toc.map((item, i) => {
                                        const isActive = activeId === item.id;
                                        return (
                                            <a
                                                key={i}
                                                href={`#${item.id}`}
                                                className={`flex items-center gap-3 py-2.5 text-sm font-bold transition-all hover:translate-x-2 ${isActive ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-100'} ${item.level === 3 ? 'pl-8 text-xs' : 'pl-0'}`}
                                                style={{ color: isActive ? (isDark ? '#818cf8' : '#4f46e5') : 'var(--content-muted)' }}
                                            >
                                                {isActive && <ChevronRight size={14} className="shrink-0" />}
                                                {item.text}
                                            </a>
                                        );
                                    })}
                                </nav>

                                <div className="mt-10 pt-10 border-t border-white/5">
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                                        <Clock size={16} />
                                        Estimated {readingTime} MIN READ
                                    </div>
                                </div>
                            </motion.div>
                        )}
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
            setMessage(data.message || 'Transmission received.');
            setEmail('');
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.error || 'Uplink failed.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="group relative rounded-[2.5rem] p-10 shadow-3xl overflow-hidden"
            style={{ backgroundColor: 'var(--interactive-base)', boxShadow: '0 30px 60px -12px var(--interactive-base-20)' }}
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -z-0 transition-transform duration-[1s] group-hover:scale-150" />

            <h4 className="font-black tracking-tighter text-3xl mb-4 relative z-10" style={{ color: 'var(--content-primary-inv)' }}>The Pulse</h4>
            <p className="text-sm font-bold leading-[1.6] mb-10 relative z-10" style={{ color: 'var(--content-primary-inv)', opacity: 0.8 }}>
                Technical deep-dives and engineering insights, delivered weekly. No fluff.
            </p>

            {status === 'success' ? (
                <div className="rounded-2xl p-5 backdrop-blur-md animate-in fade-in zoom-in duration-500" style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <p className="font-black text-sm text-center" style={{ color: 'var(--content-primary-inv)' }}>{message}</p>
                </div>
            ) : (
                <form onSubmit={handleSubscribe} className="relative z-10 space-y-5">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="engineer@protocol.com"
                        required
                        className="w-full h-16 rounded-2xl px-6 text-sm focus:outline-none transition-all font-bold placeholder:opacity-40"
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            border: '2px solid rgba(255,255,255,0.15)',
                            color: 'var(--content-primary-inv)',
                        }}
                    />

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full h-16 rounded-2xl font-black text-xs uppercase tracking-[0.3em] bg-white text-indigo-600 shadow-xl shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    >
                        {status === 'loading' ? 'Transmitting...' : 'Join Protocol'}
                    </button>
                    {status === 'error' && <p className="text-[10px] font-black text-center text-white/60">{message}</p>}
                </form>
            )}

            <p className="mt-8 text-[9px] font-black uppercase tracking-[0.2em] text-center relative z-10 opacity-30" style={{ color: 'var(--content-primary-inv)' }}>
                Encrypted Transmission • No Spam
            </p>
        </motion.div>
    );
};

export default BlogPost;
