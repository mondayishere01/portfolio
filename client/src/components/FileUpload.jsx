import React, { useState } from 'react';
import { uploadFile } from '../api';
import { UploadCloud, Loader2 } from 'lucide-react';

const FileUpload = ({ value, onChange, accept = "image/*", label = "Upload File", folder = "portfolio" }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const { data } = await uploadFile(formData, folder);
            onChange(data.url);
        } catch (err) {
            setError(err.response?.data?.error || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">{label}</label>

            {/* Value display / manual input */}
            <input
                type="text"
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                placeholder="Auto-fills on upload, or paste URL"
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-all shadow-inner font-mono mb-4"
            />

            {/* Upload Area */}
            <div className="relative flex items-center justify-center p-6 border-2 border-dashed border-white/10 rounded-2xl bg-black hover:bg-white/5 transition-all cursor-pointer group/upload">
                <input
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-20"
                />

                <div className="flex flex-col items-center gap-3 text-slate-500 pointer-events-none transition-transform group-hover/upload:scale-105">
                    {uploading ? (
                        <>
                            <Loader2 size={32} className="animate-spin text-[#ffeb00]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#ffeb00]">Syncing Asset...</span>
                        </>
                    ) : (
                        <>
                            <div className="p-4 rounded-full bg-white/5 group-hover/upload:bg-[#ffeb00]/10 transition-colors">
                                <UploadCloud size={32} className="group-hover/upload:text-[#ffeb00] transition-colors" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest group-hover/upload:text-slate-300 transition-colors">Initialize Asset Upload</span>
                        </>
                    )}
                </div>
            </div>

            {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
        </div>
    );
};

export default FileUpload;
