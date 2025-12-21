import React from 'react';
import { Link } from 'react-router-dom';
import {
    LuSparkles,
    LuMail,
    LuMapPin,
    LuPhone,
    LuTwitter,
    LuInstagram,
    LuLinkedin,
    LuGithub
} from 'react-icons/lu';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative z-10 border-t border-white/[0.08] bg-gradient-to-b from-transparent to-black/30">
            <div className="max-w-7xl mx-auto px-8 lg:px-16 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-3 mb-6 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <LuSparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight font-['Outfit'] bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                                LUXBID
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Your premier destination for exclusive online auctions. Discover rare collectibles
                            and luxury items from verified sellers worldwide.
                        </p>
                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            <SocialLink href="https://twitter.com" icon={<LuTwitter className="w-4 h-4" />} label="Twitter" />
                            <SocialLink href="https://instagram.com" icon={<LuInstagram className="w-4 h-4" />} label="Instagram" />
                            <SocialLink href="https://linkedin.com" icon={<LuLinkedin className="w-4 h-4" />} label="LinkedIn" />
                            <SocialLink href="https://github.com" icon={<LuGithub className="w-4 h-4" />} label="GitHub" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Quick Links</h4>
                        <ul className="space-y-3">
                            <FooterLink to="/auctions">Browse Auctions</FooterLink>
                            <FooterLink to="/register">Create Account</FooterLink>
                            <FooterLink to="/login">Sign In</FooterLink>
                            <FooterLink to="/seller/login">Seller Portal</FooterLink>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Company</h4>
                        <ul className="space-y-3">
                            <FooterLink to="#">About Us</FooterLink>
                            <FooterLink to="#">How It Works</FooterLink>
                            <FooterLink to="#">Trust & Safety</FooterLink>
                            <FooterLink to="#">Careers</FooterLink>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-slate-400 text-sm">
                                <LuMapPin className="w-4 h-4 mt-0.5 text-cyan-400 flex-shrink-0" />
                                <span>123 Auction Street,<br />San Francisco, CA 94102</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-400 text-sm">
                                <LuMail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                                <a href="mailto:hello@luxbid.com" className="hover:text-white transition-colors">
                                    hello@luxbid.com
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-slate-400 text-sm">
                                <LuPhone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                                <a href="tel:+1234567890" className="hover:text-white transition-colors">
                                    +1 (234) 567-890
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm">
                        © {currentYear} LUXBID. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link to="#" className="text-slate-500 hover:text-white text-sm transition-colors">
                            Privacy Policy
                        </Link>
                        <Link to="#" className="text-slate-500 hover:text-white text-sm transition-colors">
                            Terms of Service
                        </Link>
                        <Link to="#" className="text-slate-500 hover:text-white text-sm transition-colors">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialLink = ({ href, icon, label }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.1] hover:border-cyan-500/50 transition-all duration-300"
    >
        {icon}
    </a>
);

const FooterLink = ({ to, children }) => (
    <li>
        <Link
            to={to}
            className="text-slate-400 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
        >
            {children}
        </Link>
    </li>
);

export default Footer;
