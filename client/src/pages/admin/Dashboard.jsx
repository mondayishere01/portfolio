import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Briefcase, FolderGit2, User, MessageSquare, LogOut, ArrowLeft, Sparkles, Award, Settings, UserPlus, BookOpen } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';

const Dashboard = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const adminItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'My Account', path: '/admin/profile', icon: User },
        { label: 'Blogs', path: '/admin/blogs', icon: BookOpen },
        { label: 'Experiences', path: '/admin/experiences', icon: Briefcase },
        { label: 'Projects', path: '/admin/projects', icon: FolderGit2 },
        { label: 'Skills', path: '/admin/skills', icon: Sparkles },
        { label: 'Certifications', path: '/admin/certifications', icon: Award },
        { label: 'About', path: '/admin/about', icon: User },
        { label: 'Messages', path: '/admin/messages', icon: MessageSquare },
        { label: 'Resources', path: '/admin/resources', icon: Sparkles },
        { label: 'Users', path: '/admin/users', icon: UserPlus },
        { label: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    const authorItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'My Profile', path: '/admin/profile', icon: User },
        { label: 'Blogs', path: '/admin/blogs', icon: BookOpen },
    ];

    const navItems = user?.role === 'admin' ? adminItems : authorItems;

    return (
        <div className="min-h-screen lg:flex" style={{ backgroundColor: 'var(--surface-base)' }}>
            {/* Sidebar */}
            <aside className="w-full backdrop-blur-xl p-5 lg:w-72 lg:min-h-screen lg:border-b-0 lg:sticky lg:top-0" style={{ backgroundColor: 'var(--surface-card)', borderBottom: '1px solid var(--border-alpha-10)', borderRight: '1px solid var(--border-alpha-10)' }}>
                <div className="mb-6">
                    <Link to="/" className="group inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-all mb-5" style={{ color: 'var(--content-tertiary)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-brand)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--content-tertiary)'}
                    >
                        <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" /> Back to site
                    </Link>
                    {/* Title row with theme toggle at far right */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-black tracking-tight flex items-center gap-2" style={{ color: 'var(--content-primary)' }}>
                                <div className="w-2 h-6 rounded-full" style={{ backgroundColor: 'var(--accent-brand)' }} />
                                Admin Panel
                            </h1>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1 pl-4" style={{ color: 'var(--content-tertiary)' }}>Portfolio CMS</p>
                        </div>
                        <ThemeToggle />
                    </div>
                </div>
                <nav>
                    <ul className="flex gap-1 overflow-x-auto lg:flex-col">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.path}>
                                    <Link to={item.path}
                                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 group relative border-l-4"
                                        style={{
                                            backgroundColor: isActive ? 'var(--interactive-base)' : 'transparent',
                                            color: isActive ? 'var(--content-primary-inv)' : 'var(--content-muted)',
                                            borderColor: isActive ? 'var(--interactive-base)' : 'transparent',
                                            boxShadow: isActive ? '0 10px 15px -3px var(--interactive-base-20)' : 'none',
                                        }}
                                        onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.color = 'var(--content-primary)'; e.currentTarget.style.backgroundColor = 'var(--hover-bg)'; e.currentTarget.style.borderColor = 'var(--interactive-base-30)'; e.currentTarget.style.paddingLeft = '1.25rem'; } }}
                                        onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.color = 'var(--content-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.paddingLeft = '1rem'; } }}
                                    >
                                        <item.icon size={16} className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
                <button onClick={handleLogout}
                    className="mt-6 w-full flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition"
                    style={{ borderColor: 'var(--border-subtle)', color: 'var(--content-muted)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--status-error-bg)'; e.currentTarget.style.color = 'var(--status-error)'; e.currentTarget.style.borderColor = 'var(--status-error-border)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--content-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                >
                    <LogOut size={14} />
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Dashboard;
