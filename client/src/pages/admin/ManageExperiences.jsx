import React, { useEffect, useState } from "react";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../../api";
import { Pencil, Trash2, Plus, X } from "lucide-react";
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
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 40 }, (_, i) => String(currentYear - i));

// Parse stored "2022 — Present" or "Jan 2022 — Mar 2024" back into form fields
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
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };
  const openEdit = (item) => {
    setEditing(item._id);
    const parsed = parseDateString(item.date);
    setForm({
      ...parsed,
      title: item.title,
      company: item.company,
      companyUrl: item.companyUrl || "",
      imageUrl: item.imageUrl || "",
      description: item.description,
      tags: (item.tags || []).join(", "),
      order: item.order || 0,
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
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      order: Number(form.order),
    };
    try {
      if (editing) {
        await updateExperience(editing, payload);
      } else {
        await createExperience(payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this experience?")) return;
    try {
      await deleteExperience(id);
      fetchData();
    } catch {
      /* ignore */
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-200">
          Manage Experiences
        </h2>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-md bg-[#ffeb00] px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-[#ffdb00] transition"
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 rounded-md bg-slate-800/50 animate-pulse"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-slate-500">
          No experiences yet. Click "Add New" to create one.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex items-start justify-between gap-4 rounded-lg border border-slate-700 bg-slate-800/30 p-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase">
                    {item.date}
                  </span>
                </div>
                <h3 className="font-medium text-slate-200">
                  {item.title} · {item.company}
                </h3>
                <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-[#ffeb00]/10 px-2.5 py-0.5 text-xs font-medium text-[#ffeb00]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => openEdit(item)}
                  className="rounded-md p-2 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="rounded-md p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-200">
                {editing ? "Edit" : "Add"} Experience
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X size={20} />
              </button>
            </div>
            {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Date Range Picker */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Date Range *
                </label>
                <div className="space-y-2">
                  {/* Start */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-10 shrink-0">
                      From
                    </span>
                    <select
                      value={form.startMonth}
                      onChange={(e) =>
                        setForm({ ...form, startMonth: e.target.value })
                      }
                      className="flex-1 rounded-md border border-slate-600 bg-slate-700/50 px-2 py-2 text-sm text-slate-200 focus:border-[#ffeb00] focus:outline-none"
                    >
                      <option value="">Month</option>
                      {MONTHS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <select
                      required
                      value={form.startYear}
                      onChange={(e) =>
                        setForm({ ...form, startYear: e.target.value })
                      }
                      className="flex-1 rounded-md border border-slate-600 bg-slate-700/50 px-2 py-2 text-sm text-slate-200 focus:border-[#ffeb00] focus:outline-none"
                    >
                      <option value="">Year *</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* End */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-10 shrink-0">
                      To
                    </span>
                    <select
                      value={form.endMonth}
                      onChange={(e) =>
                        setForm({ ...form, endMonth: e.target.value })
                      }
                      disabled={form.isPresent}
                      className="flex-1 rounded-md border border-slate-600 bg-slate-700/50 px-2 py-2 text-sm text-slate-200 focus:border-[#ffeb00] focus:outline-none disabled:opacity-40"
                    >
                      <option value="">Month</option>
                      {MONTHS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <select
                      value={form.endYear}
                      onChange={(e) =>
                        setForm({ ...form, endYear: e.target.value })
                      }
                      disabled={form.isPresent}
                      className="flex-1 rounded-md border border-slate-600 bg-slate-700/50 px-2 py-2 text-sm text-slate-200 focus:border-[#ffeb00] focus:outline-none disabled:opacity-40"
                    >
                      <option value="">Year</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Present toggle */}
                  <label className="flex items-center gap-2 cursor-pointer w-fit">
                    <input
                      type="checkbox"
                      checked={form.isPresent}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          isPresent: e.target.checked,
                          endMonth: "",
                          endYear: "",
                        })
                      }
                      className="accent-[#ffeb00] w-4 h-4"
                    />
                    <span className="text-sm text-slate-400">
                      Currently working here
                    </span>
                  </label>
                  {/* Preview */}
                  {(form.startYear || form.isPresent) && (
                    <p className="text-xs text-[#ffeb00]/70 font-mono">
                      {buildDateString(form) || "—"}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) =>
                      setForm({ ...form, order: e.target.value })
                    }
                    className="w-full rounded-md border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-slate-200 focus:border-[#ffeb00] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Job Title *
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Senior Frontend Engineer"
                  className="w-full rounded-md border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-slate-200 focus:border-[#ffeb00] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Company *
                  </label>
                  <input
                    required
                    value={form.company}
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                    placeholder="Acme Inc."
                    className="w-full rounded-md border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-slate-200 focus:border-[#ffeb00] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Company URL
                  </label>
                  <input
                    value={form.companyUrl}
                    onChange={(e) =>
                      setForm({ ...form, companyUrl: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full rounded-md border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-slate-200 focus:border-[#ffeb00] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <FileUpload
                  label="Company Logo"
                  value={form.imageUrl}
                  onChange={(url) => setForm({ ...form, imageUrl: url })}
                />
                {form.imageUrl && (
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    className="mt-2 w-10 h-10 object-contain rounded border border-slate-600 bg-slate-800 p-1"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full rounded-md border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-slate-200 focus:border-[#ffeb00] focus:outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="React, TypeScript, Node.js"
                  className="w-full rounded-md border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-slate-200 focus:border-[#ffeb00] focus:outline-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-md bg-[#ffeb00] py-2 text-sm font-semibold text-slate-900 hover:bg-[#ffdb00] transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : editing ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageExperiences;
