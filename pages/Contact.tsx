
import React, { useState } from 'react';
import { refineContactMessage } from '../services/geminiService';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsLoading(true);

    try {
      const refinedMessage = await refineContactMessage(message);
      const subject = encodeURIComponent(`Inquiry from ${name}`);
      const body = encodeURIComponent(refinedMessage);
      const mailtoLink = `mailto:vaishu020905@gmail.com?subject=${subject}&body=${body}`;
      
      // Use a temporary anchor tag for better browser compatibility with mailto
      const link = document.createElement('a');
      link.href = mailtoLink;
      link.click();
    } catch (error) {
      console.error("Error in contact form:", error);
      // Fallback to original message if refinement fails
      const mailtoLink = `mailto:vaishu020905@gmail.com?subject=Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}`;
      window.location.href = mailtoLink;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contact-page container fade-in">
        <header className="contact-header text-center">
            <h1 className="slide-up-fade-in">Get In Touch</h1>
            <p className="slide-up-fade-in" style={{animationDelay: '0.2s'}}>
            We'd love to hear from you. Use the form below, and our AI assistant will help refine your message before opening your email client.
            </p>
        </header>

        <div className="form-container slide-up-fade-in" style={{animationDelay: '0.4s'}}>
            <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="name">Your Name</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="input" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Your Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="message">Your Message</label>
                    <textarea
                        id="message"
                        rows={8}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        placeholder="Questions about an artwork, a commission inquiry, or just a friendly hello..."
                        className="textarea"
                    />
                </div>
                <div className="text-center">
                    <button type="submit" className="button button-primary" disabled={isLoading}>
                    {isLoading ? 'Refining...' : 'Refine & Send'}
                    </button>
                </div>
            </form>
        </div>
        {/* FIX: Removed invalid 'jsx' prop from style tag. */}
        <style>{`
            .contact-page { padding: 4rem 2rem; }
            .contact-header { margin-bottom: 4rem; }
            .contact-header h1 { font-size: 3rem; }
            .contact-header p { font-size: 1.2rem; color: var(--secondary); max-width: 600px; margin: 1rem auto 0; }
            
            .form-container {
                max-width: 800px;
                margin: 0 auto;
                background: var(--white);
                padding: 3rem;
                border-radius: 12px;
                border: 1px solid var(--border);
                box-shadow: var(--shadow);
            }

            .form-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 1.5rem;
                margin-bottom: 1.5rem;
            }
            @media (min-width: 768px) {
                .form-grid { grid-template-columns: 1fr 1fr; }
            }
            
            .form-group {
                display: flex;
                flex-direction: column;
            }
            .form-group label {
                margin-bottom: 0.5rem;
                font-weight: 600;
                color: var(--primary);
            }

            .contact-form .button {
                width: 100%;
                max-width: 300px;
                margin-top: 1rem;
            }
        `}</style>
    </div>
  );
};

export default Contact;
