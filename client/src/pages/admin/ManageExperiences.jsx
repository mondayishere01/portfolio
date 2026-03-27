import React, { useEffect, useState } from "react";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../../api";
import { Pencil, Trash2, Plus, X, Briefcase } from "lucide-react";
import FileUpload from "../../components/FileUpload";

const emptyForm = {
  startMonth: "",
  startYear: "",
  endMonth: "",
  endYear: "",
  isPresent: false,
  title: "",
  company: "",
  companyUrl: "",
  imageUrl: "",
  description: "",
  tags: "",
  order: 0,
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 40 }, (_, i) => String(currentYear - i));

const parseDateString = (dateStr) => {
  if (!dateStr) return {};
  const parts = dateStr.split(/\s*[—–-]\s*/);
  const parseHalf = (s) => {
    if (!s) return {};
    const tokens = s.trim().split(" ");
    if (tokens.length === 2) return { month: tokens[0], year: tokens[1] };
    if (tokens.length === 1) return { month: "", year: tokens[0] };
    return {};
  };
  const start = parseHalf(parts[0]);
  const end =
    parts[1]?.trim().toLowerCase() === "present"
      ? { month: "", year: "", isPresent: true }
      : parseHalf(parts[1]);
  return {
    startMonth: start.month || "",
    startYear: start.year || "",
    endMonth: end.month || "",
    endYear: end.year || "",
    isPresent: !!end.isPresent,
  };
};

const buildDateString = (f) => {
  const start = [f.startMonth, f.startYear].filter(Boolean).join(" ");
  const end = f.isPresent
    ? "Present"
    : [f.endMonth, f.endYear].filter(Boolean).join(" ");
  return [start, end].filter(Boolean).join(" — ");
};

