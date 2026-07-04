'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface MenuItem {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string; // 'coffee' | 'tea' | 'bakes' | 'seasonal'
  is_available: boolean;
  dietary_flags: string[];
}

const FALLBACK_MENU: MenuItem[] = [
  {
    name: "Seasonal Flat White",
    description: "Single-origin espresso with steamed oat milk, carrying natural notes of toasted hazelnut and dark chocolate.",
    price: 3.80,
    category: "coffee",
    is_available: true,
    dietary_flags: ["VG"]
  },
  {
    name: "Slow Pour Filter",
    description: "Brewed deliberately and served in a hand-thrown clay pot. Ask your barista about today’s featured single-origin bean.",
    price: 4.00,
    category: "coffee",
    is_available: true,
    dietary_flags: ["VG", "GF"]
  },
  {
    name: "Spiced Hazelnut Latte",
    description: "Double espresso, steamed organic milk, and our house-made hazelnut praline syrup, finished with a pinch of nutmeg.",
    price: 4.20,
    category: "coffee",
    is_available: true,
    dietary_flags: ["GF"]
  },
  {
    name: "Hearth Chocolate",
    description: "Rich, melted dark chocolate whisked with a touch of sea salt and Welsh honey, served extra hot.",
    price: 4.50,
    category: "seasonal",
    is_available: true,
    dietary_flags: ["GF"]
  },
  {
    name: "Traditional Welsh Breakfast",
    description: "A robust, comforting black tea blend, brewed slow in a ceramic pot. Best enjoyed with a splash of oat milk.",
    price: 3.20,
    category: "tea",
    is_available: true,
    dietary_flags: ["VG"]
  },
  {
    name: "Wild Chamomile & Heather",
    description: "A soothing, caffeine-free floral infusion harvested from local meadows. Perfect for quiet reading afternoons.",
    price: 3.50,
    category: "tea",
    is_available: true,
    dietary_flags: ["VG", "GF"]
  },
  {
    name: "The Cardiff Bara Brith",
    description: "A generous slice of traditional Welsh tea loaf, soaked in black tea and packed with dried fruits. Served warm with salted Welsh butter.",
    price: 3.60,
    category: "bakes",
    is_available: true,
    dietary_flags: ["VG Option Available"]
  },
  {
    name: "Cardiff Sourdough Toast",
    description: "Two thick slices of naturally leavened sourdough, toasted and slathered with seasonal wild berry compote or local Cardiff honey.",
    price: 3.90,
    category: "bakes",
    is_available: true,
    dietary_flags: ["VG"]
  },
  {
    name: "Vegan Cinnamon Bun",
    description: "Soft, pillowy dough rolled with organic brown sugar and Ceylon cinnamon, topped with a light vanilla glaze.",
    price: 4.00,
    category: "bakes",
    is_available: true,
    dietary_flags: ["VG"]
  },
  {
    name: "Almond & Rose Cake",
    description: "A moist, fragrant almond sponge infused with organic rosewater, entirely gluten-free.",
    price: 4.20,
    category: "bakes",
    is_available: true,
    dietary_flags: ["GF"]
  }
];

