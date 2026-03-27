import React, { useEffect, useState } from 'react';
import { getMessages, deleteMessage } from '../../api';
import { Trash2, Mail, MailOpen } from 'lucide-react';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);

    const fetchData = async () => {
        try {
            const res = await getMessages();
            setMessages(Array.isArray(res.data) ? res.data : []);
        } catch { /* ignore */ } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this message?')) return;
        try { await deleteMessage(id); fetchData(); }
        catch { /* ignore */ }
    };

    const toggleExpand = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white">Contact Hub</h2>
                    <p className="text-xs text-slate-500 mt-1">Inbound communications from your portfolio visitors</p>
                </div>
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {messages.length} Message{messages.length !== 1 ? 's' : ''} Received
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl bg-[#111111] border border-white/5 animate-pulse" />)}</div>
            ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 rounded-3xl border-2 border-dashed border-white/5 bg-white/2">
                    <Mail size={64} strokeWidth={1} className="mb-6 text-slate-700 drop-shadow-2xl" />
                    <p className="text-sm font-bold uppercase tracking-widest text-slate-500 text-center px-6">Transmission Hub Empty</p>
                    <p className="text-xs text-slate-600 mt-2 text-center px-6">New inquiries will appear here automatically.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div key={msg._id}
                            className={`rounded-2xl border border-white/10 bg-[#111111] transition-all duration-300 cursor-pointer overflow-hidden ${expanded === msg._id ? 'border-[#ffeb00]/40 shadow-2xl shadow-[#ffeb00]/5 ring-1 ring-[#ffeb00]/20' : 'hover:border-white/20'}`}
                        >
                            <div className="flex items-start justify-between gap-6 p-6" onClick={() => toggleExpand(msg._id)}>
                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                    <div className="shrink-0 mt-1">
                                        {expanded === msg._id ?
                                            <div className="p-2 rounded-lg bg-[#ffeb00] text-slate-900 shadow-lg"><MailOpen size={18} /></div> :
                                            <div className="p-2 rounded-lg bg-white/5 text-slate-500"><Mail size={18} /></div>
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <h3 className={`text-lg font-bold transition-colors ${expanded === msg._id ? 'text-white' : 'text-slate-200'}`}>{msg.name}</h3>
                                            <div className="h-1 w-1 rounded-full bg-slate-700" />
                                            <a href={`mailto:${msg.email}`} className="text-xs font-bold text-[#ffeb00] hover:text-[#ffdb00] transition-colors truncate uppercase tracking-widest" onClick={e => e.stopPropagation()}>
                                                {msg.email}
                                            </a>
                                        </div>
                                        <p className={`text-sm leading-relaxed transition-all duration-300 ${expanded === msg._id ? 'text-slate-300 whitespace-pre-wrap' : 'text-slate-500 line-clamp-1 font-medium'}`}>
                                            {msg.message}
                                        </p>
                                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{formatDate(msg.createdAt)}</p>
                                            {expanded === msg._id && <div className="ml-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#ffeb00]/60">Secure Transmission Verified</div>}
                                        </div>
                                    </div>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); handleDelete(msg._id); }}
                                    className="rounded-xl p-3 text-slate-500 hover:bg-black hover:text-red-400 transition-all shadow-sm opacity-40 hover:opacity-100" title="Purge Message">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Messages;
