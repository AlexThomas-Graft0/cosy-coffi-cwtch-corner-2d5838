'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string;
  display_order: number;
}

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'default-1',
    image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
    caption: 'The Hearth Glow. A steaming ceramic mug of flat white resting on a rustic oak table, kissed by amber light.',
    display_order: 1,
  },
  {
    id: 'default-2',
    image_url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80',
    caption: 'The Honesty Library. Floor-to-ceiling wooden shelves packed with well-loved vintage books and a cozy armchair.',
    display_order: 2,
  },
  {
    id: 'default-3',
    image_url: 'https://images.unsplash.com/photo-1539628399213-d6aa19c934e4?auto=format&fit=crop&w=1000&q=80',
    caption: 'The Vinyl Corner. A vintage wooden record player spinning soft jazz to replace the city noise.',
    display_order: 3,
  },
  {
    id: 'default-4',
    image_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80',
    caption: 'Inside the Nook. Deep cushions, warm throws, and a quiet space designed to let you simply exist in peace.',
    display_order: 4,
  },
];

export function OurSpaceGallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(DEFAULT_GALLERY);
  const [activePillar, setActivePillar] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const { data, error } = await supabase
          .from('gallery_items')
          .select('id, image_url, caption, display_order')
          .order('display_order', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          // Map DB items, using fallback images if URLs are empty
          const formatted = data.map((item: any, index: number) => ({
            id: item.id,
            image_url: item.image_url || DEFAULT_GALLERY[index % DEFAULT_GALLERY.length].image_url,
            caption: item.caption || DEFAULT_GALLERY[index % DEFAULT_GALLERY.length].caption,
            display_order: item.display_order ?? index,
          }));
          setGalleryItems(formatted);
        }
      } catch (err) {
        console.warn('Using default fallback gallery data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGallery();
  }, []);

  const pillars = [
    {
      title: '1. Cartref (Belonging)',
      description: 'You are not just a transaction or a seat to be turned over. From the moment you cross our threshold, you are a guest in our home. Stay for ten minutes or four hours; you belong here.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      title: '2. Slow Living',
      description: 'We don\'t do super-fast automated brewing. We grind our beans to order, pour our teas with patience, and let our bakes rise naturally. We believe life is better when you don\'t rush the process.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: '3. Rooted in Wales',
      description: 'From our Cardiff-roasted coffee beans to our locally milled flour and bilingual conversations, our heart is firmly planted in Welsh soil. We celebrate local creatives, local businesses, and the rich heritage of Caerdydd.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="our-space" className="relative bg-[#121212] text-[#EAE5DC] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      {/* Background soft ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D97706]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#D97706]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <span className="text-[#D97706] text-xs font-mono tracking-[0.2em] uppercase block mb-3">
            Our Origins & Aesthetics
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#EAE5DC] mb-6">
            a sanctuary built on <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#EAE5DC] via-[#D97706] to-[#EAE5DC]">slow afternoons.</span>
          </h2>
          <p className="text-lg sm:text-xl text-[#EAE5DC]/80 font-light leading-relaxed">
            We didn’t set out to build another coffee shop. We set out to build a home.
          </p>
        </div>

        {/* Story & Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24">
          
          {/* Narrative Column */}
          <div className="lg:col-span-7 space-y-6 text-base sm:text-lg text-[#EAE5DC]/90 font-light leading-relaxed">
            <h3 className="text-2xl font-normal text-[#EAE5DC] mb-4">From Rain to Warmth</h3>
            <p>
              We started with a very simple problem: Cardiff has a lot of rainy days, and not enough quiet corners to hide from them.
            </p>
            <p>
              In the winter of 2022, we took an old, neglected brick corner building in Caerdydd and began transforming it. We stripped back the plaster to reveal the original red brick, painted the walls a deep, sheltering charcoal, and hunted down vintage velvet armchairs, sturdy oak tables, and lighting that feels like a crackling hearth.
            </p>
            <p>
              We wanted a space that felt old, wise, and incredibly safe. A place where you could smell fresh espresso mingling with the scent of old paper and beeswax candles. Today, <span className="text-[#D97706] font-normal">cosy coffi cwtch corner</span> is exactly that. It’s a space that belongs to Cardiff—a quiet, unhurried ecosystem supported by local makers, local roasters, and beautiful souls who know the value of sitting still.
            </p>
          </div>

          {/* Pillars Column (Oatmeal Card style to match Design System visual contrast) */}
          <div className="lg:col-span-5 bg-[#F7F4EF] text-[#121212] rounded-3xl p-8 sm:p-10 shadow-2xl relative border border-[#EAE5DC]/20">
            <div className="absolute top-4 right-4 text-xs font-mono text-[#121212]/40 tracking-widest uppercase">
              Pillars of Cartref
            </div>
            
            <h3 className="text-2xl font-semibold text-[#121212] mb-6 tracking-tight">Our Core Philosophy</h3>
            
            <div className="space-y-4">
              {pillars.map((pillar, idx) => {
                const isActive = activePillar === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActivePillar(idx)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D97706]/40 ${
                      isActive 
                        ? 'bg-[#121212] text-[#EAE5DC] shadow-lg translate-x-1' 
                        : 'bg-transparent text-[#121212]/80 hover:bg-[#121212]/5 hover:text-[#121212]'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className={isActive ? 'text-[#D97706]' : 'text-[#121212]/60'}>
                        {pillar.icon}
                      </span>
                      <h4 className="font-medium tracking-tight text-base sm:text-lg">{pillar.title}</h4>
                    </div>
                    
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 0.9 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="text-xs sm:text-sm font-light leading-relaxed mt-2"
                        >
                          {pillar.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Visual Showcase (Gallery Grid) */}
        <div className="pt-8 border-t border-[#EAE5DC]/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[#D97706] text-xs font-mono tracking-[0.2em] uppercase block mb-2">Visual Showcase</span>
              <h3 className="text-2xl sm:text-3xl font-light text-[#EAE5DC]">Step Inside the Sanctuary</h3>
            </div>
            <p className="text-sm text-[#EAE5DC]/60 font-mono max-w-xs">
              Click on any photograph to take a closer, slower look at our favorite corners.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                onClick={() => setSelectedImage(item)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[#1d1d1d] border border-[#EAE5DC]/10 aspect-[4/5] shadow-xl"
              >
                {/* Image */}
                <img
                  src={item.image_url}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />

                {/* Ambient vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/90 via-[#121212]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Hover Glow Border */}
                <div className="absolute inset-0 border-2 border-[#D97706]/0 group-hover:border-[#D97706]/40 transition-all duration-300 rounded-2xl pointer-events-none" />

                {/* Caption / Label preview */}
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="w-8 h-[2px] bg-[#D97706] mb-3 transition-all duration-300 group-hover:w-16" />
                  <p className="text-xs font-mono text-[#D97706] uppercase tracking-wider mb-1">Corner 0{index + 1}</p>
                  <p className="text-sm text-[#EAE5DC] font-light line-clamp-2 leading-snug">
                    {item.caption.split('.')[0]}.
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-[#121212]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <button 
              className="absolute top-6 right-6 text-[#EAE5DC]/60 hover:text-[#EAE5DC] transition-colors focus:outline-none"
              onClick={() => setSelectedImage(null)}
              aria-label="Close Lightbox"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full bg-[#1c1c1c] rounded-3xl overflow-hidden border border-[#EAE5DC]/10 shadow-2xl"
            >
              <div className="relative aspect-[16/10] bg-[#121212]">
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.caption}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 sm:p-8 bg-[#1c1c1c]">
                <span className="text-xs font-mono text-[#D97706] tracking-[0.2em] uppercase block mb-2">
                  Cosy Coffi Sanctuary
                </span>
                <p className="text-base sm:text-lg text-[#EAE5DC] font-light leading-relaxed">
                  {selectedImage.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}