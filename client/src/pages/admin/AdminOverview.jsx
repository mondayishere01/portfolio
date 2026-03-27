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
                    <div className="flex items-center gap-2 text-[#ffeb00] mb-2">
                        <Sparkles size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Workspace Overview</span>
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tight">System Dashboard</h2>
                    <p className="text-slate-500 mt-2 text-sm max-w-lg leading-relaxed font-medium">
                        Welcome back. Here's your live workspace environment where you can monitor changes across your portfolio in real-time.
                    </p>
                </div>
                
                <div className="flex gap-4">
                    <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                            <BookOpen size={14} />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Active Blogs</span>
                        </div>
                        <p className="text-2xl font-black text-white">{loading ? '...' : stats.blogs}</p>
                    </div>
                    <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                            <MessageSquare size={14} />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Inbox</span>
                        </div>
                        <p className="text-2xl font-black text-[#ffeb00]">{loading ? '...' : `${stats.messages} New`}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12">
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-[#ffeb00]/10 text-[#ffeb00]">
                                <LayoutDashboard size={18} />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-white">Live Site Preview</h3>
                        </div>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Real-time Synchronization Enabled</p>
                    </div>
                    
                    <LivePreview />
                </section>
                
                {/* Future sections like Quick Stats or Recent Activity can go here */}
            </div>
        </div>
    );
};

export default AdminOverview;
