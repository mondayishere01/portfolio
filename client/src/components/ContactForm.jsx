import React, { useState } from 'react';
import { submitContact } from '../api';

const inputStyle = {
    backgroundColor: 'var(--surface-card)',
    borderColor: 'var(--border-subtle)',
    color: 'var(--content-body)',
};

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

    const handleFocus = (e) => { e.currentTarget.style.borderColor = 'var(--interactive-base)'; };
    const handleBlur = (e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1" style={{ color: 'var(--content-body)' }}>Name</label>
                <input
                    type="text" id="name" name="name" required
                    value={formData.name} onChange={handleChange}
                    onFocus={handleFocus} onBlur={handleBlur}
                    className="w-full rounded-md border px-4 py-2 focus:outline-none transition"
                    style={inputStyle}
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: 'var(--content-body)' }}>Email</label>
                <input
                    type="email" id="email" name="email" required
                    value={formData.email} onChange={handleChange}
                    onFocus={handleFocus} onBlur={handleBlur}
                    className="w-full rounded-md border px-4 py-2 focus:outline-none transition"
                    style={inputStyle}
                />
            </div>
            <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1" style={{ color: 'var(--content-body)' }}>Message</label>
                <textarea
                    id="message" name="message" rows="4" required
                    value={formData.message} onChange={handleChange}
                    onFocus={handleFocus} onBlur={handleBlur}
                    className="w-full rounded-md border px-4 py-2 focus:outline-none transition resize-none"
                    style={inputStyle}
                />
            </div>
            <button
                type="submit" disabled={loading}
                className="inline-flex items-center rounded-md px-6 py-2.5 text-sm font-medium focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                    backgroundColor: 'var(--interactive-base)',
                    color: 'var(--content-primary-inv)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--interactive-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--interactive-base)'}
            >
                {loading ? 'Sending...' : 'Send Message'}
            </button>
            {status.message && (
                <p className="text-sm" style={{ color: status.type === 'success' ? 'var(--accent-brand)' : 'var(--status-error)' }}>
                    {status.message}
                </p>
            )}
        </form>
    );
};

export default ContactForm;
