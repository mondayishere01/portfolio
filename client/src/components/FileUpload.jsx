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
            <label className="block text-xs font-medium text-slate-400">{label}</label>
            
            {/* Value display / manual input */}
            <input 
                type="text" 
                value={value || ''} 
                onChange={e => onChange(e.target.value)} 
                placeholder="Auto-fills on upload, or paste URL"
                className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-teal-500 focus:outline-none" 
            />

            {/* Upload Area */}
            <div className="relative flex items-center justify-center p-4 border-2 border-dashed border-slate-700/50 rounded-lg bg-slate-800/20 hover:bg-slate-800/50 transition cursor-pointer">
                <input 
                    type="file" 
                    accept={accept} 
                    onChange={handleFileChange} 
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                />
                
                <div className="flex flex-col items-center gap-2 text-slate-400 pointer-events-none">
                    {uploading ? (
                        <>
                            <Loader2 size={24} className="animate-spin text-teal-500" />
                            <span className="text-xs font-medium text-teal-400">Uploading to Cloudinary...</span>
                        </>
                    ) : (
                        <>
                            <UploadCloud size={24} className="text-slate-500" />
                            <span className="text-xs font-medium">Click or drag file to upload</span>
                        </>
                    )}
                </div>
            </div>

            {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
        </div>
    );
};

export default FileUpload;
