'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll to apply backdrop filter & border
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'our story', href: '#story' },
    { name: 'menu', href: '#menu' },
    { name: 'the cwtch nook', href: '#nook' },
    { name: 'the space', href: '#space' },
    { name: 'find us', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full font-sans">
      {/* 1. Dynamic Local Info Bar */}
      <div className="w-full bg-[#D97706] text-[#121212] px-4 py-2.5 text-center text-xs md:text-sm font-medium tracking-wide shadow-inner relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span className="inline-block w-2 h-2 rounded-full bg-[#121212] animate-pulse" />
          <span>
            <strong>we’re open today until 6:00 pm.</strong> step inside, escape the Cardiff drizzle, and find a warm drink waiting. <span className="italic font-semibold">croeso.</span>
          </span>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 border-b ${
          scrolled
            ? 'bg-[#121212]/90 backdrop-blur-md border-neutral-800/40 py-3 shadow-lg shadow-black/20'
            : 'bg-[#121212] border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo / Brand */}
            <a 
              href="#" 
              className="group flex flex-col items-start focus:outline-none focus:ring-2 focus:ring-[#D97706] rounded-md px-2 py-1"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl font-bold tracking-tight text-[#EAE5DC] group-hover:text-[#D97706] transition-colors duration-200">
                  cosy coffi cwtch corner
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D97706]/80 group-hover:text-[#D97706] transition-colors duration-200">
                Caerdydd • Cardiff
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium tracking-wide text-[#EAE5DC]/80 hover:text-[#EAE5DC] relative py-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#D97706] after:scale-x-0 hover:after:scale-x-100 after:origin-right hover:after:origin-left after:transition-transform after:duration-300 transition-colors focus:outline-none focus:text-[#EAE5DC]"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href="#nook"
                className="relative inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold tracking-wider text-[#121212] bg-[#D97706] rounded-full overflow-hidden group transition-all duration-300 hover:bg-[#D97706]/90 active:scale-95 shadow-md shadow-[#D97706]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121212] focus:ring-[#D97706]"
              >
                <span className="relative z-10">Reserve the Nook</span>
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-[#EAE5DC] hover:text-[#D97706] hover:bg-neutral-900/50 focus:outline-none focus:ring-2 focus:ring-[#D97706] transition-all"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
                aria-label="Toggle main menu"
              >
                <span className="sr-only">Open main menu</span>
                <div className="w-6 h-6 flex flex-col justify-around">
                  <span
                    className={`block h-0.5 w-6 rounded bg-current transform transition-transform duration-300 ${
                      isOpen ? 'rotate-45 translate-y-[7px]' : ''
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-6 rounded bg-current transition-opacity duration-300 ${
                      isOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-6 rounded bg-current transform transition-transform duration-300 ${
                      isOpen ? '-rotate-45 -translate-y-[7px]' : ''
                    }`}
                  />
                </div>
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              id="mobile-menu"
              className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-[#121212] border-l border-neutral-850 z-50 p-6 flex flex-col justify-between shadow-2xl md:hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-[#EAE5DC]">
                      cwtch corner
                    </span>
                    <span className="text-[9px] font-mono tracking-widest text-[#D97706]">
                      CAERDYDD
                    </span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 -mr-2 text-[#EAE5DC] hover:text-[#D97706] focus:outline-none focus:ring-2 focus:ring-[#D97706] rounded-md"
                    aria-label="Close menu"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mt-8 flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium tracking-wide text-[#EAE5DC] hover:text-[#D97706] transition-colors duration-200 py-1 border-b border-neutral-900/50"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-neutral-800">
                <a
                  href="#nook"
                  onClick={() => setIsOpen(false)}
                  className="w-full inline-flex items-center justify-center px-5 py-3 text-sm font-semibold tracking-wider text-[#121212] bg-[#D97706] rounded-xl hover:bg-[#D97706]/90 transition-all text-center focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                >
                  Reserve the Nook
                </a>
                <p className="text-center text-[11px] text-neutral-500 mt-4 tracking-wide">
                  12 Cwtch Lane, Caerdydd (Cardiff)
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}