'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { 
  Coffee, 
  BookOpen, 
  Disc, 
  Compass, 
  Quote, 
  Wind,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string;
  display_order: number;
}

const FALLBACK_GALLERY: GalleryItem[] = [
  {
    id: '1',
    image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    caption: 'The Hearth Glow. A steaming ceramic mug of flat white resting on a rustic oak table.',
    display_order: 1
  },
  {
    id: '2',
    image_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
    caption: 'The Cwtch Nook. Cushions piled deep under a warm reading light.',
    display_order: 2
  },
  {
    id: '3',
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    caption: 'Soft shadows and warm conversations by the vinyl corner.',
    display_order: 3
  },
  {
    id: '4',
    image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80',
    caption: 'The Honesty Library. Floor-to-ceiling wooden shelves packed with well-loved vintage books.',
    display_order: 4
  }
];

export function WelcomeStory() {
  const [gallery, setGallery] = useState<GalleryItem[]>(FALLBACK_GALLERY);
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathProgress, setBreathProgress] = useState(0);

  // Supabase Fetch
  useEffect(() => {
    async function fetchGallery() {
      try {
        const { data, error } = await supabase
          .schema('cosy_coffi_cwtch_corner_2d5838')
          .from('gallery_items')
          .select('id, image_url, caption, display_order')
          .order('display_order', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          setGallery(data);
        }
      } catch (err) {
        // Quietly fail and use premium fallbacks
        console.warn('Using fallback gallery data:', err);
      }
    }
    fetchGallery();
  }, []);

  // Breathing Pacer Cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathPhase((prev) => {
        if (prev === 'Inhale') return 'Hold';
        if (prev === 'Hold') return 'Exhale';
        return 'Inhale';
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Soft progress bar simulation for breathing
  useEffect(() => {
    setBreathProgress(0);
    const timer = setTimeout(() => setBreathProgress(100), 50);
    return () => clearTimeout(timer);
  }, [breathPhase]);

  return (
    <section id="story" className="relative bg-[#121212] text-[#EAE5DC] py-24 lg:py-36 overflow-hidden font-sans">
      {/* Decorative ambient amber glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#D97706]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] bg-[#5D4432]/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Dynamic Local Info Banner / Croeso Header */}
        <div className="flex flex-col items-center mb-16 lg:mb-24 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D97706]/10 border border-[#D97706]/30 text-[#D97706] text-xs font-mono uppercase tracking-widest mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Croeso i Caerdydd</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl text-transparent bg-clip-text bg-gradient-to-b from-[#FFF] to-[#EAE5DC]"
          >
            a slow-paced haven in the heart of Cardiff.
          </motion.h2>
          
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D97706]/50 to-transparent mt-8" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start mb-24 lg:mb-32">
          
          {/* Left Column: Narrative & Testimonial */}
          <div className="lg:col-span-7 space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6 text-lg text-[#EAE5DC]/80 leading-relaxed font-light"
            >
              <p className="first-letter:text-5xl first-letter:font-serif first-letter:text-[#D97706] first-letter:mr-3 first-letter:float-left first-letter:font-bold">
                Some spaces are built for speed; we built this one for pauses. Inspired by the traditional Welsh <em className="text-[#D97706] not-italic font-medium">cwtch</em>—that irreplaceable feeling of a warm, safe embrace—we’ve gathered mismatched bookshelves, low-hanging amber lamps, and a collection of vinyl records to create a home away from home.
              </p>
              <p>
                Whether you’re escaping the rain with a worn paperback, catching up with an old friend over a cardamom-spiced flat white, or seeking a quiet hour in our private booth, you are welcome here. No rush, no corporate noise. Just honest Welsh hospitality and room to rest.
              </p>
            </motion.div>

            {/* Premium Testimonial Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative p-8 md:p-10 rounded-2xl bg-[#F7F4EF] text-[#121212] shadow-2xl overflow-hidden group border border-[#E9E3DD]"
            >
              {/* Decorative accent corner */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#D97706]/10 rounded-bl-full pointer-events-none transition-all duration-300 group-hover:scale-110" />
              
              <Quote className="w-10 h-10 text-[#D97706]/30 mb-6" />
              
              <blockquote className="text-xl md:text-2xl font-serif italic font-medium leading-relaxed mb-6 text-[#121212]">
                "stepping into the cwtch corner feels like a collective exhale. the lights are always low, the mugs are heavy and warm, and the bara brith tastes exactly like my grandmother’s. it is my absolute favorite place to hide from the world on a rainy tuesday."
              </blockquote>
              
              <div className="flex items-center justify-between pt-4 border-t border-[#121212]/10">
                <div>
                  <p className="font-bold tracking-wide text-sm uppercase text-[#121212]">Alys</p>
                  <p className="text-xs text-[#121212]/60 font-mono">Pontcanna, Cardiff</p>
                </div>
                <span className="text-xs font-mono bg-[#121212]/5 px-3 py-1 rounded-full text-[#121212]/70">Regular Guest</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Atmosphere Pillars & Breathing Widget */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
            
            {/* Atmosphere Features List */}
            <div className="space-y-6">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#D97706] mb-4">Sanctuary Features</h3>
              
              {[
                {
                  icon: Coffee,
                  title: 'Welsh-Roasted Coffee',
                  desc: 'Crafted in small batches by local roasters who care about the journey from bean to cup.'
                },
                {
                  icon: Sparkles,
                  title: 'Locally Sourced Bakes',
                  desc: 'Hand-delivered every morning by artisan bakers right here in Cardiff.'
                },
                {
                  icon: BookOpen,
                  title: 'The Honesty Library',
                  desc: 'Borrow a book, leave a book, or sit with one of ours for as long as your cup stays warm.'
                },
                {
                  icon: Disc,
                  title: 'Quiet Acoustics',
                  desc: 'No loud, metallic clatter. Just the soft hum of conversation and the gentle crackle of jazz on vinyl.'
                }
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    key={index} 
                    className="flex gap-4 p-5 rounded-xl bg-[#1E1E1E]/60 border border-white/5 hover:border-[#D97706]/20 transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#D97706]/10 flex items-center justify-center text-[#D97706]">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#FFF] text-base mb-1">{item.title}</h4>
                      <p className="text-sm text-[#EAE5DC]/70 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Interactive Collective Exhale Breathing Widget */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-gradient-to-br from-[#1E1E1E] to-[#121212] border border-white/10 relative overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-4">
                <Wind className="w-4 h-4 text-[#D97706] animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-wider text-[#D97706]">Collective Exhale Pacer</span>
              </div>
              
              <p className="text-xs text-[#EAE5DC]/60 mb-6">
                Need a moment to reset? Sync your breath with our quiet sanctuary rhythm.
              </p>

              <div className="flex flex-col items-center justify-center py-4">
                {/* Breathing Circle */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <motion.div 
                    animate={{
                      scale: breathPhase === 'Inhale' ? 1.3 : breathPhase === 'Hold' ? 1.3 : 0.9,
                      opacity: breathPhase === 'Inhale' ? 0.8 : breathPhase === 'Hold' ? 1 : 0.5,
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D97706]/30 to-[#5D4432]/40 blur-sm"
                  />
                  <motion.div 
                    animate={{
                      scale: breathPhase === 'Inhale' ? 1.15 : breathPhase === 'Hold' ? 1.15 : 0.95,
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-full bg-[#D97706] flex items-center justify-center text-xs font-semibold text-[#121212] shadow-xl z-10"
                  >
                    {breathPhase}
                  </motion.div>
                </div>

                {/* Status indicator line */}
                <div className="w-full bg-white/5 h-1 rounded-full mt-6 overflow-hidden">
                  <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: `${breathProgress}%` }}
                    transition={{ duration: 4, ease: "linear" }}
                    className="h-full bg-[#D97706]"
                    key={breathPhase}
                  />
                </div>
                
                <span className="text-[10px] font-mono mt-2 text-[#EAE5DC]/40 tracking-widest uppercase">
                  {breathPhase === 'Inhale' ? 'Breathe in Cardiff air' : breathPhase === 'Hold' ? 'Hold the warmth' : 'Let go of the rush'}
                </span>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Dynamic Gallery Section */}
        <div className="border-t border-white/5 pt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#D97706]">Visual Notes</span>
              <h3 className="text-3xl md:text-4xl font-bold mt-2">inside the sanctuary</h3>
            </div>
            <p className="text-[#EAE5DC]/60 max-w-md text-sm leading-relaxed">
              Every corner is curated to tell a story of warmth. Click on any picture to rest your eyes on our physical details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gallery.map((item, idx) => (
              <motion.div 
                key={item.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                onClick={() => setActiveImage(item)}
                className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer bg-[#1E1E1E] border border-white/5 shadow-lg"
              >
                {/* Image */}
                <img 
                  src={item.image_url} 
                  alt={item.caption || 'Cwtch Corner Gallery'} 
                  className="w-full h-full object-cover grayscale contrast-125 brightness-75 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end h-full">
                  <span className="text-[10px] font-mono text-[#D97706] mb-1 tracking-widest uppercase">
                    Pillar 0{idx + 1}
                  </span>
                  <p className="text-sm font-light text-white group-hover:text-[#EAE5DC] transition-colors duration-200 line-clamp-2">
                    {item.caption}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-[#D97706] mt-3 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Examine closer</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Lightbox Modal for Gallery */}
      <AnimatePresence>
        {activeImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-10 backdrop-blur-md"
            onClick={() => setActiveImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white text-sm font-mono tracking-widest uppercase bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 transition-colors"
              onClick={() => setActiveImage(null)}
            >
              Close [ESC]
            </button>
            
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="max-w-4xl w-full flex flex-col gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[16/10] bg-[#121212] border border-white/10 shadow-2xl">
                <img 
                  src={activeImage.image_url} 
                  alt={activeImage.caption} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#D97706]">Atmosffêr</span>
                <p className="text-xl text-[#EAE5DC] mt-2 font-light leading-relaxed">
                  {activeImage.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}