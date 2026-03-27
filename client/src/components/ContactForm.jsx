import React, { useState } from 'react';
import { submitContact } from '../api';

const ContactForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await submitContact(formData);
            setStatus({ type: 'success', message: 'Message sent! I\'ll get back to you soon.' });
            setFormData({ name: '', email: '', message: '' });
        } catch (err) {
            setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                <input
                    type="text" id="name" name="name" required
                    value={formData.name} onChange={handleChange}
                    className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-4 py-2 text-slate-200 focus:border-[#ffeb00] focus:outline-none focus:ring-1 focus:ring-[#ffeb00] transition"
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <input
                    type="email" id="email" name="email" required
                    value={formData.email} onChange={handleChange}
                    className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-4 py-2 text-slate-200 focus:border-[#ffeb00] focus:outline-none focus:ring-1 focus:ring-[#ffeb00] transition"
                />
            </div>
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                <textarea
                    id="message" name="message" rows="4" required
                    value={formData.message} onChange={handleChange}
                    className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-4 py-2 text-slate-200 focus:border-[#ffeb00] focus:outline-none focus:ring-1 focus:ring-[#ffeb00] transition resize-none"
                />
            </div>
            <button
                type="submit" disabled={loading}
                className="inline-flex items-center rounded-md bg-[#ffeb00] px-6 py-2.5 text-sm font-medium text-slate-900 hover:bg-[#ffdb00] focus:outline-none focus:ring-2 focus:ring-[#ffeb00] focus:ring-offset-2 focus:ring-offset-black transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Sending...' : 'Send Message'}
            </button>
            {status.message && (
                <p className={`text-sm ${status.type === 'success' ? 'text-[#ffeb00]' : 'text-red-400'}`}>
                    {status.message}
                </p>
            )}
        </form>
    );
};

export default ContactForm;
