import React, { useEffect, useState } from 'react';
import { getSkills, createSkill, updateSkill, deleteSkill, getSkillCategories } from '../../api';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import FileUpload from '../../components/FileUpload';

const ManageSkills = () => {
    const [categories, setCategories] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', category: '', proficiency: 3, imageUrl: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const [skillRes, catRes] = await Promise.all([
                getSkills(),
                getSkillCategories()
            ]);
            setSkills(Array.isArray(skillRes.data) ? skillRes.data : []);
            const cats = Array.isArray(catRes.data) ? catRes.data : [];
            setCategories(cats);
            if (!form.category && cats.length > 0) {
                setForm(prev => ({ ...prev, category: cats[0] }));
            }
        } catch { /* ignore */ }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const openNew = () => {
        setEditing(null);
        setForm({ name: '', category: categories[0] || '', proficiency: 3, imageUrl: '' });
        setShowModal(true);
    };
    const openEdit = (s) => {
        setEditing(s);
        setForm({ name: s.name, category: s.category, proficiency: s.proficiency, imageUrl: s.imageUrl || '' });
        setShowModal(true);
    };
    const closeModal = () => setShowModal(false);

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            if (editing) {
                await updateSkill(editing._id, form);
            } else {
                await createSkill(form);
            }
            setShowModal(false);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save skill');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this skill?')) return;
        try { await deleteSkill(id); fetchData(); } catch { /* ignore */ }
    };

    // Group by category
    const grouped = categories.map(cat => ({
        category: cat,
        items: skills.filter(s => s.category === cat),
    })).filter(g => g.items.length > 0);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white">Manage Skills</h2>
                    <p className="text-xs text-slate-500 mt-1">Organize your technical expertise by category</p>
                </div>
                <button onClick={openNew} className="flex items-center gap-2 rounded-lg bg-[#ffeb00] px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-[#ffdb00] transition shadow-lg shadow-[#ffeb00]/10">
                    <Plus size={18} /> Add Skill
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
                                    <div key={s._id} className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#111111] p-3 hover:border-[#ffeb00]/30 transition-all group">
                                        {s.imageUrl ? (
                                            <div className="w-10 h-10 rounded bg-white p-1 flex items-center justify-center shrink-0">
                                                <img src={s.imageUrl} alt={s.name} className="w-full h-full object-contain" />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded bg-[#ffeb00]/10 flex items-center justify-center text-sm font-bold text-[#ffeb00] shrink-0">{s.name.charAt(0)}</div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-200 truncate">{s.name}</p>
                                            <div className="flex gap-1 mt-0.5">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <span key={i} className={`w-2 h-2 rounded-full ${i <= s.proficiency ? 'bg-[#ffeb00]' : 'bg-slate-600'}`} />
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111111] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <h3 className="text-xl font-black text-white tracking-tight">{editing ? 'Optimize Skill' : 'Initialize Skill'}</h3>
                            <button onClick={closeModal} className="rounded-full p-2 text-slate-500 hover:bg-white/5 hover:text-white transition-all"><X size={20} /></button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8 flex-1">
                            {error && <p className="text-xs font-bold text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20">{error}</p>}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Skill Name *</label>
                                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. React"
                                        className="w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-all shadow-inner" />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Category Domain</label>
                                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                                        className="w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-all shadow-inner">
                                        {(categories.length > 0 ? categories : ['Languages', 'Frontend', 'Backend', 'Databases', 'Tools & Practices']).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Proficiency Magnitude</label>
                                        <span className="text-xs font-black text-[#ffeb00] bg-[#ffeb00]/10 px-2 py-0.5 rounded-full">{form.proficiency * 20}%</span>
                                    </div>
                                    <div className="flex justify-between gap-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setForm({ ...form, proficiency: i })}
                                                className={`flex-1 h-12 rounded-lg text-sm font-black transition-all ${i <= form.proficiency ? 'bg-[#ffeb00] text-slate-900 shadow-lg shadow-[#ffeb00]/10' : 'bg-white/5 text-slate-500 border border-white/5 hover:border-white/10'}`}
                                            >{i}</button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <FileUpload label="Visual Identifier (Logo)" value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} folder="Skills" />
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
                            <button onClick={handleSave} disabled={saving}
                                className="flex-1 rounded-xl bg-[#ffeb00] py-4 text-xs font-black text-slate-900 hover:bg-[#ffdb00] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#ffeb00]/10 disabled:opacity-50 uppercase tracking-[0.2em]">
                                {saving ? 'Syncing...' : (editing ? 'Apply Optimization' : 'Initialize Skill')}
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

export default ManageSkills;
