'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Footprints, Bus, Car, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Enquiry',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const subjects = [
    'General Enquiry',
    'Small Group Booking',
    'Special Request',
    'Feedback'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const { error } = await supabase
        .withSchema('cosy_coffi_cwtch_corner_2d5838')
        .from('enquiries')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            is_resolved: false
          }
        ]);

      if (error) throw error;

      setStatus('success');
      setFormData({ name: '', email: '', subject: 'General Enquiry', message: '' });
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section 
      id="contact" 
      className="relative bg-[#F7F4EF] text-[#3E2B1E] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans"
    >
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#E9E3DD] rounded-full filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D97706]/10 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9E3DD] text-[#5D4432] text-xs font-semibold tracking-wider uppercase mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            Find Your Cwtch
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#3E2B1E] mb-6 font-display"
          >
            come on in out of the rain.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-[#3E2B1E]/80 leading-relaxed"
          >
            We are tucked away just off the beaten path, ready to welcome you with a warm mug.
          </motion.p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Info & Transit */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 space-y-8"
          >
            {/* Location & Hours Card */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgba(93,68,50,0.04)] border border-[#E9E3DD]/60 relative overflow-hidden group hover:shadow-[0_8px_40px_rgba(93,68,50,0.08)] transition-all duration-350">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D97706]/5 rounded-bl-full transition-all duration-350 group-hover:scale-110" />
              
              <div className="flex items-start gap-4 mb-8">
                <div className="p-3 bg-[#F7F4EF] rounded-2xl text-[#D97706] shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-[#5D4432] mb-1">Where to Find Us</h3>
                  <p className="text-lg font-bold text-[#3E2B1E] leading-snug">
                    12 Cwtch Lane,<br />
                    Caerdydd (Cardiff), CF10 1UX
                  </p>
                </div>
              </div>

              <hr className="border-[#E9E3DD]/60 my-6" />

              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#F7F4EF] rounded-2xl text-[#5D4432] shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-[#5D4432] mb-1">Opening Hours</h3>
                  <div className="space-y-1 text-[#3E2B1E]/90">
                    <p className="flex justify-between gap-8">
                      <span className="font-medium">Monday to Saturday:</span>
                      <span className="font-bold">8:00 am – 6:00 pm</span>
                    </p>
                    <p className="flex justify-between gap-8">
                      <span className="font-medium">Sunday:</span>
                      <span className="font-bold">10:00 am – 4:00 pm</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transit Tips */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#3E2B1E] px-2 flex items-center gap-2">
                <span>Getting Here</span>
                <span className="text-xs font-normal text-[#3E2B1E]/60">(Transit Tips)</span>
              </h3>

              <div className="space-y-3">
                {/* By Foot */}
                <div className="flex gap-4 p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-[#E9E3DD]/40 hover:bg-white transition-all duration-200">
                  <div className="p-2.5 bg-[#E9E3DD]/50 rounded-xl text-[#3E2B1E] shrink-0 h-10 w-10 flex items-center justify-center">
                    <Footprints className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#3E2B1E] mb-1">By Foot</h4>
                    <p className="text-sm text-[#3E2B1E]/85 leading-relaxed">
                      We are a gentle 10-minute walk from Cardiff Central Station. Just head down the high street, turn past the old library, and look for our low-lit amber lantern glowing in the lane.
                    </p>
                  </div>
                </div>

                {/* By Bus */}
                <div className="flex gap-4 p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-[#E9E3DD]/40 hover:bg-white transition-all duration-200">
                  <div className="p-2.5 bg-[#E9E3DD]/50 rounded-xl text-[#3E2B1E] shrink-0 h-10 w-10 flex items-center justify-center">
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#3E2B1E] mb-1">By Bus</h4>
                    <p className="text-sm text-[#3E2B1E]/85 leading-relaxed">
                      The nearest stops are on Castle Street, serviced by the 27, 44, and 57 buses. All are within a 3-minute walk of our front door.
                    </p>
                  </div>
                </div>

                {/* By Car */}
                <div className="flex gap-4 p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-[#E9E3DD]/40 hover:bg-white transition-all duration-200">
                  <div className="p-2.5 bg-[#E9E3DD]/50 rounded-xl text-[#3E2B1E] shrink-0 h-10 w-10 flex items-center justify-center">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#3E2B1E] mb-1">By Car</h4>
                    <p className="text-sm text-[#3E2B1E]/85 leading-relaxed">
                      While we encourage walking or public transport to keep our lane quiet, there is short-stay pay-and-display parking available at the nearby St. David's center, just a 5-minute walk away.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Enquiry Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-7"
          >
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-[0_8px_30px_rgba(93,68,50,0.04)] border border-[#E9E3DD]/60">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-[#3E2B1E] mb-2">Say Hello</h3>
                <p className="text-sm text-[#3E2B1E]/70">
                  Use this form if you have general questions, want to inquire about hosting a small book club, or would like to discuss private hire of our dimlit space for quiet evening gatherings.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Full Name & Email Field Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-[#5D4432] mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      placeholder="e.g., Dylan Evans"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3.5 bg-[#F7F4EF]/50 hover:bg-[#F7F4EF]/80 focus:bg-white rounded-xl border border-[#E9E3DD] focus:border-[#5D4432] focus:ring-2 focus:ring-[#5D4432]/20 outline-none transition-all duration-200 text-[#3E2B1E] placeholder-[#3E2B1E]/40"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#5D4432] mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      placeholder="e.g., dylan@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3.5 bg-[#F7F4EF]/50 hover:bg-[#F7F4EF]/80 focus:bg-white rounded-xl border border-[#E9E3DD] focus:border-[#5D4432] focus:ring-2 focus:ring-[#5D4432]/20 outline-none transition-all duration-200 text-[#3E2B1E] placeholder-[#3E2B1E]/40"
                    />
                  </div>
                </div>

                {/* Subject Dropdown */}
                <div>
                  <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-[#5D4432] mb-2">
                    Subject
                  </label>
                  <div className="relative">
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3.5 bg-[#F7F4EF]/50 hover:bg-[#F7F4EF]/80 focus:bg-white rounded-xl border border-[#E9E3DD] focus:border-[#5D4432] focus:ring-2 focus:ring-[#5D4432]/20 outline-none transition-all duration-200 text-[#3E2B1E] appearance-none cursor-pointer"
                    >
                      {subjects.map((subj) => (
                        <option key={subj} value={subj} className="text-[#3E2B1E]">
                          {subj}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#5D4432]">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Message Textarea */}
                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-[#5D4432] mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    placeholder="Write your message here... we look forward to reading it."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3.5 bg-[#F7F4EF]/50 hover:bg-[#F7F4EF]/80 focus:bg-white rounded-xl border border-[#E9E3DD] focus:border-[#5D4432] focus:ring-2 focus:ring-[#5D4432]/20 outline-none transition-all duration-200 text-[#3E2B1E] placeholder-[#3E2B1E]/40 resize-none"
                  />
                </div>

                {/* Feedback Messages */}
                <AnimatePresence mode="wait">
                  {status === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-sm">Diolch! Message sent successfully.</p>
                        <p className="text-xs text-emerald-700/90 mt-0.5">We'll get back to you as soon as we put down our warm mugs.</p>
                      </div>
                    </motion.div>
                  )}

                  {status === 'error' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-red-50 rounded-xl border border-red-200 text-red-800 flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-sm">Unable to send message.</p>
                        <p className="text-xs text-red-700/90 mt-0.5">{errorMessage}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-4 px-6 bg-[#5D4432] hover:bg-[#3E2B1E] active:bg-[#2c1d14] text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#5D4432]/10 disabled:opacity-50 disabled:cursor-not-allowed group focus:ring-2 focus:ring-offset-2 focus:ring-[#5D4432]"
                >
                  {status === 'submitting' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending your message...
                    </>
                  ) : (
                    <>
                      Send your message
                      <Send className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>

              </form>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}