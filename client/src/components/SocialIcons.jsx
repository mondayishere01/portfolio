import React from 'react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

const socials = [
    { name: 'GitHub', href: '#', icon: Github },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'Email', href: 'mailto:your@email.com', icon: Mail },
];

const SocialIcons = () => {
    return (
        <ul className="ml-1 mt-8 flex items-center gap-5" aria-label="Social media">
            {socials.map((social) => (
                <li key={social.name}>
                    <a
                        className="block text-slate-400 hover:text-slate-200 transition"
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={social.name}
                    >
                        <social.icon size={20} />
                    </a>
                </li>
            ))}
        </ul>
    );
};

export default SocialIcons;
