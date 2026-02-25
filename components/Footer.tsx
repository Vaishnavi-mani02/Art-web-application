
import React from 'react';
import { useAppStore } from '../store/store';
import { Instagram, ShieldCheck } from 'lucide-react';

const Footer: React.FC = () => {
    const { setView } = useAppStore();
    
    return (
        <footer className="footer">
            <div className="container footer-grid">
                {/* Brand Column */}
                <div className="footer-col brand-col">
                    <h2 className="footer-logo">
                        <span className="nebula-text">Nebula's</span> <span className="art-text">Art</span> <span className="gallery-text">Gallery</span>
                    </h2>
                    <p className="footer-quote">
                        "Capturing the ethereal beauty of the universe in every brushstroke."
                    </p>
                    <a 
                        href="https://instagram.com/VAISHU_ARTSNGIFTZ" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="instagram-button"
                    >
                        <Instagram size={20} />
                        <span>@VAISHU_ARTSNGIFTZ</span>
                    </a>
                </div>

                {/* Curations Column */}
                <div className="footer-col">
                    <h4 className="footer-heading">CURATIONS</h4>
                    <ul className="footer-links">
                        <li><button onClick={() => setView('collection')}>Full Collection</button></li>
                        <li><button onClick={() => setView('collection')}>Paintings</button></li>
                        <li><button onClick={() => setView('collection')}>Sketches</button></li>
                        <li><button onClick={() => setView('collection')}>Digital Art</button></li>
                        <li><button onClick={() => setView('collection')}>Handmade Keychains</button></li>
                        <li><button onClick={() => setView('contact')}>Commission</button></li>
                    </ul>
                </div>

                {/* Contact Column */}
                <div className="footer-col">
                    <h4 className="footer-heading">CONTACT</h4>
                    <div className="contact-info">
                        <p className="location">Chennai, TN</p>
                        <p className="email">vaishu020905@gmail.com</p>
                        <div className="verified-badge">
                            <ShieldCheck size={18} />
                            <span>BANK VERIFIED GALLERY</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <p>© {new Date().getFullYear()} NEBULA'S ART GALLERY • AUTHENTIC SOUL-CRAFTED ART</p>
                </div>
            </div>

            <style>{`
                .footer {
                    background-color: #050505;
                    color: var(--white);
                    padding: 8rem 0 4rem;
                    margin-top: 6rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }
                .footer-grid {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr 1fr;
                    gap: 6rem;
                    margin-bottom: 6rem;
                }
                @media (max-width: 968px) {
                    .footer-grid {
                        grid-template-columns: 1fr;
                        gap: 4rem;
                        text-align: center;
                    }
                }
                
                .footer-logo {
                    font-family: var(--font-serif);
                    font-size: 2.8rem;
                    font-weight: 300;
                    margin-bottom: 2rem;
                    letter-spacing: -0.02em;
                }
                .footer-logo .nebula-text {
                    color: var(--white);
                    font-weight: 300;
                }
                .footer-logo .art-text {
                    color: var(--accent);
                    font-weight: 400;
                    font-style: italic;
                }
                .footer-logo .gallery-text {
                    color: var(--white);
                    font-weight: 300;
                    opacity: 0.9;
                }
                
                .footer-quote {
                    font-family: var(--font-serif);
                    font-style: italic;
                    font-size: 1.2rem;
                    color: rgba(255, 255, 255, 0.5);
                    max-width: 400px;
                    margin-bottom: 3rem;
                    line-height: 1.8;
                    font-weight: 300;
                }
                @media (max-width: 968px) {
                    .footer-quote {
                        margin-left: auto;
                        margin-right: auto;
                    }
                }

                .instagram-button {
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: var(--white);
                    padding: 10px 24px;
                    border-radius: 100px;
                    text-decoration: none;
                    font-weight: 400;
                    font-size: 0.8rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .instagram-button:hover {
                    background-color: var(--white);
                    color: #050505;
                    border-color: var(--white);
                    transform: translateY(-2px);
                }

                .footer-heading {
                    font-size: 0.7rem;
                    letter-spacing: 0.3em;
                    color: rgba(255, 255, 255, 0.3);
                    margin-bottom: 2.5rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .footer-links {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .footer-links li {
                    margin-bottom: 1.2rem;
                }
                .footer-links button {
                    background: none;
                    border: none;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 0.95rem;
                    cursor: pointer;
                    padding: 0;
                    transition: all 0.3s ease;
                    font-family: var(--font-sans);
                    font-weight: 300;
                }
                .footer-links button:hover {
                    color: var(--white);
                    padding-left: 8px;
                }

                .contact-info .location {
                    font-size: 1.2rem;
                    font-weight: 300;
                    margin-bottom: 1rem;
                    font-family: var(--font-serif);
                    letter-spacing: 0.02em;
                }
                .contact-info .email {
                    color: var(--accent);
                    font-size: 1rem;
                    margin-bottom: 3rem;
                    font-weight: 400;
                    letter-spacing: 0.05em;
                }

                .verified-badge {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: rgba(255, 255, 255, 0.2);
                    font-size: 0.65rem;
                    letter-spacing: 0.2em;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                @media (max-width: 968px) {
                    .verified-badge {
                        justify-content: center;
                    }
                }

                .footer-bottom {
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    padding-top: 4rem;
                    text-align: center;
                    font-size: 0.65rem;
                    letter-spacing: 0.2em;
                    color: rgba(255, 255, 255, 0.3);
                    text-transform: uppercase;
                }
            `}</style>
        </footer>
    );
};

export default Footer;