const ManageExperiences = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const res = await getExperiences();
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const openEdit = (item) => {
    setEditing(item._id);
    const parsed = parseDateString(item.date);
    setForm({
      ...item,
      ...parsed,
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || "",
    });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      date: buildDateString(form),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      order: Number(form.order),
    };
    try {
      if (editing) { await updateExperience(editing, payload); }
      else { await createExperience(payload); }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this experience?")) return;
    try { await deleteExperience(id); fetchData(); } catch { /* ignore */ }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Manage Experiences</h2>
          <p className="text-xs text-slate-500 mt-1">Document your professional journey and career highlights</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-[#ffeb00] px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-[#ffdb00] transition shadow-lg shadow-[#ffeb00]/10"
        >
          <Plus size={18} /> Add Experience
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-[#111111] border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-slate-500">No experiences yet. Click "Add Experience" to create one.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex items-start justify-between gap-6 rounded-xl border border-white/10 bg-[#111111] p-5 hover:border-[#ffeb00]/30 transition-all group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-3">
                  {item.imageUrl ? (
                    <div className="w-12 h-12 rounded-lg bg-white p-1.5 flex items-center justify-center shrink-0 shadow-lg">
                      <img src={item.imageUrl} alt={item.company} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-[#ffeb00]/10 flex items-center justify-center shrink-0 border border-[#ffeb00]/20">
                      <Briefcase className="text-[#ffeb00]" size={20} />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#ffeb00] transition-colors leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm font-medium text-slate-400">
                      {item.company} · {item.date}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed max-w-6xl">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {item.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-[#ffeb00]/10 border border-[#ffeb00]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ffeb00]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => openEdit(item)}
                  className="rounded-md p-2 text-slate-500 hover:bg-white/5 hover:text-white transition"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="rounded-md p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition"
                  title="Delete"
                >
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
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#111111] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h3 className="text-xl font-black text-white tracking-tight">
                {editing ? "Refine Experience" : "New Career Node"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full p-2 text-slate-500 hover:bg-white/5 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar space-y-8 flex-1">
              {error && <p className="text-xs font-bold text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20">{error}</p>}

              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 ml-1">Temporal Alignment (Date Range) *</label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 w-12 shrink-0">Initiation</span>
                      <select
                        value={form.startMonth}
                        onChange={(e) => setForm({ ...form, startMonth: e.target.value })}
                        className="flex-1 rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-all"
                      >
                        <option value="">Month</option>
                        {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <select
                        required
                        value={form.startYear}
                        onChange={(e) => setForm({ ...form, startYear: e.target.value })}
                        className="flex-1 rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-all"
                      >
                        <option value="">Year *</option>
                        {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 w-12 shrink-0">Termination</span>
                      <select
                        value={form.endMonth}
                        onChange={(e) => setForm({ ...form, endMonth: e.target.value })}
                        disabled={form.isPresent}
                        className="flex-1 rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none disabled:opacity-20 transition-all"
                      >
                        <option value="">Month</option>
                        {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <select
                        value={form.endYear}
                        onChange={(e) => setForm({ ...form, endYear: e.target.value })}
                        disabled={form.isPresent}
                        className="flex-1 rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white focus:border-[#ffeb00] focus:outline-none disabled:opacity-20 transition-all"
                      >
                        <option value="">Year</option>
                        {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer w-fit pl-[64px] group">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${form.isPresent ? 'bg-[#ffeb00] border-[#ffeb00]' : 'border-white/10 bg-black group-hover:border-white/20'}`}>
                        {form.isPresent && <span className="text-slate-900 text-xs font-black">✓</span>}
                        <input
                          type="checkbox"
                          checked={form.isPresent}
                          onChange={(e) => setForm({ ...form, isPresent: e.target.checked, endMonth: "", endYear: "" })}
                          className="sr-only"
                        />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-200 transition-colors">Currently Occupying Role</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Functional Designation *</label>
                    <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-all shadow-inner" placeholder="e.g. Lead Architect" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Hierarchy Index (Order)</label>
                    <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-all shadow-inner" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Corporate Entity *</label>
                    <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-all shadow-inner" placeholder="e.g. Neuralink" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Domain URL</label>
                    <input value={form.companyUrl} onChange={(e) => setForm({ ...form, companyUrl: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-all shadow-inner font-mono" placeholder="https://..." />
                  </div>
                </div>

                <div className="space-y-4">
                  <FileUpload label="Entity Identifier (Logo)" value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} accept="image/*" folder="Experiences" />
                  {form.imageUrl && (
                    <div className="p-4 rounded-xl bg-black border border-white/5 flex flex-col items-center gap-3">
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">Dynamic Preview</p>
                      <div className="w-24 h-24 rounded-lg bg-white p-3 flex items-center justify-center shadow-2xl relative overflow-hidden group/prev">
                        <img src={form.imageUrl} alt="Preview" className="w-full h-full object-contain relative z-10" />
                        <div className="absolute inset-0 bg-[#ffeb00]/5 opacity-0 group-hover/prev:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Contribution Narrative *</label>
                  <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-all resize-none leading-relaxed shadow-inner" placeholder="Summarize core contributions..." />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Skill Matrix Tags (Comma Separate)</label>
                  <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-sm text-white focus:border-[#ffeb00] focus:outline-none transition-all shadow-inner" placeholder="Python, React, ML..." />
                </div>
              </div>
            </div>

            <div className="p-6 bg-black/50 border-t border-white/10 flex gap-4">
              <button onClick={handleSubmit} disabled={saving} className="flex-1 rounded-xl bg-[#ffeb00] py-4 text-xs font-black text-slate-900 hover:bg-[#ffdb00] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#ffeb00]/10 disabled:opacity-50 uppercase tracking-[0.2em]">
                {saving ? "Synchronizing..." : editing ? "Apply Optimizations" : "Push Career Node"}
              </button>
              <button type="button" onClick={() => setShowModal(false)} className="px-8 rounded-xl border border-white/10 text-[10px] font-bold text-slate-400 hover:text-white hover:bg-white/5 transition uppercase tracking-widest">
                Abort
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageExperiences;
