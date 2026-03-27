import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Briefcase, FolderGit2, User, MessageSquare, LogOut, ArrowLeft, Sparkles, Award, Settings, UserPlus, BookOpen } from 'lucide-react';

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
        <div className="min-h-screen bg-black lg:flex selection:bg-[#ffeb00]/30">
            {/* Sidebar */}
            <aside className="w-full border-b border-white/10 bg-[#111111]/80 backdrop-blur-xl p-5 lg:w-72 lg:min-h-screen lg:border-b-0 lg:border-r lg:sticky lg:top-0">
                <div className="mb-6">
                    <Link to="/" className="group inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-[#ffeb00] transition-all mb-5">
                        <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" /> Back to site
                    </Link>
                    <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                        <div className="w-2 h-6 bg-[#ffeb00] rounded-full" />
                        Admin Panel
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mt-1 pl-4">Portfolio CMS</p>
                </div>
                <nav>
                    <ul className="flex gap-1 overflow-x-auto lg:flex-col">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.path}>
                                    <Link to={item.path}
                                        className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 group relative border-l-4 ${
                            isActive
                              ? 'bg-[#ffeb00] text-slate-900 border-[#ffeb00] shadow-lg shadow-[#ffeb00]/20'
                              : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5 hover:border-[#ffeb00]/30 hover:pl-5'
                          }`}>
                                        <item.icon size={16} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover/link:scale-110'}`} />
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
                <button onClick={handleLogout}
                    className="mt-6 w-full flex items-center justify-center gap-2 rounded-md border border-slate-600 px-3 py-2 text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition">
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
