'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import contentData from "@/data/content.json";
import { useCMSContent } from "@/core/CMSContentContext";

export function Contact() {
  const { content } = useCMSContent();
  const contact = content.contact || contentData.contact;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const text = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
    const encodedText = encodeURIComponent(text);
    const subject = encodeURIComponent(`Inquiry: ${formData.subject || 'New Project'}`);
    
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${encodedText}`;
  };

  return (
    <section id="contact" className="py-24 bg-black border-t border-zinc-900 text-white scroll-mt-24 md:scroll-mt-28">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16">
          <span className="text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase mb-3 block">
            {contact.tagline || 'GET IN TOUCH'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            {contact.title || 'Start a Dialogue'}
          </h2>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="flex flex-col gap-10">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold leading-tight mb-6 text-white" dangerouslySetInnerHTML={{ __html: (contact.heading || '').replace(/\n/g, '<br/>') }} />
              <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
                {contact.description}
              </p>
            </div>
            
            <div className="flex flex-col gap-6 pt-8 border-t border-zinc-850">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg shrink-0">
                  <Mail className="w-5 h-5 text-emerald-400" />
                </div>
                <a href={`mailto:${contact.email}`} className="text-base font-mono text-zinc-300 hover:text-emerald-400 transition-colors">
                  {contact.email}
                </a>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-lg shrink-0">
                  <Phone className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-mono text-zinc-300">{contact.phone}</span>
                  {contact.secondaryPhone && (
                    <span className="text-xs font-mono text-zinc-500">{contact.secondaryPhone}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-lg shrink-0">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-base font-mono text-zinc-300">{contact.location}</span>
              </div>

              {contact.responseTime && (
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-lg shrink-0">
                    <Clock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-xs font-mono text-emerald-400">{contact.responseTime}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-zinc-950 border border-zinc-850 p-8 md:p-10 rounded-xl">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-xs font-mono uppercase text-zinc-400">Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-500/50 transition-all text-sm" 
                  placeholder="John Doe"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xs font-mono uppercase text-zinc-400">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-500/50 transition-all text-sm" 
                  placeholder="john@example.com"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-xs font-mono uppercase text-zinc-400">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject" 
                  value={formData.subject}
                  onChange={handleChange}
                  className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-500/50 transition-all text-sm" 
                  placeholder="Project Inquiry"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-xs font-mono uppercase text-zinc-400">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-500/50 transition-all text-sm resize-y" 
                  placeholder="Tell us about your project requirements..."
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="mt-2 w-full py-3.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center space-x-2 text-xs"
              >
                <span>Send Message</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
