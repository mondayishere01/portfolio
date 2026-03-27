import React, { useEffect, useState } from 'react';
import { getResources, deleteResource } from '../../api';
import { Trash2, ExternalLink, RefreshCw, AlertTriangle, FileText, Image as ImageIcon } from 'lucide-react';

const ManageResources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);
    const [error, setError] = useState('');

    const fetchResources = async () => {
        setLoading(true);
        try {
            const { data } = await getResources();
            setResources(data);
            setError('');
        } catch (err) {
            const msg = err.response?.data?.details || err.response?.data?.error || 'Failed to load resources.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleDelete = async (publicId, inUse) => {
        if (inUse) {
            if (!window.confirm('WARNING: This image is currently IN USE on your website. Deleting it will result in a broken image. Are you sure?')) {
                return;
            }
        } else {
            if (!window.confirm('Are you sure you want to delete this asset from Cloudinary?')) {
                return;
            }
        }

        setDeleting(publicId);
        try {
            await deleteResource(publicId);
            setResources(resources.filter(r => r.public_id !== publicId));
        } catch (err) {
            alert('Failed to delete resource');
        } finally {
            setDeleting(null);
        }
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (loading && resources.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
                <RefreshCw className="animate-spin mb-4 text-[#ffeb00]" size={32} />
                <p className="text-xs font-bold uppercase tracking-widest">Fetching Cloudinary assets...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Resource Manager</h2>
                    <p className="text-xs text-slate-500 mt-1">Audit and manage your Cloudinary assets</p>
                </div>
                <button 
                    onClick={fetchResources}
                    disabled={loading}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-[#ffeb00] hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
                    title="Refresh list"
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-xl flex items-center gap-4">
                    <AlertTriangle size={24} className="shrink-0" />
                    <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {resources.map((res) => (
                    <div 
                        key={res.public_id}
                        className="group relative rounded-2xl border border-white/10 bg-[#111111] overflow-hidden hover:border-[#ffeb00]/30 transition-all duration-500 shadow-xl"
                    >
                        {/* Status Batch */}
                        {res.inUse && (
                            <div className="absolute top-3 left-3 z-10">
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffeb00] text-[9px] font-black text-slate-900 shadow-lg uppercase tracking-tighter">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse" />
                                    Active Asset
                                </span>
                            </div>
                        )}

                        {/* Preview */}
                        <div className="aspect-square bg-white flex items-center justify-center overflow-hidden relative">
                            {res.format === 'pdf' ? (
                                <div className="flex flex-col items-center text-slate-400">
                                    <FileText size={48} strokeWidth={1.5} />
                                    <span className="text-[9px] mt-2 font-black tracking-widest uppercase opacity-50">{res.format}</span>
                                </div>
                            ) : (
                                <img 
                                    src={res.url} 
                                    alt={res.public_id}
                                    className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-105"
                                />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                <a 
                                    href={res.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="p-3 rounded-full bg-[#ffeb00] text-slate-900 hover:scale-110 active:scale-95 transition-all shadow-xl"
                                >
                                    <ExternalLink size={20} />
                                </a>
                                <button 
                                    onClick={() => handleDelete(res.public_id, res.inUse)}
                                    disabled={deleting === res.public_id}
                                    className="p-3 rounded-full bg-white text-slate-900 hover:bg-red-500 hover:text-white hover:scale-110 active:scale-95 transition-all shadow-xl disabled:opacity-50"
                                >
                                    {deleting === res.public_id ? (
                                        <RefreshCw size={20} className="animate-spin" />
                                    ) : (
                                        <Trash2 size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Info Overlay */}
                        <div className="p-4 bg-[#111111]">
                            <p className="text-[10px] text-white font-bold truncate opacity-80" title={res.public_id}>
                                {res.public_id.split('/').pop()}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                                    {res.format.toUpperCase()} • {formatBytes(res.bytes)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {resources.length === 0 && !loading && (
                <div className="text-center py-24 rounded-3xl border-2 border-dashed border-white/5 bg-white/2">
                    <ImageIcon size={64} strokeWidth={1} className="mx-auto text-slate-700 mb-6 drop-shadow-2xl" />
                    <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Cloudinary Vault Empty</p>
                    <p className="text-xs text-slate-600 mt-2">No assets found in your portfolio directory.</p>
                </div>
            )}
        </div>
    );
};

export default ManageResources;
