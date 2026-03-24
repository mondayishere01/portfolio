import React, { useEffect, useState } from 'react';
import { Github, Linkedin, Twitter, Instagram, Mail, Globe } from 'lucide-react';
import { getAbout } from '../api';

const ICON_MAP = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    instagram: Instagram,
    email: Mail,
    website: Globe,
};

const SocialIcons = () => {
    const [links, setLinks] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await getAbout();
                if (data?.socialLinks) setLinks(data.socialLinks);
            } catch { /* ignore */ }
        };
        fetch();
    }, []);

    if (links.length === 0) return null;

    return (
        <ul className="ml-1 mt-8 flex items-center gap-5" aria-label="Social media">
            {links.map((link, i) => {
                const platform = link.platform.toLowerCase();
                const Icon = ICON_MAP[platform] || Globe;
                const href = platform === 'email' ? `mailto:${link.url}` : link.url;
                return (
                    <li key={i}>
                        <a
                            className="block text-slate-400 hover:text-slate-200 transition"
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={link.platform}
                        >
                            <Icon size={20} />
                        </a>
                    </li>
                );
            })}
        </ul>
    );
};

export default SocialIcons;
