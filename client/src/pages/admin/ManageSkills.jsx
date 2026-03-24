import React, { useEffect, useState } from 'react';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../../api';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import FileUpload from '../../components/FileUpload';

const CATEGORIES = ['Languages', 'Frontend', 'Backend', 'Databases', 'Cloud & DevOps', 'Tools & Practices'];

const blankForm = { name: '', category: 'Languages', proficiency: 3, imageUrl: '' };

const ManageSkills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(blankForm);

    const fetchSkills = async () => {
        try {
            const { data } = await getSkills();
            setSkills(Array.isArray(data) ? data : []);
        } catch { /* ignore */ }
        setLoading(false);
    };

    useEffect(() => { fetchSkills(); }, []);

    const openNew = () => { setEditing(null); setForm(blankForm); setShowModal(true); };
    const openEdit = (s) => { setEditing(s); setForm({ name: s.name, category: s.category, proficiency: s.proficiency, imageUrl: s.imageUrl || '' }); setShowModal(true); };

    const handleSave = async () => {
        try {
            if (editing) {
                await updateSkill(editing._id, form);
            } else {
                await createSkill(form);
            }
            setShowModal(false);
            fetchSkills();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this skill?')) return;
        try { await deleteSkill(id); fetchSkills(); } catch { /* ignore */ }
    };

    // Group by category
    const grouped = CATEGORIES.map(cat => ({
        category: cat,
        items: skills.filter(s => s.category === cat),
    })).filter(g => g.items.length > 0);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-200">Manage Skills</h2>
                <button onClick={openNew} className="flex items-center gap-1.5 rounded-md bg-teal-500/20 px-3 py-2 text-sm font-medium text-teal-300 hover:bg-teal-500/30 transition">
                    <Plus size={16} /> Add Skill
                </button>
            </div>

            {loading ? (
                <p className="text-slate-500">Loading...</p>
            ) : grouped.length === 0 ? (
                <p className="text-slate-500">No skills yet. Click "Add Skill" to get started.</p>
            ) : (
                <div className="space-y-8">
                    {grouped.map(g => (
                        <div key={g.category}>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">{g.category}</h3>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {g.items.map(s => (
                                    <div key={s._id} className="flex items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-800/30 p-3">
                                        {s.imageUrl ? (
                                            <img src={s.imageUrl} alt={s.name} className="w-8 h-8 object-contain rounded" />
                                        ) : (
                                            <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center text-sm font-bold text-teal-400">{s.name.charAt(0)}</div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-200 truncate">{s.name}</p>
                                            <div className="flex gap-1 mt-0.5">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <span key={i} className={`w-2 h-2 rounded-full ${i <= s.proficiency ? 'bg-teal-400' : 'bg-slate-600'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <button onClick={() => openEdit(s)} className="text-slate-500 hover:text-slate-200 transition"><Pencil size={14} /></button>
                                        <button onClick={() => handleDelete(s._id)} className="text-slate-500 hover:text-red-400 transition"><Trash2 size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-800 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-200">{editing ? 'Edit Skill' : 'Add Skill'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-200"><X size={18} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Name</label>
                                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-teal-500 focus:outline-none" placeholder="e.g. React" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-teal-500 focus:outline-none">
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Proficiency (1-5)</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setForm({ ...form, proficiency: i })}
                                            className={`w-9 h-9 rounded-md text-sm font-bold transition ${i <= form.proficiency ? 'bg-teal-500/30 text-teal-300 border border-teal-500/50' : 'bg-slate-700 text-slate-500 border border-slate-600'}`}
                                        >{i}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <FileUpload
                                    label="Image / Icon URL (optional)"
                                    value={form.imageUrl}
                                    onChange={(url) => setForm({ ...form, imageUrl: url })}
                                    accept="image/*"
                                />
                                {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="mt-2 w-10 h-10 object-contain rounded border border-slate-600 bg-slate-800 p-1" />}
                            </div>
                            <button onClick={handleSave} className="w-full rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500 transition">
                                {editing ? 'Update Skill' : 'Create Skill'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageSkills;
