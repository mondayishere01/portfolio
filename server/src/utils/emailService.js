const nodemailer = require('nodemailer');

/**
 * Send an email notification to the admin when a new contact message is received.
 * Gracefully degrades — logs errors but never throws.
 */
const sendContactNotification = async ({ name, email, message, notifyEmail }) => {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass || !notifyEmail) {
        console.log('[Email] SMTP not configured or no notifyEmail set — skipping notification.');
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            host,
            port: Number(port) || 587,
            secure: Number(port) === 465,
            auth: { user, pass },
        });

        const htmlBody = `
            <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
                <h2 style="color: #0f172a;">New Contact Message</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px 0; color: #64748b; width: 80px;">From</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${name}</td></tr>
                    <tr><td style="padding: 8px 0; color: #64748b;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #0d9488;">${email}</a></td></tr>
                </table>
                <div style="margin-top: 16px; padding: 16px; background: #f1f5f9; border-radius: 8px; color: #334155; line-height: 1.6;">
                    ${message.replace(/\n/g, '<br>')}
                </div>
                <p style="margin-top: 24px; font-size: 12px; color: #94a3b8;">This notification was sent from your portfolio contact form.</p>
            </div>
        `;

        await transporter.sendMail({
            from: `"Portfolio Contact" <${user}>`,
            to: notifyEmail,
            subject: `New message from ${name}`,
            html: htmlBody,
            replyTo: email,
        });

        console.log(`[Email] Notification sent to ${notifyEmail}`);
    } catch (err) {
        console.error('[Email] Failed to send notification:', err.message);
    }
};

/**
 * Broadcast a new blog post to all active subscribers.
 */
const sendBlogBroadcast = async (blog, subscribers, baseUrl) => {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const port = process.env.SMTP_PORT;

    if (!host || !user || !pass || !subscribers.length) return;

    try {
        const transporter = nodemailer.createTransport({
            host,
            port: Number(port) || 587,
            secure: Number(port) === 465,
            auth: { user, pass },
        });

        // Use provided baseUrl or fallback to env/localhost
        const finalBaseUrl = (baseUrl || process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
        const blogUrl = `${finalBaseUrl}/blog/${blog._id}`;

        for (const sub of subscribers) {
            const htmlBody = `
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1);">
                    <div style="margin-bottom: 32px;">
                        <span style="background: rgba(255,235,0,0.1); color: #ffeb00; padding: 4px 12px; border-radius: 100px; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">New Post Published</span>
                    </div>
                    <h1 style="font-size: 32px; font-weight: 900; line-height: 1.2; margin-bottom: 24px; color: #fff;">${blog.title}</h1>
                    ${blog.imageUrl ? `<img src="${blog.imageUrl}" style="width: 100%; border-radius: 16px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.05);" />` : ''}
                    <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
                        I've just published a new article on my portfolio. Dive in to explore the latest insights and technical deep-dives.
                    </p>
                    <a href="${blogUrl}" style="background: #ffeb00; color: #000; padding: 16px 32px; border-radius: 100px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">Read Full Article</a>
                    <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
                        <p style="font-size: 12px; color: #475569;">You're receiving this because you subscribed to Devesh's newsletter.</p>
                        <a href="${blogUrl}/#unsubscribe" style="color: #475569; font-size: 12px;">Unsubscribe</a>
                    </div>
                </div>
            `;

            await transporter.sendMail({
                from: `"Devesh Pandey" <${user}>`,
                to: sub.email,
                subject: `New Blog: ${blog.title}`,
                html: htmlBody,
            });
        }
        console.log(`[Email] Broadcast sent to ${subscribers.length} subscribers.`);
    } catch (err) {
        console.error('[Email] Broadcast failed:', err.message);
    }
};

module.exports = { sendContactNotification, sendBlogBroadcast };
