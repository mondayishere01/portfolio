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

module.exports = { sendContactNotification };
