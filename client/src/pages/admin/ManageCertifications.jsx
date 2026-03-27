import React, { useState, useEffect } from 'react';
import { getCertifications, createCertification, updateCertification, deleteCertification } from '../../api';
import FileUpload from '../../components/FileUpload';
import { Award, X, Pencil, Trash2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const blankForm = { title: '', credentialUrl: '', imageUrl: '' };

const ManageCertifications = () => {
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(blankForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const fetchCerts = async () => {
        try {
            const { data } = await getCertifications();
            setCerts(Array.isArray(data) ? data : []);
        } catch { /* ignore */ }
        setLoading(false);
    };

    useEffect(() => { fetchCerts(); }, []);

    const openNew = () => { setEditing(null); setForm(blankForm); setShowModal(true); };
    const openEdit = (c) => {
        setEditing(c);
        setForm({
            title: c.title,
            credentialUrl: c.credentialUrl || '',
            imageUrl: c.imageUrl || ''
        });
        setShowModal(true);
    };
    const closeModal = () => setShowModal(false);


    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            if (editing) {
                await updateCertification(editing._id, form);
            } else {
                await createCertification(form);
            }
            setShowModal(false);
            fetchCerts();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save certification');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this certification?')) return;
        try { await deleteCertification(id); fetchCerts(); } catch { /* ignore */ }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white">Manage Certifications</h2>
                    <p className="text-xs text-slate-500 mt-1">Verify and display your professional achievements</p>
                </div>
                <button onClick={openNew} className="flex items-center gap-2 rounded-lg bg-[#ffeb00] px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-[#ffdb00] transition shadow-lg shadow-[#ffeb00]/10">
                    <Plus size={18} /> Add Certification
                </button>
            </div>

            {loading ? (
                <p className="text-slate-500">Loading...</p>
            ) : certs.length === 0 ? (
                <p className="text-slate-500">No certifications yet. Click "Add Certification" to get started.</p>
            ) : (
                <div className="space-y-4">
                    {certs.map(c => (
                        <div key={c._id} className="flex items-center gap-6 rounded-xl border border-white/10 bg-[#111111] p-5 hover:border-[#ffeb00]/30 transition-all group">
                            {c.imageUrl ? (
                                <div className="w-12 h-12 rounded-lg bg-white p-1.5 flex items-center justify-center shrink-0 shadow-lg">
                                    <img src={c.imageUrl} alt={c.title} className="w-full h-full object-contain" />
                                </div>
                            ) : (
                                <div className="w-12 h-12 rounded-lg bg-[#ffeb00]/10 flex items-center justify-center shrink-0 border border-[#ffeb00]/20">
                                    <Award className="text-[#ffeb00]" size={20} />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-white group-hover:text-[#ffeb00] transition-colors truncate">{c.title}</h3>
                                {c.credentialUrl && (
                                    <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#ffeb00] hover:text-[#ffdb00] mt-1">
                                        Verify Credential <ExternalLink size={10} />
                                    </a>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openEdit(c)} className="rounded-md p-2 text-slate-500 hover:bg-white/5 hover:text-white transition" title="Edit">
                                    <Pencil size={18} />
                                </button>
                                <button onClick={() => handleDelete(c._id)} className="rounded-md p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition" title="Delete">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111111] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <h3 className="text-xl font-black text-white tracking-tight">{editing ? 'Edit' : 'New'} Certification</h3>
                            <button onClick={closeModal} className="rounded-full p-2 text-slate-500 hover:bg-white/5 hover:text-white transition-all"><X size={20} /></button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8 flex-1">
                            {error && <p className="text-xs font-bold text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20">{error}</p>}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Certification Title *</label>
                                    <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. AWS Cloud Practitioner"
                                        className="w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-all shadow-inner" />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Credential Link (URL)</label>
                                    <input value={form.credentialUrl} onChange={e => setForm({ ...form, credentialUrl: e.target.value })} placeholder="https://..."
                                        className="w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-all shadow-inner font-mono" />
                                </div>

                                <div className="space-y-4">
                                    <FileUpload label="Issuing Authority Logo" value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} folder="Certifications" />
                                    {form.imageUrl && (
                                        <div className="p-4 rounded-xl bg-black border border-white/5 flex flex-col items-center gap-3">
                                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">Logo Preview</p>
                                            <div className="w-24 h-24 rounded-lg bg-white p-3 flex items-center justify-center shadow-2xl relative overflow-hidden group/prev">
                                                <img src={form.imageUrl} alt="Preview" className="w-full h-full object-contain relative z-10" />
                                                <div className="absolute inset-0 bg-[#ffeb00]/5 opacity-0 group-hover/prev:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-black/50 border-t border-white/10 flex gap-4">
                            <button onClick={handleSave}
                                className="flex-1 rounded-xl bg-[#ffeb00] py-4 text-xs font-black text-slate-900 hover:bg-[#ffdb00] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#ffeb00]/10 uppercase tracking-[0.2em]">
                                {editing ? 'Update Record' : 'Create Record'}
                            </button>
                            <button onClick={closeModal} className="px-6 rounded-xl border border-white/10 text-[10px] font-bold text-slate-400 hover:text-white hover:bg-white/5 transition uppercase tracking-widest">
                                Abort
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCertifications;
