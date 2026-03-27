import React, { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink, Globe, Monitor, Smartphone, Tablet } from 'lucide-react';
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

const LivePreview = () => {
    const [previewUrl, setPreviewUrl] = useState(window.location.origin);
    const [liveUrl, setLiveUrl] = useState('');
    const [viewMode, setViewMode] = useState('desktop');
    const [key, setKey] = useState(0);
    const [isHidden, setIsHidden] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        const fetchWebsiteUrl = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                
                const { data } = await api.get('/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const websiteLink = data.socialLinks?.find(link => 
                    link.platform.toLowerCase() === 'website'
                );
                
                if (websiteLink?.url) {
                    setLiveUrl(websiteLink.url);
                }
            } catch (err) {
                console.error("Failed to fetch website URL for preview:", err);
            }
        };
        fetchWebsiteUrl();
    }, []);

    const refreshPreview = () => setKey(prev => prev + 1);

    const getFrameWidth = () => {
        switch (viewMode) {
            case 'mobile': return '375px';
            case 'tablet': return '768px';
            default: return '100%';
        }
    };

    if (isHidden) {
        return (
            <div className="p-12 rounded-2xl border border-dashed border-white/10 bg-[#111111] text-center">
                <Globe size={48} className="mx-auto text-slate-700 mb-4 opacity-20" />
                <h4 className="text-white font-bold mb-2">Preview is Hidden</h4>
                <button onClick={() => setIsHidden(false)} className="px-4 py-2 rounded-lg bg-[#ffeb00] text-slate-900 text-xs font-bold uppercase tracking-widest hover:bg-[#ffdb00] transition">
                    Restore Preview
                </button>
            </div>
        );
    }

    return (
        <div className={`flex flex-col rounded-2xl border border-white/10 bg-[#111111] overflow-hidden shadow-2xl transition-all duration-500 ${isFullScreen ? 'fixed inset-4 z-50' : 'h-[700px]'}`}>
            {/* Browser Header */}
            <div className={`flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-white/5`}>
                <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                        <button onClick={() => setIsHidden(true)} className="w-2.5 h-2.5 rounded-full bg-red-500/50 hover:bg-red-500 transition-colors" title="Hide" />
                        <button onClick={() => setIsFullScreen(!isFullScreen)} className="w-2.5 h-2.5 rounded-full bg-green-500/50 hover:bg-green-500 transition-colors" title="Full Screen" />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 text-[10px] text-slate-400 font-mono min-w-[300px]">
                        <Globe size={12} className={previewUrl === window.location.origin ? "text-[#ffeb00]" : "text-blue-400"} />
                        {previewUrl}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {liveUrl && (
                        <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 mr-2">
                            <button onClick={() => setPreviewUrl(window.location.origin)}
                                className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all ${previewUrl === window.location.origin ? 'bg-[#ffeb00] text-slate-900' : 'text-slate-500 hover:text-white'}`}>
                                Local
                            </button>
                            <button onClick={() => setPreviewUrl(liveUrl)}
                                className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all ${previewUrl === liveUrl ? 'bg-blue-500 text-white' : 'text-slate-500 hover:text-white'}`}>
                                Live
                            </button>
                        </div>
                    )}
                    <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 mr-2">
                        <button onClick={() => setViewMode('mobile')} title="Mobile View"
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-[#ffeb00] text-slate-900' : 'text-slate-500 hover:text-white'}`}>
                            <Smartphone size={14} />
                        </button>
                        <button onClick={() => setViewMode('tablet')} title="Tablet View"
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'tablet' ? 'bg-[#ffeb00] text-slate-900' : 'text-slate-500 hover:text-white'}`}>
                            <Tablet size={14} />
                        </button>
                        <button onClick={() => setViewMode('desktop')} title="Desktop View"
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-[#ffeb00] text-slate-900' : 'text-slate-500 hover:text-white'}`}>
                            <Monitor size={14} />
                        </button>
                    </div>

                    <button onClick={refreshPreview} title="Refresh Preview"
                        className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-[#ffeb00] hover:bg-white/10 transition-all">
                        <RefreshCw size={16} />
                    </button>
                    <a href={previewUrl} target="_blank" rel="noopener noreferrer" title="Open in New Tab"
                        className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-[#ffeb00] hover:bg-white/10 transition-all">
                        <ExternalLink size={16} />
                    </a>
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 bg-slate-900/50 relative overflow-hidden flex justify-center">
                <div className="transition-all duration-300 ease-in-out h-full shadow-2xl" style={{ width: getFrameWidth() }}>
                    <iframe 
                        key={key}
                        src={previewUrl} 
                        className="w-full h-full border-none bg-white"
                        title="Live Preview"
                    />
                </div>
            </div>
            
            {/* Footer / Status */}
            <div className="px-4 py-2 bg-[#1a1a1a] border-t border-white/5 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                    Live Preview Engine <span className="text-[#ffeb00]/40 ml-2">•</span> <span className="ml-2">Connected</span>
                </p>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffeb00] animate-pulse" />
                    <span className="text-[9px] font-bold text-[#ffeb00] uppercase tracking-tighter">Sync Active</span>
                </div>
            </div>
        </div>
    );
};

export default LivePreview;
