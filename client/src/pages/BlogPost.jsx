import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowLeft, Calendar, Tag, Clock, List, Info, AlertTriangle, Lightbulb } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

// --- Custom Markdown Components ---

const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
        <div className="relative group my-8">
            <div className="absolute right-4 top-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-white/10 text-white/50 backdrop-blur-md border border-white/10">
                    {match[1]}
                </span>
            </div>
            <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                className="!rounded-2xl !p-6 !m-0 !bg-[#0d1117] border border-white/5 shadow-2xl"
                {...props}
            >
                {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
        </div>
    ) : (
        <code className="px-1.5 py-0.5 rounded-md bg-accent-brand/10 text-accent-brand font-mono text-sm" {...props}>
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
        if (typeof child.props.children === 'string') {
            return child.props.children.replace(/\[!(NOTE|IMPORTANT|TIP|WARNING)\]/g, '').trim();
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
    const [readingTime, setReadingTime] = useState(0);
    const { isDark } = useTheme();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const { data } = await api.get(`/blogs/${id}`);
                setBlog(data);
                
                // Calculate reading time
                const words = data.content.split(/\s+/).length;
                setReadingTime(Math.ceil(words / 225));

                // Extract TOC
                const headings = [];
                const regex = /^(#{2,3})\s+(.+)$/gm;
                let match;
                while ((match = regex.exec(data.content)) !== null) {
                    headings.push({
                        level: match[1].length,
                        text: match[2],
                        id: match[2].toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
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
                            <div className="flex items-center gap-6 mb-6">
                                <Link to={`/blog?category=${encodeURIComponent(blog.category)}`} className="rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition shadow-lg" style={{ backgroundColor: 'var(--interactive-base)', color: 'var(--content-primary-inv)' }}>
                                    {blog.category}
                                </Link>
                                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60" style={{ color: 'var(--content-primary)' }}>
                                    <Calendar size={14} />
                                    {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60" style={{ color: 'var(--content-primary)' }}>
                                    <Clock size={14} />
                                    {readingTime} min read
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1] mb-10" style={{ color: 'var(--content-primary)' }}>
                                {blog.title}
                            </h1>

                            {/* Tags */}
                            {blog.tags && blog.tags.length > 0 && (
                                <div className="flex items-center gap-4 flex-wrap">
                                    {blog.tags.map(tag => (
                                        <Link key={tag} to={`/blog?tag=${encodeURIComponent(tag)}`} className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg transition-all" 
                                            style={{ 
                                                color: 'var(--content-tertiary)',
                                                border: '1px solid var(--border-alpha-10)',
                                                backgroundColor: 'var(--surface-accent)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = 'var(--accent-brand)';
                                                e.currentTarget.style.borderColor = 'var(--accent-brand)';
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
                            <div className="mb-16 rounded-[2.5rem] overflow-hidden" style={{ backgroundColor: 'var(--surface-accent)', border: '1px solid var(--border-alpha-05)', boxShadow: '0 40px 80px -20px var(--shadow-heavy)' }}>
                                <img src={blog.imageUrl} alt={blog.title} className="w-full object-cover max-h-[700px] hover:scale-105 transition-transform duration-1000" />
                            </div>
                        )}

                        {/* Content (Prose) */}
                        <article className={`prose ${isDark ? 'prose-invert' : ''} prose-slate prose-xl max-w-none 
                            prose-headings:font-black prose-headings:tracking-tighter prose-headings:mb-8
                            prose-h2:text-4xl prose-h2:mt-16
                            prose-h3:text-2xl prose-h3:mt-10
                            prose-p:leading-[1.8] prose-p:text-lg prose-p:mb-8
                            prose-a:no-underline prose-a:font-black hover:prose-a:underline
                            prose-img:rounded-[2rem] prose-img:my-16 prose-img:shadow-2xl
                            prose-strong:text-content-primary
                            prose-li:text-lg prose-li:mb-2`}
                            style={{
                                '--tw-prose-headings': 'var(--content-primary)',
                                '--tw-prose-body': 'var(--content-muted)',
                                '--tw-prose-links': 'var(--accent-brand)',
                                '--tw-prose-bold': 'var(--content-primary)',
                                '--tw-prose-code': 'var(--accent-brand)',
                                '--tw-prose-pre-bg': 'transparent',
                                '--tw-prose-pre-border': 'transparent',
                                '--tw-prose-bullets': 'var(--accent-brand)',
                            }}
                        >
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code: CodeBlock,
                                    blockquote: AlertBlock,
                                    h2: ({node, ...props}) => <h2 id={props.children[0]?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')} {...props} />,
                                    h3: ({node, ...props}) => <h3 id={props.children[0]?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')} {...props} />
                                }}
                            >
                                {blog.content}
                            </ReactMarkdown>
                        </article>
                    </div>

                    {/* Sidebar Column */}
                    <aside className="lg:col-span-4 mt-16 lg:mt-0 space-y-10">
                        {/* Table of Contents */}
                        {toc.length > 0 && (
                            <div className="hidden lg:block sticky top-28 rounded-3xl p-8 shadow-2xl transition-all" style={{ border: '1px solid var(--border-alpha-10)', backgroundColor: 'var(--surface-card)' }}>
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3" style={{ color: 'var(--content-primary)' }}>
                                    <List size={18} className="text-accent-brand" />
                                    Table of Contents
                                </h4>
                                <nav className="space-y-1">
                                    {toc.map((item, i) => (
                                        <a 
                                            key={i} 
                                            href={`#${item.id}`} 
                                            className={`block py-2 text-sm font-bold transition-all hover:translate-x-1 ${item.level === 3 ? 'pl-6 opacity-60 text-xs' : 'pl-0 opacity-80'}`}
                                            style={{ color: 'var(--content-muted)' }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-brand)'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--content-muted)'}
                                        >
                                            {item.text}
                                        </a>
                                    ))}
                                </nav>
                                
                                <div className="mt-8 pt-8 border-t border-white/5">
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest opacity-40">
                                        <Clock size={14} />
                                        Approx. {readingTime} MIN READ
                                    </div>
                                </div>
                            </div>
                        )}

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
