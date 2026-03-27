import React, { useEffect, useState } from 'react';
import { getCertifications, createCertification, updateCertification, deleteCertification } from '../../api';
import { Plus, Pencil, Trash2, X, ExternalLink } from 'lucide-react';

const blankForm = { title: '', credentialUrl: '' };

const ManageCertifications = () => {
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(blankForm);

    const fetchCerts = async () => {
        try {
            const { data } = await getCertifications();
            setCerts(Array.isArray(data) ? data : []);
        } catch { /* ignore */ }
        setLoading(false);
    };

    useEffect(() => { fetchCerts(); }, []);

    const openNew = () => { setEditing(null); setForm(blankForm); setShowModal(true); };
    const openEdit = (c) => { setEditing(c); setForm({ title: c.title, credentialUrl: c.credentialUrl || '' }); setShowModal(true); };

    const handleSave = async () => {
        try {
            if (editing) {
                await updateCertification(editing._id, form);
            } else {
                await createCertification(form);
            }
            setShowModal(false);
            fetchCerts();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this certification?')) return;
        try { await deleteCertification(id); fetchCerts(); } catch { /* ignore */ }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-200">Manage Certifications</h2>
                <button onClick={openNew} className="flex items-center gap-1.5 rounded-md bg-[#ffeb00]/20 px-3 py-2 text-sm font-medium text-[#ffeb00] hover:bg-[#ffeb00]/30 transition">
                    <Plus size={16} /> Add Certification
                </button>
            </div>

            {loading ? (
                <p className="text-slate-500">Loading...</p>
            ) : certs.length === 0 ? (
                <p className="text-slate-500">No certifications yet. Click "Add Certification" to get started.</p>
            ) : (
                <div className="space-y-3">
                    {certs.map(c => (
                        <div key={c._id} className="flex items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-800/30 p-3">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-200 truncate">{c.title}</p>
                                {c.credentialUrl && (
                                    <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-[#ffeb00] hover:text-[#ffdb00] mt-0.5">
                                        View Credential <ExternalLink size={10} />
                                    </a>
                                )}
                            </div>
                            <button onClick={() => openEdit(c)} className="text-slate-500 hover:text-slate-200 transition"><Pencil size={14} /></button>
                            <button onClick={() => handleDelete(c._id)} className="text-slate-500 hover:text-red-400 transition"><Trash2 size={14} /></button>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-800 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-200">{editing ? 'Edit Certification' : 'Add Certification'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-200"><X size={18} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
                                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-[#ffeb00] focus:outline-none" placeholder="e.g. AWS Cloud Practitioner" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Credential URL (optional)</label>
                                <input value={form.credentialUrl} onChange={e => setForm({ ...form, credentialUrl: e.target.value })} className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-[#ffeb00] focus:outline-none" placeholder="https://www.coursera.org/verify/..." />
                            </div>
                            <button onClick={handleSave} className="w-full rounded-md bg-[#ffcb00] px-4 py-2 text-sm font-medium text-white hover:bg-[#ffeb00] transition">
                                {editing ? 'Update Certification' : 'Create Certification'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCertifications;