export function MenuSection() {
  const [dbItems, setDbItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');

  useEffect(() => {
    async function fetchMenu() {
      try {
        // Safe check for schema-based query
        // @ts-ignore
        const query = supabase.schema 
          ? supabase.schema('cosy_coffi_cwtch_corner_2d5838').from('menu_items') 
          : supabase.from('menu_items');
          
        const { data, error } = await query.select('*');
        if (error) {
          console.warn('Supabase fetch error, using fallback:', error.message);
        } else if (data && data.length > 0) {
          // Map database categories to expected lowercase formats
          const mappedData = data.map((item: any) => ({
            ...item,
            category: item.category.toLowerCase(),
            price: Number(item.price)
          }));
          setDbItems(mappedData);
        }
      } catch (err) {
        console.warn('Could not load Supabase data, using static menu fallback.', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  // Merge loaded database items with static fallbacks if we want to ensure everything listed in the copy exists
  const menuItems = useMemo(() => {
    if (dbItems.length === 0) return FALLBACK_MENU;
    
    // Combine both, avoiding exact duplicates by name
    const combined = [...dbItems];
    FALLBACK_MENU.forEach((fallbackItem) => {
      if (!combined.some(item => item.name.toLowerCase() === fallbackItem.name.toLowerCase())) {
        combined.push(fallbackItem);
      }
    });
    return combined;
  }, [dbItems]);

  // Category mapping helper
  const getCategoryGroup = (category: string) => {
    const cat = category.toLowerCase();
    if (cat === 'coffee' || cat === 'seasonal' || cat === 'coffi') return 'coffi & warmers';
    if (cat === 'tea' || cat === 'teas') return 'loose-leaf teas';
    if (cat === 'bakes' || cat === 'bake') return 'daily bakes';
    return 'coffi & warmers'; // Default fallback
  };

  // Filter logic
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // 1. Category Filter
      if (activeCategory !== 'all') {
        const group = getCategoryGroup(item.category);
        if (group !== activeCategory) return false;
      }

      // 2. Dietary Filter
      if (dietaryFilter !== 'all') {
        const flags = item.dietary_flags.map(f => f.toUpperCase());
        if (dietaryFilter === 'VG') {
          return flags.some(f => f.includes('VG') || f.includes('VEGAN'));
        }
        if (dietaryFilter === 'GF') {
          return flags.some(f => f.includes('GF') || f.includes('GLUTEN'));
        }
      }

      return true;
    });
  }, [menuItems, activeCategory, dietaryFilter]);

  // Unique categories for the tab selectors
  const categories = [
    { id: 'all', label: 'the full spread' },
    { id: 'coffi & warmers', label: 'coffi & warmers' },
    { id: 'loose-leaf teas', label: 'loose-leaf teas' },
    { id: 'daily bakes', label: 'daily bakes' }
  ];

  const dietaryOptions = [
    { id: 'all', label: 'all bakes & pours' },
    { id: 'VG', label: 'vegan friendly [vg]' },
    { id: 'GF', label: 'gluten free [gf]' }
  ];

  return (
    <section 
      id="menu" 
      className="relative bg-[#F7F4EF] text-[#121212] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans"
    >
      {/* Subtle Background Accent Texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#222B24_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Block */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs uppercase tracking-[0.2em] text-[#222B24]/70 font-mono block mb-3">
              — ar gael bob dydd / available daily
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#121212] mb-6">
              slow pours and daily bakes<span className="text-[#D97706]">.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#121212]/80 leading-relaxed font-light">
              We keep our menu simple, seasonal, and deeply local. Our coffee beans are sourced from independent Welsh roasters, and our bakes are delivered warm from Cardiff kitchens every morning.
            </p>
          </motion.div>
        </div>

        {/* Filter Bar Controls */}
        <div className="flex flex-col items-center space-y-6 mb-16">
          {/* Main Categories */}
          <div className="inline-flex flex-wrap justify-center gap-2 p-1.5 bg-white/60 backdrop-blur-sm rounded-full border border-[#222B24]/10 max-w-full">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#222B24] ${
                    isActive
                      ? 'bg-[#222B24] text-[#F7F4EF] shadow-sm'
                      : 'text-[#121212]/70 hover:text-[#121212] hover:bg-white/40'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Dietary Sub-filters */}
          <div className="flex items-center justify-center gap-4 text-xs font-mono">
            <span className="text-[#121212]/40 uppercase tracking-wider">Dietary:</span>
            <div className="flex gap-2">
              {dietaryOptions.map((opt) => {
                const isActive = dietaryFilter === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setDietaryFilter(opt.id)}
                    className={`px-3 py-1 rounded border transition-all duration-200 ${
                      isActive
                        ? 'border-[#D97706] bg-[#D97706]/10 text-[#D97706] font-semibold'
                        : 'border-[#222B24]/10 text-[#121212]/60 hover:border-[#222B24]/30 hover:text-[#121212]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Visual Highlight Card */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
            <div className="bg-[#222B24] text-[#EAE5DC] rounded-2xl overflow-hidden shadow-xl border border-white/10 transition-transform duration-500 hover:scale-[1.01]">
              <div className="relative h-64 w-full">
                <img 
                  src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1000" 
                  alt="A steaming cup of flat white coffee under a warm amber glow" 
                  className="object-cover w-full h-full filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#222B24] via-[#222B24]/20 to-transparent" />
                <span className="absolute bottom-4 left-4 bg-[#D97706] text-[#121212] text-xs font-mono uppercase tracking-widest px-2.5 py-1 rounded">
                  Today's Featured Pour
                </span>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-light mb-2">Our House Philosophy</h3>
                <p className="text-sm text-[#EAE5DC]/80 leading-relaxed mb-6">
                  We grind every harvest to order, ensuring each cup respects the slow, unhurried journey from farm to ceramic mug. Grab a fresh cinnamon bun, let your tea steep fully, and take your time.
                </p>
                <div className="border-t border-[#EAE5DC]/10 pt-4 flex justify-between items-center text-xs font-mono text-[#EAE5DC]/60">
                  <span>Espresso Blend:</span>
                  <span className="text-[#D97706] font-semibold">Welsh-Roasted Single Origin</span>
                </div>
              </div>
            </div>

            {/* Cozy Note */}
            <div className="p-6 rounded-2xl bg-white border border-[#222B24]/5 shadow-sm text-center">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 animate-pulse mr-2" />
              <span className="text-xs font-mono text-[#121212]/70 uppercase tracking-wider">
                Bakes refreshed daily at 8:00 am
              </span>
            </div>
          </div>

          {/* Right Column: Dynamic Menu List */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-${dietaryFilter}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-12"
              >
                {/* We render categorized blocks unless empty */}
                {filteredItems.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-[#222B24]/5">
                    <svg className="mx-auto h-12 w-12 text-[#121212]/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="text-lg font-medium text-[#121212]">No items match your filters</h3>
                    <p className="mt-2 text-sm text-[#121212]/60">Try clearing your dietary criteria or selecting another category.</p>
                    <button
                      onClick={() => { setActiveCategory('all'); setDietaryFilter('all'); }}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-[#222B24] text-xs font-mono rounded-md hover:bg-[#222B24] hover:text-[#F7F4EF] transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  // Group filtered items by category if we are in 'all' tab, otherwise render list
                  ['coffi & warmers', 'loose-leaf teas', 'daily bakes'].map((categoryName) => {
                    const itemsInGroup = filteredItems.filter(
                      (item) => getCategoryGroup(item.category) === categoryName
                    );

                    if (itemsInGroup.length === 0) return null;

                    return (
                      <div key={categoryName} className="space-y-6">
                        {/* Category Label */}
                        <div className="flex items-center justify-between border-b border-[#222B24]/10 pb-3">
                          <h3 className="text-xl font-light tracking-wide text-[#222B24] capitalize">
                            {categoryName}
                          </h3>
                          <span className="text-xs font-mono text-[#121212]/40 uppercase tracking-widest">
                            {itemsInGroup.length} {itemsInGroup.length === 1 ? 'item' : 'items'}
                          </span>
                        </div>

                        {/* Menu Items */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {itemsInGroup.map((item, idx) => (
                            <motion.div
                              key={item.id || `${item.name}-${idx}`}
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.3, delay: idx * 0.05 }}
                              className="bg-white p-6 rounded-2xl border border-[#222B24]/5 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex justify-between items-start gap-4 mb-2">
                                  <h4 className="text-lg font-medium text-[#121212] tracking-tight">
                                    {item.name}
                                  </h4>
                                  <span className="text-base font-mono font-medium text-[#222B24] whitespace-nowrap">
                                    £{item.price.toFixed(2)}
                                  </span>
                                </div>
                                <p className="text-sm text-[#121212]/70 leading-relaxed font-light mb-4">
                                  {item.description}
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center justify-between gap-2 mt-auto pt-2">
                                {/* Dietary Tags */}
                                <div className="flex flex-wrap gap-1">
                                  {item.dietary_flags.map((flag, flagIdx) => (
                                    <span
                                      key={flagIdx}
                                      className="inline-block bg-[#F7F4EF] text-[#222B24] text-[10px] font-mono px-2 py-0.5 rounded border border-[#222B24]/10 uppercase"
                                    >
                                      {flag}
                                    </span>
                                  ))}
                                </div>

                                {/* Availability Indicator */}
                                {!item.is_available && (
                                  <span className="text-xs font-mono text-[#DC2626] bg-[#DC2626]/10 px-2.5 py-0.5 rounded">
                                    Sold Out Today
                                  </span>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Footnote / Organic Promise */}
        <div className="mt-20 border-t border-[#222B24]/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#121212]/60">
          <p className="font-light text-center md:text-left">
            Have a question about specific allergens or sourcing? Ask our baristas at the counter or drop us an email.
          </p>
          <div className="flex gap-6 font-mono text-xs uppercase tracking-wider">
            <span>[VG] Vegan</span>
            <span>[GF] Gluten-Free</span>
          </div>
        </div>

      </div>
    </section>
  );
}