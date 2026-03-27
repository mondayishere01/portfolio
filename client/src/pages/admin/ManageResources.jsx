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
                <RefreshCw className="animate-spin mb-4" size={32} />
                <p>Fetching Cloudinary assets...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-200">Resource Manager</h2>
                    <p className="text-sm text-slate-500 mt-1">Audit and manage your Cloudinary assets</p>
                </div>
                <button 
                    onClick={fetchResources}
                    disabled={loading}
                    className="p-2 rounded-md hover:bg-slate-800 text-slate-400 transition"
                    title="Refresh list"
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-3">
                    <AlertTriangle size={20} />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {resources.map((res) => (
                    <div 
                        key={res.public_id}
                        className="group relative rounded-xl border border-slate-700 bg-slate-800/30 overflow-hidden hover:border-[#ffeb00]/50 transition-all duration-300"
                    >
                        {/* Status Batch */}
                        {res.inUse && (
                            <div className="absolute top-2 left-2 z-10">
                                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ffeb00] text-[10px] font-bold text-slate-900 shadow-lg">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse" />
                                    IN USE
                                </span>
                            </div>
                        )}

                        {/* Preview */}
                        <div className="aspect-square bg-slate-900 flex items-center justify-center overflow-hidden">
                            {res.format === 'pdf' ? (
                                <div className="flex flex-col items-center text-slate-600">
                                    <FileText size={48} />
                                    <span className="text-[10px] mt-2 font-mono">{res.format.toUpperCase()}</span>
                                </div>
                            ) : (
                                <img 
                                    src={res.url} 
                                    alt={res.public_id}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            )}
                        </div>

                        {/* Footer / Actions */}
                        <div className="p-3 bg-slate-900/50 backdrop-blur-sm border-t border-slate-700">
                            <div className="flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                    <p className="text-[10px] text-slate-300 font-mono truncate" title={res.public_id}>
                                        {res.public_id.split('/').pop()}
                                    </p>
                                    <p className="text-[9px] text-slate-500 mt-0.5">
                                        {formatBytes(res.bytes)} • {res.format.toUpperCase()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <a 
                                        href={res.url} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
                                    >
                                        <ExternalLink size={14} />
                                    </a>
                                    <button 
                                        onClick={() => handleDelete(res.public_id, res.inUse)}
                                        disabled={deleting === res.public_id}
                                        className="p-1.5 rounded-md hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition"
                                    >
                                        {deleting === res.public_id ? (
                                            <RefreshCw size={14} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={14} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {resources.length === 0 && !loading && (
                <div className="text-center py-20 bg-slate-800/20 rounded-xl border border-dashed border-slate-700">
                    <ImageIcon size={48} className="mx-auto text-slate-700 mb-4" />
                    <p className="text-slate-500">No assets found in your 'portfolio' folder.</p>
                </div>
            )}
        </div>
    );
};

export default ManageResources;
