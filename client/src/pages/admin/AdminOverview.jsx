import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LivePreview from '../../components/admin/LivePreview';
import { LayoutDashboard, Sparkles, MessageSquare, BookOpen } from 'lucide-react';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

const AdminOverview = () => {
    const [stats, setStats] = useState({ blogs: 0, messages: 0, projects: 0, experiences: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await api.get('/dashboard/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch dashboard stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);
    return (
        <div className="max-w-[1400px] mx-auto">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--accent-brand)' }}>
                        <Sparkles size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Workspace Overview</span>
                    </div>
                    <h2 className="text-4xl font-black tracking-tight" style={{ color: 'var(--content-primary)' }}>System Dashboard</h2>
                    <p className="mt-2 text-sm max-w-lg leading-relaxed font-medium" style={{ color: 'var(--content-tertiary)' }}>
                        Welcome back. Here's your live workspace environment where you can monitor changes across your portfolio in real-time.
                    </p>
                </div>
                
                <div className="flex gap-4">
                    <div className="px-6 py-4 rounded-2xl backdrop-blur-sm" style={{ backgroundColor: 'var(--hover-bg)', border: '1px solid var(--border-alpha-10)' }}>
                        <div className="flex items-center gap-2 mb-1" style={{ color: 'var(--content-tertiary)' }}>
                            <BookOpen size={14} />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Active Blogs</span>
                        </div>
                        <p className="text-2xl font-black" style={{ color: 'var(--content-primary)' }}>{loading ? '...' : stats.blogs}</p>
                    </div>
                    <div className="px-6 py-4 rounded-2xl backdrop-blur-sm" style={{ backgroundColor: 'var(--hover-bg)', border: '1px solid var(--border-alpha-10)' }}>
                        <div className="flex items-center gap-2 mb-1" style={{ color: 'var(--content-tertiary)' }}>
                            <MessageSquare size={14} />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Inbox</span>
                        </div>
                        <p className="text-2xl font-black" style={{ color: 'var(--accent-brand)' }}>{loading ? '...' : `${stats.messages} New`}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12">
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--interactive-base-10)', color: 'var(--accent-brand)' }}>
                                <LayoutDashboard size={18} />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest" style={{ color: 'var(--content-primary)' }}>Live Site Preview</h3>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--content-faint)' }}>Real-time Synchronization Enabled</p>
                    </div>
                    
                    <LivePreview />
                </section>
            </div>
        </div>
    );
};

export default AdminOverview;
