'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

export function Footer() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Insert as an enquiry with subject 'Newsletter Subscription'
      const { error } = await supabase
        .from('enquiries')
        .insert([
          {
            name: name.trim() || 'Anonymous Reader',
            email: email.trim(),
            subject: 'Newsletter Subscription',
            message: 'Subscribed to the slow letters newsletter from the website footer.',
            is_resolved: false,
          },
        ]);

      if (error) throw error;

      setSubmitStatus('success');
      setEmail('');
      setName('');
    } catch (err: any) {
      console.error('Newsletter subscription error:', err);
      setSubmitStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative overflow-hidden bg-[#121212] font-sans text-[#EAE5DC] selection:bg-[#D97706]/30 selection:text-white border-t border-[#EAE5DC]/10">
      {/* Soft Ambient Glow simulating our dimlit lamps */}
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-[#D97706] opacity-[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute top-12 left-10 h-[300px] w-[300px] rounded-full bg-[#5D4432] opacity-[0.05] blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Brand & Philosophy Column */}
          <div className="space-y-6 lg:col-span-4">
            <div className="flex items-center space-x-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#D97706] animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#D97706]">
                caerdydd · cardiff
              </span>
            </div>
            
            <a 
              href="#" 
              className="inline-block focus:outline-none focus:ring-2 focus:ring-[#D97706]/40 rounded"
              aria-label="cosy coffi cwtch corner home"
            >
              <h2 className="text-2xl font-light tracking-tight text-[#F7F4EF]">
                cosy coffi <span className="font-semibold text-[#D97706]">cwtch</span> corner
              </h2>
            </a>

            <p className="max-w-sm text-sm leading-relaxed text-[#EAE5DC]/70">
              Step out of the bustling streets of Caerdydd and into a dimlit, wood-scented sanctuary. 
              We brew slow, single-origin Welsh roasts and offer a quiet space to simply breathe.
            </p>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-mono uppercase tracking-wider text-[#EAE5DC]/50">Find our sanctuary</p>
              <p className="text-sm text-[#EAE5DC]/80 font-light leading-relaxed">
                12 Cwtch Lane,<br />
                Caerdydd (Cardiff), CF10 1UX
              </p>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-2">
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#D97706] font-semibold">
              Explore
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Our Menu', href: '#menu' },
                { label: 'The Cwtch Nook', href: '#cwtch-nook' },
                { label: 'Our Space', href: '#our-space' },
                { label: 'Contact', href: '#contact' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group flex items-center text-[#EAE5DC]/70 transition-colors duration-200 hover:text-[#F7F4EF] focus:outline-none focus:text-[#F7F4EF]"
                  >
                    <span className="mr-0 max-w-0 overflow-hidden text-[#D97706] transition-all duration-300 group-hover:mr-2 group-hover:max-w-[10px] group-focus:mr-2 group-focus:max-w-[10px]">
                      ·
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours Column */}
          <div className="space-y-4 sm:col-span-3 lg:col-span-3">
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#D97706] font-semibold flex items-center gap-2">
              Opening Hours
            </h3>
            <div className="space-y-3 text-sm text-[#EAE5DC]/70">
              <div className="flex justify-between border-b border-[#EAE5DC]/5 pb-1">
                <span className="font-light">Monday – Saturday</span>
                <span className="font-mono text-xs text-[#EAE5DC]/90">8:00 am – 6:00 pm</span>
              </div>
              <div className="flex justify-between border-b border-[#EAE5DC]/5 pb-1">
                <span className="font-light">Sunday</span>
                <span className="font-mono text-xs text-[#EAE5DC]/90">10:00 am – 4:00 pm</span>
              </div>
              <div className="mt-4 rounded-md bg-[#222B24]/40 p-3 border border-[#222B24] flex items-start gap-2.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1 flex-shrink-0 animate-pulse" />
                <p className="text-xs text-emerald-400/90 leading-tight">
                  we’re open today until 6:00 pm. step inside, escape the Cardiff drizzle, and find a warm drink waiting. <span className="italic font-semibold">croeso.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Slow Letters Newsletter Column */}
          <div className="space-y-4 lg:col-span-3">
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#D97706] font-semibold">
              Slow Letters
            </h3>
            <p className="text-xs leading-relaxed text-[#EAE5DC]/60">
              Dispatches on books we are reading, records we are spinning, and warm bakes fresh from our Cardiff oven.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
              <div className="relative">
                <label htmlFor="footer-name" className="sr-only">Your Name</label>
                <input
                  id="footer-name"
                  type="text"
                  placeholder="Your name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-[#EAE5DC]/10 bg-[#1C1917] px-3.5 py-1.5 text-xs text-[#F7F4EF] placeholder-[#EAE5DC]/40 focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] transition-colors"
                />
              </div>

              <div className="relative flex items-center">
                <label htmlFor="footer-email" className="sr-only">Email address</label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-[#EAE5DC]/10 bg-[#1C1917] px-3.5 py-1.5 text-xs text-[#F7F4EF] placeholder-[#EAE5DC]/40 focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="absolute right-1 top-1 bottom-1 rounded bg-[#D97706] px-3 text-xs font-semibold text-[#121212] transition-colors hover:bg-[#D97706]/90 focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:ring-offset-2 focus:ring-offset-[#121212] disabled:opacity-50"
                >
                  {isSubmitting ? '...' : 'Join'}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {submitStatus === 'success' && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-emerald-400 font-light mt-1"
                  >
                    Welcome to the circle. Look out for our next letter.
                  </motion.p>
                )}
                {submitStatus === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-rose-400 font-light mt-1"
                  >
                    {errorMessage || 'Failed to subscribe. Please try again.'}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </div>

        </div>

        {/* Small Ambient Image Grid in Footer to ground the physical sanctuary feeling */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-[#EAE5DC]/5 pt-12">
          <div className="group relative overflow-hidden rounded-lg aspect-[4/3] bg-stone-900">
            <img 
              src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=300&q=80" 
              alt="Hearth Glow flat white" 
              className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-2">
              <p className="text-[10px] font-mono tracking-wider text-[#EAE5DC]">The Hearth Glow</p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-lg aspect-[4/3] bg-stone-900">
            <img 
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=80" 
              alt="The Cwtch Nook reading corner" 
              className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-2">
              <p className="text-[10px] font-mono tracking-wider text-[#EAE5DC]">The Honesty Library</p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-lg aspect-[4/3] bg-stone-900">
            <img 
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80" 
              alt="Warm conversations" 
              className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-2">
              <p className="text-[10px] font-mono tracking-wider text-[#EAE5DC]">Soft Shadows</p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-lg aspect-[4/3] bg-stone-900">
            <img 
              src="https://images.unsplash.com/photo-1511100973136-d81143c78d58?auto=format&fit=crop&w=300&q=80" 
              alt="A bookshelf of old novels" 
              className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-2">
              <p className="text-[10px] font-mono tracking-wider text-[#EAE5DC]">Quiet Solitude</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-[#EAE5DC]/5 pt-8 sm:flex-row gap-4">
          <p className="text-xs text-[#EAE5DC]/40 font-light text-center sm:text-left">
            &copy; 2025 cosy coffi cwtch corner. Grounded in Caerdydd. All rights reserved.
          </p>

          {/* Bilingual Welsh Signoff */}
          <div className="flex items-center space-x-1.5 text-xs text-[#EAE5DC]/50">
            <span className="font-light">hemlock &amp; honeyed espresso</span>
            <span className="text-[#D97706] font-semibold">·</span>
            <span className="font-mono tracking-widest uppercase text-[#D97706]/80 text-[10px]">mwynhewch y broses</span>
          </div>

          {/* Social / Extra Links */}
          <div className="flex space-x-6">
            <a 
              href="#menu" 
              className="text-xs text-[#EAE5DC]/40 hover:text-[#D97706] transition-colors focus:outline-none focus:text-[#D97706]"
            >
              Menu
            </a>
            <a 
              href="#cwtch-nook" 
              className="text-xs text-[#EAE5DC]/40 hover:text-[#D97706] transition-colors focus:outline-none focus:text-[#D97706]"
            >
              The Nook
            </a>
            <a 
              href="#contact" 
              className="text-xs text-[#EAE5DC]/40 hover:text-[#D97706] transition-colors focus:outline-none focus:text-[#D97706]"
            >
              Contact
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}