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
        <div className="min-h-screen bg-slate-900 lg:flex">
            {/* Sidebar */}
            <aside className="w-full border-b border-slate-700 bg-slate-800/50 p-4 lg:w-64 lg:min-h-screen lg:border-b-0 lg:border-r">
                <div className="mb-6">
                    <Link to="/" className="group inline-flex items-center gap-1 text-xs text-slate-500 hover:text-[#ffdb00] transition mb-3">
                        <ArrowLeft size={12} /> Back to site
                    </Link>
                    <h1 className="text-xl font-bold text-slate-200">Admin Panel</h1>
                    <p className="text-xs text-slate-500">Portfolio CMS</p>
                </div>
                <nav>
                    <ul className="flex gap-1 overflow-x-auto lg:flex-col">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.path}>
                                    <Link to={item.path}
                                        className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition whitespace-nowrap ${
                                            isActive
                                                ? 'bg-[#ffeb00]/10 text-[#ffeb00] font-medium'
                                                : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                                        }`}>
                                        <item.icon size={16} />
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
