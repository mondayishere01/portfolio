import React, { useEffect, useState } from 'react';
import { getSettings } from '../api';

const Footer = () => {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        getSettings()
            .then(res => setSettings(res.data))
            .catch(() => { });
    }, []);

    const footerText = settings?.footerText || "Designed in Figma and coded in VS Code. Built with React and Tailwind CSS.";
    const copyrightText = settings?.copyrightText || "Devesh. All rights reserved.";

    return (
        <footer className="max-w-md pb-4 pt-8 text-xs text-slate-500 sm:pb-0 text-center lg:text-left">
            <p className="leading-relaxed whitespace-pre-line">
                {footerText}
            </p>
            <p className="mt-2 text-slate-600">
                &copy; {new Date().getFullYear()} {copyrightText}
            </p>
        </footer>
    );
};

export default Footer;
