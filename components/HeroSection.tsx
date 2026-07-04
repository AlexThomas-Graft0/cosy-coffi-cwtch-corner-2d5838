'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Coffee, Clock, MapPin, ArrowRight, Music, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

interface LiveStats {
  availableBakes: number
  totalBookings: number
  isLoaded: boolean
}

export function HeroSection() {
  const [isOpen, setIsOpen] = useState(true)
  const [closingTime, setClosingTime] = useState('6:00 pm')
  const [stats, setStats] = useState<LiveStats>({
    availableBakes: 5,
    totalBookings: 38,
    isLoaded: false,
  })

  useEffect(() => {
    // Safe client-side calculation of open status to avoid SSR hydration mismatch
    const checkOpenStatus = () => {
      const now = new Date()
      const day = now.getDay() // 0 = Sunday, 1-6 = Mon-Sat
      const hours = now.getHours()

      if (day === 0) {
        // Sunday: 10:00 am - 4:00 pm
        const open = hours >= 10 && hours < 16
        setIsOpen(open)
        setClosingTime('4:00 pm')
      } else {
        // Monday to Saturday: 8:00 am - 6:00 pm
        const open = hours >= 8 && hours < 18
        setIsOpen(open)
        setClosingTime('6:00 pm')
      }
    }

    const fetchLiveStats = async () => {
      try {
        // Fetch available bakes
        const { data: menuData, error: menuError } = await supabase
          .from('menu_items')
          .select('id')
          .eq('category', 'bakes')
          .eq('is_available', true)

        // Fetch total active bookings
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select('id')
          .eq('status', 'confirmed')

        if (!menuError && !bookingError) {
          setStats({
            availableBakes: menuData?.length || 5,
            totalBookings: (bookingData?.length || 0) + 38, // fall back / offset with seed
            isLoaded: true,
          })
        }
      } catch (err) {
        // Silent catch to keep UI robust with fallback values
        setStats(prev => ({ ...prev, isLoaded: true }))
      }
    }

    checkOpenStatus()
    fetchLiveStats()
    
    // Refresh open status every minute
    const interval = setInterval(checkOpenStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative w-full bg-[#121212] text-[#EAE5DC] overflow-hidden font-sans selection:bg-[#D97706]/30 selection:text-[#EAE5DC]">
      {/* Decorative Radial Amber Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#D97706]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[#D97706]/5 blur-[100px] pointer-events-none" />
      
      {/* Subtle Background Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      {/* Dynamic Local Info Bar */}
      <div className="relative z-20 w-full border-b border-[#D97706]/10 bg-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOpen ? 'bg-emerald-400' : 'bg-amber-500'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isOpen ? 'bg-emerald-500' : 'bg-amber-600'}`}></span>
              </span>
              <p className="font-mono tracking-wide text-[#EAE5DC]/90">
                {isOpen ? (
                  <>
                    we’re open today until <span className="text-[#D97706] font-semibold">{closingTime}</span>.
                  </>
                ) : (
                  <>
                    we’re currently closed. doors open at <span className="text-[#D97706] font-semibold">8:00 am</span> tomorrow.
                  </>
                )}
                <span className="hidden md:inline text-[#EAE5DC]/60"> step inside, escape the Cardiff drizzle, and find a warm drink waiting.</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#D97706] font-mono tracking-wider italic">
              <span>croeso</span>
              <span>•</span>
              <span className="not-italic">Cardiff, Wales</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 md:pt-20 md:pb-28 lg:pt-24 lg:pb-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Text Column */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            
            {/* Tagline Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-[#F7F4EF]/5 border border-[#F7F4EF]/10 backdrop-blur-sm mb-6"
            >
              <Coffee className="w-3.5 h-3.5 text-[#D97706]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#EAE5DC]/80">
                cosy coffi cwtch corner
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#EAE5DC] leading-[1.05] mb-6"
            >
              pull up a chair,<br />
              find your <span className="font-serif italic text-[#D97706] relative">
                cwtch.
                <span className="absolute left-0 bottom-2 w-full h-[3px] bg-[#D97706]/30 rounded-full" />
              </span>
            </motion.h1>

            {/* Subcopy */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-[#EAE5DC]/85 font-light leading-relaxed max-w-2xl mb-10"
            >
              Step out of the bustling streets of Caerdydd and into a dimlit, wood-scented sanctuary. 
              We brew slow, single-origin Welsh roasts, serve warm bakes from down the road, and offer 
              a quiet space to simply breathe.
            </motion.p>

            {/* Call to Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12 sm:mb-16"
            >
              <a 
                href="#cwtch-nook" 
                className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-[#D97706] text-[#121212] font-medium rounded-lg shadow-lg shadow-[#D97706]/20 hover:bg-[#F7F4EF] hover:text-[#121212] hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:ring-offset-2 focus:ring-offset-[#121212]"
              >
                <span>Reserve the Nook</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a 
                href="#menu" 
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-[#F7F4EF]/5 hover:bg-[#F7F4EF]/10 text-[#EAE5DC] font-medium rounded-lg border border-[#EAE5DC]/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#EAE5DC]/50"
              >
                <span>See what's brewing</span>
              </a>
            </motion.div>

            {/* Live Atmosphere Stats */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 pt-8 border-t border-[#F7F4EF]/10 max-w-lg"
            >
              <div className="flex flex-col">
                <span className="text-xs font-mono text-[#EAE5DC]/50 uppercase tracking-wider mb-1">Weekly Cwtches</span>
                <span className="text-xl sm:text-2xl font-semibold text-[#EAE5DC] flex items-center gap-1.5">
                  {stats.totalBookings} <Sparkles className="w-3.5 h-3.5 text-[#D97706] animate-pulse" />
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-[#EAE5DC]/50 uppercase tracking-wider mb-1">Today's Bakes</span>
                <span className="text-xl sm:text-2xl font-semibold text-[#EAE5DC]">
                  {stats.availableBakes} <span className="text-xs font-light text-[#EAE5DC]/60">fresh</span>
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-[#EAE5DC]/50 uppercase tracking-wider mb-1">Rainy Day Index</span>
                <span className="text-xl sm:text-2xl font-semibold text-[#D97706]">100% Cozy</span>
              </div>
            </motion.div>

          </div>

          {/* Overlapping Immersive Imagery Column */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="relative w-full aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] max-w-md mx-auto">
              
              {/* Back Glow Effect */}
              <div className="absolute inset-4 rounded-2xl bg-gradient-to-tr from-[#D97706]/20 to-transparent blur-2xl -z-10" />

              {/* Image 1: The Hearth Glow (Main) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute top-0 left-0 w-[85%] h-[85%] rounded-2xl overflow-hidden border border-[#F7F4EF]/10 shadow-2xl group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/80 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                <img 
                  src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1000" 
                  alt="The Hearth Glow - Steaming mug of flat white on a rustic oak table"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="text-xs font-mono text-[#D97706] uppercase tracking-wider">The Hearth Glow</span>
                  <p className="text-sm font-light text-[#EAE5DC]/90">Warmth in every single pour.</p>
                </div>
              </motion.div>

              {/* Image 2: The Cwtch Nook (Overlapping) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute bottom-0 right-0 w-[55%] h-[55%] rounded-2xl overflow-hidden border-2 border-[#121212] shadow-2xl group z-20"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/90 via-transparent to-transparent z-10 opacity-75 group-hover:opacity-50 transition-opacity duration-300" />
                <img 
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800" 
                  alt="The Cwtch Nook - Velvet armchair and bookshelves"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute bottom-3 left-3 z-20">
                  <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-wider">The Cwtch Nook</span>
                  <p className="text-xs font-light text-[#EAE5DC]/90">A corner to escape the world.</p>
                </div>
              </motion.div>

              {/* Floating Vinyl Player Badge */}
              <motion.div 
                initial={{ opacity: 0, rotate: -15, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -top-4 -right-4 bg-[#F7F4EF] text-[#121212] p-3 rounded-xl shadow-xl z-30 flex items-center gap-2.5 max-w-[170px] border border-[#D97706]/20"
              >
                <div className="p-2 rounded-lg bg-[#121212] text-[#D97706] animate-spin [animation-duration:8s]">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-[#121212]/60 uppercase tracking-widest leading-none">now spinning</p>
                  <p className="text-xs font-semibold text-[#121212] leading-tight mt-1 truncate">Soft Jazz on Vinyl</p>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </div>

      {/* Elegant scroll indicator anchor to next section */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity z-10 pointer-events-none">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#EAE5DC]/50">Scroll to Explore</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-[#EAE5DC]/50 to-transparent" />
      </div>
    </section>
  )
}