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
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-200">Contact Messages</h2>
                <span className="text-sm text-slate-500">{messages.length} message{messages.length !== 1 ? 's' : ''}</span>
            </div>

            {loading ? (
                <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 rounded-md bg-slate-800/50 animate-pulse" />)}</div>
            ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                    <Mail size={48} className="mb-4 opacity-30" />
                    <p>No messages yet. They'll appear here when someone fills out the contact form.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {messages.map((msg) => (
                        <div key={msg._id}
                            className={`rounded-lg border border-slate-700 bg-slate-800/30 transition cursor-pointer ${expanded === msg._id ? 'ring-1 ring-[#ffeb00]/30' : ''}`}
                        >
                            <div className="flex items-start justify-between gap-4 p-4" onClick={() => toggleExpand(msg._id)}>
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <div className="shrink-0 mt-0.5">
                                        {expanded === msg._id ?
                                            <MailOpen size={18} className="text-[#ffeb00]" /> :
                                            <Mail size={18} className="text-slate-500" />
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="font-medium text-slate-200 truncate">{msg.name}</h3>
                                            <span className="text-xs text-slate-500">·</span>
                                            <a href={`mailto:${msg.email}`} className="text-xs text-[#ffeb00] hover:text-[#ffdb00] truncate" onClick={e => e.stopPropagation()}>
                                                {msg.email}
                                            </a>
                                        </div>
                                        <p className={`text-sm text-slate-400 ${expanded === msg._id ? '' : 'line-clamp-1'}`}>
                                            {msg.message}
                                        </p>
                                        <p className="text-xs text-slate-600 mt-1">{formatDate(msg.createdAt)}</p>
                                    </div>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); handleDelete(msg._id); }}
                                    className="rounded-md p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition shrink-0" title="Delete">
                                    <Trash2 size={16} />
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
