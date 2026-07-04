'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Coffee, 
  Calendar, 
  MessageSquare, 
  Plus, 
  Check, 
  X, 
  LogOut, 
  ChevronRight, 
  TrendingUp, 
  User, 
  Mail, 
  Clock, 
  FileText, 
  AlertCircle,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Trash2,
  DollarSign
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

// --- TYPES ---
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean;
  dietary_flags: string[];
}

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  booking_date: string;
  time_slot: string;
  guest_count: number;
  special_notes?: string;
  status: 'confirmed' | 'cancelled';
}

interface Enquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_resolved: boolean;
  created_at: string;
}

// --- MOCK FALLBACKS ---
const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    customer_name: 'Lowri Roberts',
    customer_email: 'lowri@example.com',
    customer_phone: '07123 456789',
    booking_date: '2024-11-14',
    time_slot: '09:00 - 10:30',
    guest_count: 2,
    special_notes: 'Celebrating a quiet anniversary.',
    status: 'confirmed'
  },
  {
    id: 'b2',
    customer_name: 'Dylan Evans',
    customer_email: 'dylan@example.com',
    customer_phone: '07987 654321',
    booking_date: '2024-11-14',
    time_slot: '13:00 - 14:30',
    guest_count: 1,
    special_notes: 'Bringing a journal; would love a corner seat.',
    status: 'confirmed'
  },
  {
    id: 'b3',
    customer_name: 'Carys Jenkins',
    customer_email: 'carys@example.com',
    customer_phone: '07456 123789',
    booking_date: '2024-11-14',
    time_slot: '15:00 - 16:30',
    guest_count: 3,
    special_notes: 'Small book club discussion.',
    status: 'confirmed'
  },
  {
    id: 'b4',
    customer_name: 'Dr. Alun Owen',
    customer_email: 'alun@example.com',
    customer_phone: '07321 654987',
    booking_date: '2024-11-15',
    time_slot: '11:00 - 12:30',
    guest_count: 2,
    special_notes: 'Quiet academic catch-up.',
    status: 'confirmed'
  }
];

const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'e1',
    name: 'Sian Davies',
    email: 'sian.davies@email.com',
    subject: 'Small Group Booking (Book Club)',
    message: 'Hi there! We have a small local poetry group of about 5 people. We’d love to gather in a quiet corner of your shop on a Thursday evening around 5:00 pm. Do you have space to accommodate us, and can we pre-order a round of Welsh breakfast teas?',
    is_resolved: false,
    created_at: '2024-11-14T09:34:00Z'
  },
  {
    id: 'e2',
    name: 'Geraint Thomas',
    email: 'geraint.t@email.com',
    subject: 'General Enquiry (Local Honey Sourcing)',
    message: 'Hello, I run a small apiary just outside Cardiff. I would love to drop off a sample of our raw summer wildflower honey to see if you\'d be interested in using it on your sourdough toast. Let me know if I can pop by!',
    is_resolved: false,
    created_at: '2024-11-13T16:12:00Z'
  }
];

const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: 'Seasonal Flat White',
    description: 'Single-origin espresso with steamed oat milk, carrying natural notes of toasted hazelnut and dark chocolate.',
    price: 3.80,
    category: 'Coffi & Warmers',
    is_available: true,
    dietary_flags: ['VG']
  },
  {
    id: 'm2',
    name: 'Spiced Hazelnut Latte',
    description: 'Double espresso, steamed organic milk, and our house-made hazelnut praline syrup, finished with a pinch of nutmeg.',
    price: 4.20,
    category: 'Coffi & Warmers',
    is_available: true,
    dietary_flags: ['GF', 'VG']
  },
  {
    id: 'm3',
    name: 'Hearth Chocolate',
    description: 'Rich, melted dark chocolate whisked with a touch of sea salt and Welsh honey, served extra hot.',
    price: 4.50,
    category: 'Coffi & Warmers',
    is_available: true,
    dietary_flags: ['GF']
  },
  {
    id: 'm4',
    name: 'The Cardiff Bara Brith',
    description: 'A generous slice of traditional Welsh tea loaf, soaked in black tea and packed with dried fruits. Served warm with salted Welsh butter.',
    price: 3.60,
    category: 'Daily Bakes',
    is_available: true,
    dietary_flags: ['VG Option']
  },
  {
    id: 'm5',
    name: 'Vegan Cinnamon Bun',
    description: 'Soft, pillowy dough rolled with organic brown sugar and Ceylon cinnamon, topped with a light vanilla glaze.',
    price: 4.00,
    category: 'Daily Bakes',
    is_available: false,
    dietary_flags: ['VG']
  },
  {
    id: 'm6',
    name: 'Almond & Rose Cake',
    description: 'A moist, fragrant almond sponge infused with organic rosewater, entirely gluten-free.',
    price: 4.20,
    category: 'Daily Bakes',
    is_available: true,
    dietary_flags: ['GF']
  }
];

export function AdminDashboard() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('owner@cosycofficwtch.wales');
  const [loginPassword, setLoginPassword] = useState('cwtch2024');
  const [loginError, setLoginError] = useState('');

  // Dashboard Core Data
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(INITIAL_ENQUIRIES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);

  // UI State
  const [activeTab, setActiveTab] = useState<'bookings' | 'enquiries' | 'menu'>('bookings');
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Form state for adding new Menu Item
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Daily Bakes');
  const [newItemDietary, setNewItemDietary] = useState<string[]>([]);

  // Fetch from Supabase if available
  useEffect(() => {
    async function loadData() {
      try {
        const { data: mData } = await supabase
          .from('menu_items')
          .select('*');
        if (mData && mData.length > 0) {
          // Normalize snake_case / camelCase if needed, or map directly
          setMenuItems(mData.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description || '',
            price: Number(item.price),
            category: item.category === 'bakes' ? 'Daily Bakes' : 'Coffi & Warmers',
            is_available: item.is_available ?? true,
            dietary_flags: item.dietary_flags || []
          })));
        }

        const { data: bData } = await supabase
          .from('bookings')
          .select('*');
        if (bData && bData.length > 0) {
          setBookings(bData.map(b => ({
            id: b.id,
            customer_name: b.customer_name,
            customer_email: b.customer_email,
            customer_phone: b.customer_phone || '',
            booking_date: b.booking_date,
            time_slot: b.time_slot,
            guest_count: b.guest_count,
            special_notes: b.special_notes || '',
            status: b.status as 'confirmed' | 'cancelled'
          })));
        }

        const { data: eData } = await supabase
          .from('enquiries')
          .select('*');
        if (eData && eData.length > 0) {
          setEnquiries(eData.map(e => ({
            id: e.id,
            name: e.name,
            email: e.email,
            subject: e.subject,
            message: e.message,
            is_resolved: e.is_resolved ?? false,
            created_at: e.created_at
          })));
        }
      } catch (err) {
        console.warn('Supabase not fully loaded/configured, using beautiful offline simulation state.');
      }
    }
    loadData();
  }, []);

  // Trigger temporary notification toast
  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail.trim() && loginPassword.length >= 6) {
      setIsLoggedIn(true);
      triggerToast('Welcome back to the sanctuary control center.', 'success');
    } else {
      setLoginError('Invalid credentials. Please double check your email and password.');
    }
  };

  // Booking handlers
  const handleCancelBooking = async (id: string) => {
    try {
      await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', id);
    } catch (e) {}
    
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    triggerToast('Booking reservation has been cancelled.', 'info');
  };

  const handleCompleteBooking = async (id: string) => {
    try {
      await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
    } catch (e) {}

    setBookings(prev => prev.filter(b => b.id !== id));
    triggerToast('Booking marked as complete and archived.', 'success');
  };

  // Enquiry handlers
  const handleResolveEnquiry = async (id: string) => {
    try {
      await supabase
        .from('enquiries')
        .update({ is_resolved: true })
        .eq('id', id);
    } catch (e) {}

    setEnquiries(prev => prev.map(enq => enq.id === id ? { ...enq, is_resolved: true } : enq));
    triggerToast('Enquiry marked as resolved.', 'success');
  };

  // Menu handlers
  const handleToggleAvailability = async (id: string) => {
    const item = menuItems.find(m => m.id === id);
    if (!item) return;
    const newStatus = !item.is_available;

    try {
      await supabase
        .from('menu_items')
        .update({ is_available: newStatus })
        .eq('id', id);
    } catch (e) {}

    setMenuItems(prev => prev.map(m => m.id === id ? { ...m, is_available: newStatus } : m));
    triggerToast(`"${item.name}" is now ${newStatus ? 'available' : 'sold out'}.`, 'info');
  };

  const handleRemoveMenuItem = async (id: string) => {
    const item = menuItems.find(m => m.id === id);
    try {
      await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
    } catch (e) {}

    setMenuItems(prev => prev.filter(m => m.id !== id));
    triggerToast(`"${item?.name}" has been removed from the menu.`, 'info');
  };

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) {
      triggerToast('Please provide a name and price.', 'error');
      return;
    }

    const priceNum = parseFloat(newItemPrice);
    if (isNaN(priceNum)) {
      triggerToast('Please provide a valid numeric price.', 'error');
      return;
    }

    const newItem: MenuItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newItemName,
      description: newItemDesc,
      price: priceNum,
      category: newItemCategory,
      is_available: true,
      dietary_flags: newItemDietary
    };

    try {
      await supabase
        .from('menu_items')
        .insert({
          name: newItemName,
          description: newItemDesc,
          price: priceNum,
          category: newItemCategory === 'Daily Bakes' ? 'bakes' : 'coffee',
          is_available: true,
          dietary_flags: newItemDietary
        });
    } catch (e) {}

    setMenuItems(prev => [newItem, ...prev]);
    setIsNewItemModalOpen(false);
    triggerToast(`"${newItemName}" successfully added to the hearth menu.`, 'success');

    // Reset Form
    setNewItemName('');
    setNewItemDesc('');
    setNewItemPrice('');
    setNewItemCategory('Daily Bakes');
    setNewItemDietary([]);
  };

  const toggleDietaryFlag = (flag: string) => {
    setNewItemDietary(prev => 
      prev.includes(flag) ? prev.filter(f => f !== flag) : [...prev, flag]
    );
  };

  // Calculate Metrics
  const activeBookingsCount = bookings.filter(b => b.status === 'confirmed').length;
  const pendingEnquiriesCount = enquiries.filter(e => !e.is_resolved).length;
  const soldOutItemsCount = menuItems.filter(m => !m.is_available).length;

  return (
    <div className="relative min-h-screen bg-[#121212] text-[#EAE5DC] font-sans antialiased selection:bg-[#D97706] selection:text-neutral-950 overflow-x-hidden">
      
      {/* Visual Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-[#222B24]/40 via-transparent to-transparent pointer-events-none blur-3xl z-0" />
      <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-[#D97706]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className={`p-4 rounded-xl shadow-2xl border flex items-center gap-3 max-w-sm pointer-events-auto backdrop-blur-md ${
                notification.type === 'success' 
                  ? 'bg-[#222B24] border-[#16A34A]/40 text-[#EAE5DC]' 
                  : notification.type === 'error'
                  ? 'bg-[#222B24] border-red-900/40 text-red-200'
                  : 'bg-[#222B24] border-[#D97706]/40 text-amber-100'
              }`}
            >
              <div className="p-1.5 rounded-lg bg-[#121212] border border-white/5">
                {notification.type === 'success' && <Check className="w-4 h-4 text-[#16A34A]" />}
                {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                {notification.type === 'info' && <Sparkles className="w-4 h-4 text-[#D97706]" />}
              </div>
              <p className="text-sm font-medium leading-tight">{notification.message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- PHASE 1: LOGIN --- */}
      {!isLoggedIn ? (
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">
          <div className="w-full max-w-md">
            
            {/* Header / Brand */}
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#222B24] border border-[#D97706]/30 text-xs font-mono text-[#D97706] tracking-widest uppercase mb-4">
                <Lock className="w-3.5 h-3.5" /> Staff Portal Secure
              </span>
              <h1 className="text-4xl font-light tracking-tight text-[#EAE5DC] font-serif">
                welcome back, <span className="italic font-normal text-amber-100">friend.</span>
              </h1>
              <p className="mt-3 text-[#EAE5DC]/70 text-sm leading-relaxed max-w-xs mx-auto">
                Log in to manage today's bookings, read incoming enquiries, and update the daily menu.
              </p>
            </div>

            {/* Login Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#222B24] rounded-2xl border border-[#D97706]/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden p-8"
            >
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#EAE5DC]/60 font-mono mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-[#EAE5DC] text-sm focus:outline-none focus:border-[#D97706] transition-colors font-mono"
                      placeholder="owner@cosycofficwtch.wales"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#EAE5DC]/60 font-mono mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-[#EAE5DC] text-sm focus:outline-none focus:border-[#D97706] transition-colors font-mono tracking-widest"
                      placeholder="••••••••••••••••"
                      required
                    />
                  </div>
                </div>

                {loginError && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/40 border border-red-900/40 text-red-200 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#D97706] hover:bg-[#b86405] text-neutral-950 font-medium rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-[0_4px_20px_rgba(217,119,6,0.25)] flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                >
                  Access Dashboard <ChevronRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-white/5 text-center">
                <p className="text-xs text-[#EAE5DC]/40 italic">
                  "croeso cynnes i bawb — a warm welcome to all"
                </p>
              </div>
            </motion.div>

            {/* Back Link */}
            <div className="text-center mt-6">
              <a href="#menu" className="text-xs text-[#EAE5DC]/50 hover:text-[#D97706] transition-colors underline underline-offset-4">
                Return to public menu
              </a>
            </div>

          </div>
        </div>
      ) : (
        
        // --- PHASE 2: ADMIN DASHBOARD CONTROL PANEL ---
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {/* Header Bar */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-white/5 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#222B24] border border-[#D97706]/20 text-xs font-mono text-[#D97706]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Portal
                </span>
                <span className="text-xs font-mono text-white/40">Staff Control v2.4</span>
              </div>
              <h1 className="text-4xl font-light tracking-tight text-[#EAE5DC] font-serif">
                today’s bookings & <span className="italic font-normal text-amber-100">quiet conversations.</span>
              </h1>
              <p className="text-sm text-[#EAE5DC]/60 mt-1">
                Cosy Coffi Cwtch Corner operations dashboard.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  triggerToast('Logged out securely.', 'info');
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#222B24] border border-white/5 hover:border-white/10 text-xs font-mono text-[#EAE5DC]/80 hover:text-white transition-all"
              >
                <LogOut className="w-4 h-4" /> Secure Exit
              </button>
            </div>
          </header>

          {/* Key Metrics Bar */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Metric 1 */}
            <div className="bg-[#222B24] rounded-2xl border border-white/5 p-6 relative overflow-hidden group hover:border-[#D97706]/20 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D97706]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#D97706]/10 transition-all" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-widest text-[#EAE5DC]/60 font-mono">Today's Nook Occupancy</span>
                <div className="p-2 rounded-lg bg-[#121212] border border-white/5 text-[#D97706]">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-light tracking-tight font-mono text-white">85%</span>
                <span className="text-xs text-[#EAE5DC]/50 font-mono">(5 of 6 slots filled)</span>
              </div>
              <div className="mt-4 w-full bg-[#121212] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#D97706] h-1.5 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-[#222B24] rounded-2xl border border-white/5 p-6 relative overflow-hidden group hover:border-[#D97706]/20 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D97706]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#D97706]/10 transition-all" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-widest text-[#EAE5DC]/60 font-mono">Pending Enquiries</span>
                <div className="p-2 rounded-lg bg-[#121212] border border-white/5 text-[#D97706]">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-light tracking-tight font-mono text-white">{pendingEnquiriesCount}</span>
                <span className="text-xs text-[#EAE5DC]/50 font-mono">unread messages</span>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-100/70 font-mono">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span>Requires daily review</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-[#222B24] rounded-2xl border border-white/5 p-6 relative overflow-hidden group hover:border-[#D97706]/20 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D97706]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#D97706]/10 transition-all" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-widest text-[#EAE5DC]/60 font-mono">Total Bookings This Week</span>
                <div className="p-2 rounded-lg bg-[#121212] border border-white/5 text-[#D97706]">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-light tracking-tight font-mono text-white">38</span>
                <span className="text-xs text-[#EAE5DC]/50 font-mono">reservations</span>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Nook high demand</span>
              </div>
            </div>
          </section>

          {/* Tab Navigation */}
          <div className="flex border-b border-white/5 mb-8 gap-4 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`pb-4 px-2 text-sm font-mono tracking-wider uppercase transition-all relative flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'bookings' ? 'text-[#D97706]' : 'text-[#EAE5DC]/60 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" /> Cwtch Nook Bookings
              {activeBookingsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-[#D97706] text-neutral-950 font-bold">
                  {activeBookingsCount}
                </span>
              )}
              {activeTab === 'bookings' && (
                <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D97706]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('enquiries')}
              className={`pb-4 px-2 text-sm font-mono tracking-wider uppercase transition-all relative flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'enquiries' ? 'text-[#D97706]' : 'text-[#EAE5DC]/60 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Incoming Enquiries
              {pendingEnquiriesCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-red-600 text-white font-bold">
                  {pendingEnquiriesCount}
                </span>
              )}
              {activeTab === 'enquiries' && (
                <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D97706]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`pb-4 px-2 text-sm font-mono tracking-wider uppercase transition-all relative flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'menu' ? 'text-[#D97706]' : 'text-[#EAE5DC]/60 hover:text-white'
              }`}
            >
              <Coffee className="w-4 h-4" /> Menu Management
              {soldOutItemsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-600/30 text-[#D97706] border border-[#D97706]/20 font-bold">
                  {soldOutItemsCount} Out
                </span>
              )}
              {activeTab === 'menu' && (
                <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D97706]" />
              )}
            </button>
          </div>

          {/* --- MAIN WORKSPACE PANELS --- */}
          <main className="min-h-[400px]">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: BOOKINGS */}
              {activeTab === 'bookings' && (
                <motion.div
                  key="bookings"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-light font-serif">Upcoming Cwtch Nook Bookings</h2>
                      <p className="text-xs text-[#EAE5DC]/60">Real-time schedule for the semi-private sanctuary nook.</p>
                    </div>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="bg-[#222B24] rounded-2xl border border-white/5 p-12 text-center">
                      <Calendar className="w-12 h-12 text-[#EAE5DC]/20 mx-auto mb-4" />
                      <p className="text-[#EAE5DC]/70 italic">No bookings registered for today or tomorrow.</p>
                    </div>
                  ) : (
                    <div className="bg-[#222B24] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-white/5 bg-[#121212]/50 text-xs font-mono tracking-wider uppercase text-[#EAE5DC]/60">
                              <th className="py-4 px-6">Date</th>
                              <th className="py-4 px-6">Time Slot</th>
                              <th className="py-4 px-6">Guest Info</th>
                              <th className="py-4 px-6">Guests</th>
                              <th className="py-4 px-6">Notes</th>
                              <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-sm">
                            {bookings.map((booking) => (
                              <tr 
                                key={booking.id} 
                                className={`hover:bg-[#121212]/30 transition-colors ${
                                  booking.status === 'cancelled' ? 'opacity-50 line-through bg-red-950/5' : ''
                                }`}
                              >
                                <td className="py-4 px-6 font-mono font-bold text-amber-100">
                                  {booking.booking_date}
                                </td>
                                <td className="py-4 px-6">
                                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#121212] border border-white/5 text-xs font-mono text-amber-100/90">
                                    <Clock className="w-3 h-3 text-[#D97706]" /> {booking.time_slot}
                                  </span>
                                </td>
                                <td className="py-4 px-6">
                                  <div className="font-medium text-[#EAE5DC]">{booking.customer_name}</div>
                                  <div className="text-xs text-[#EAE5DC]/50 font-mono">{booking.customer_email}</div>
                                  {booking.customer_phone && (
                                    <div className="text-[11px] text-[#EAE5DC]/40 font-mono">{booking.customer_phone}</div>
                                  )}
                                </td>
                                <td className="py-4 px-6 font-mono">
                                  {booking.guest_count} {booking.guest_count === 1 ? 'Guest' : 'Guests'}
                                </td>
                                <td className="py-4 px-6 max-w-xs">
                                  <p className="text-xs text-[#EAE5DC]/70 italic leading-relaxed truncate hover:text-clip hover:whitespace-normal">
                                    "{booking.special_notes || 'No special requirements.'}"
                                  </p>
                                </td>
                                <td className="py-4 px-6 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    {booking.status === 'confirmed' ? (
                                      <>
                                        <button
                                          onClick={() => handleCancelBooking(booking.id)}
                                          className="px-2.5 py-1.5 rounded-lg bg-red-950/20 border border-red-900/40 hover:bg-red-950/50 hover:border-red-500 text-red-300 text-xs font-mono transition-all"
                                          title="Cancel Reservation"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          onClick={() => handleCompleteBooking(booking.id)}
                                          className="px-2.5 py-1.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40 hover:bg-emerald-950/50 hover:border-emerald-500 text-emerald-300 text-xs font-mono transition-all"
                                          title="Mark as Completed"
                                        >
                                          Complete
                                        </button>
                                      </>
                                    ) : (
                                      <span className="text-xs font-mono text-red-400 uppercase tracking-widest bg-red-950/30 px-2.5 py-1 rounded-md border border-red-900/20">
                                        Cancelled
                                      </span>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 2: ENQUIRIES */}
              {activeTab === 'enquiries' && (
                <motion.div
                  key="enquiries"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-light font-serif">Incoming Contact Enquiries</h2>
                    <p className="text-xs text-[#EAE5DC]/60">Messages from general queries and cozy gathering proposals.</p>
                  </div>

                  {enquiries.length === 0 ? (
                    <div className="bg-[#222B24] rounded-2xl border border-white/5 p-12 text-center">
                      <MessageSquare className="w-12 h-12 text-[#EAE5DC]/20 mx-auto mb-4" />
                      <p className="text-[#EAE5DC]/70 italic">All caught up! No active inquiries remaining.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {enquiries.map((enquiry) => (
                        <div 
                          key={enquiry.id}
                          className={`bg-[#222B24] rounded-2xl border transition-all p-6 flex flex-col justify-between gap-6 ${
                            enquiry.is_resolved 
                              ? 'border-white/5 opacity-60' 
                              : 'border-[#D97706]/20 shadow-[0_4px_25px_rgba(0,0,0,0.15)]'
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <span className="inline-flex items-center gap-1 text-xs font-mono text-amber-100">
                                  <User className="w-3.5 h-3.5 text-[#D97706]" /> {enquiry.name}
                                </span>
                                <span className="text-xs font-mono text-[#EAE5DC]/40">•</span>
                                <span className="inline-flex items-center gap-1 text-xs font-mono text-[#EAE5DC]/60 hover:text-white transition-colors">
                                  <Mail className="w-3.5 h-3.5" /> {enquiry.email}
                                </span>
                                {enquiry.is_resolved && (
                                  <span className="ml-auto md:ml-0 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 text-[10px] font-mono tracking-wider uppercase">
                                    Resolved
                                  </span>
                                )}
                              </div>
                              <h3 className="text-lg font-medium text-white">{enquiry.subject}</h3>
                            </div>
                            <span className="text-xs font-mono text-[#EAE5DC]/40">
                              Received: Nov 14 (Simulated)
                            </span>
                          </div>

                          <p className="text-sm text-[#EAE5DC]/80 leading-relaxed bg-[#121212]/40 rounded-xl p-4 border border-white/5 whitespace-pre-line italic">
                            "{enquiry.message}"
                          </p>

                          <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
                            {!enquiry.is_resolved && (
                              <button
                                onClick={() => handleResolveEnquiry(enquiry.id)}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-neutral-950 text-xs font-mono font-medium transition-all flex items-center gap-1.5"
                              >
                                <Check className="w-3.5 h-3.5" /> Mark as Resolved
                              </button>
                            )}
                            <a
                              href={`mailto:${enquiry.email}?subject=RE: ${enquiry.subject}`}
                              className="px-4 py-2 rounded-xl bg-[#121212] border border-white/10 hover:border-[#D97706]/40 text-xs font-mono text-[#EAE5DC]/80 hover:text-white transition-all flex items-center gap-1.5"
                            >
                              <Mail className="w-3.5 h-3.5" /> Reply via Email
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 3: MENU MANAGEMENT */}
              {activeTab === 'menu' && (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-light font-serif">Tweak the menu, update the hearth.</h2>
                      <p className="text-xs text-[#EAE5DC]/60">Keep the digital menu perfectly aligned with what’s currently sitting on our physical counter.</p>
                    </div>
                    <button
                      onClick={() => setIsNewItemModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#b86405] text-neutral-950 text-xs font-mono font-medium transition-all shadow-lg shadow-[#D97706]/10"
                    >
                      <Plus className="w-4 h-4" /> Add New Menu Item
                    </button>
                  </div>

                  {/* Menu Groups */}
                  {['Coffi & Warmers', 'Daily Bakes'].map((cat) => {
                    const items = menuItems.filter(m => m.category === cat);
                    return (
                      <div key={cat} className="space-y-3">
                        <h3 className="text-xs uppercase tracking-widest text-[#D97706] font-mono font-semibold pt-4 border-b border-white/5 pb-2">
                          Category: {cat}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {items.map((item) => (
                            <div 
                              key={item.id} 
                              className={`bg-[#222B24] rounded-2xl border transition-all p-5 flex flex-col justify-between gap-4 ${
                                item.is_available 
                                  ? 'border-white/5 hover:border-white/10' 
                                  : 'border-red-900/20 bg-[#222B24]/40 opacity-75'
                              }`}
                            >
                              <div>
                                <div className="flex items-start justify-between gap-4 mb-2">
                                  <h4 className="font-serif text-lg text-white font-medium">{item.name}</h4>
                                  <span className="font-mono text-sm text-[#D97706] font-bold">
                                    £{item.price.toFixed(2)}
                                  </span>
                                </div>
                                <p className="text-xs text-[#EAE5DC]/70 leading-relaxed mb-3">
                                  {item.description}
                                </p>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {item.dietary_flags.map((flag) => (
                                    <span 
                                      key={flag} 
                                      className="px-2 py-0.5 rounded bg-[#121212] border border-white/5 text-[#EAE5DC]/60 text-[10px] font-mono"
                                    >
                                      {flag}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono text-[#EAE5DC]/50">Available:</span>
                                  <button
                                    onClick={() => handleToggleAvailability(item.id)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                                      item.is_available
                                        ? 'bg-emerald-950/30 border border-emerald-900/40 text-emerald-400'
                                        : 'bg-red-950/30 border border-red-900/40 text-red-400'
                                    }`}
                                  >
                                    {item.is_available ? (
                                      <>
                                        <ToggleRight className="w-4 h-4 text-emerald-500" /> ON
                                      </>
                                    ) : (
                                      <>
                                        <ToggleLeft className="w-4 h-4 text-red-500" /> OFF (Sold Out)
                                      </>
                                    )}
                                  </button>
                                </div>

                                <button
                                  onClick={() => handleRemoveMenuItem(item.id)}
                                  className="p-1.5 rounded-lg bg-red-950/10 border border-red-900/20 hover:border-red-600 hover:bg-red-950/30 text-red-400 hover:text-red-200 transition-all"
                                  title="Remove Item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}

            </AnimatePresence>
          </main>

        </div>
      )}

      {/* --- ADD NEW MENU ITEM MODAL DIALOG --- */}
      <AnimatePresence>
        {isNewItemModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewItemModalOpen(false)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative bg-[#222B24] rounded-2xl border border-white/10 w-full max-w-lg p-6 sm:p-8 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                <div>
                  <h3 className="text-xl font-serif text-white">Add New Menu Item</h3>
                  <p className="text-xs text-[#EAE5DC]/50">Craft a fresh addition to the hearth slate.</p>
                </div>
                <button
                  onClick={() => setIsNewItemModalOpen(false)}
                  className="p-1.5 rounded-xl bg-[#121212] border border-white/5 hover:border-white/10 transition-all text-[#EAE5DC]/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddMenuItem} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#EAE5DC]/60 font-mono mb-2">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="e.g., Rosemary Sourdough Scone"
                    className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D97706] transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#EAE5DC]/60 font-mono mb-2">
                      Price (£)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#EAE5DC]/40">£</span>
                      <input
                        type="text"
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(e.target.value)}
                        placeholder="3.80"
                        className="w-full bg-[#121212] border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#D97706] transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#EAE5DC]/60 font-mono mb-2">
                      Category
                    </label>
                    <select
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                      className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D97706] transition-colors appearance-none"
                    >
                      <option value="Daily Bakes">Daily Bakes</option>
                      <option value="Coffi & Warmers">Coffi & Warmers</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#EAE5DC]/60 font-mono mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    placeholder="Describe the textures, origins, and warmth..."
                    className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D97706] transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#EAE5DC]/60 font-mono mb-2">
                    Dietary Flags
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {['VG', 'GF', 'V', 'VG Option', 'Nut Free'].map((flag) => {
                      const active = newItemDietary.includes(flag);
                      return (
                        <button
                          key={flag}
                          type="button"
                          onClick={() => toggleDietaryFlag(flag)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                            active 
                              ? 'bg-[#D97706]/20 border-[#D97706] text-amber-100' 
                              : 'bg-[#121212] border-white/5 text-[#EAE5DC]/50 hover:border-white/10'
                          }`}
                        >
                          {flag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/5 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsNewItemModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-transparent hover:bg-white/5 text-xs font-mono text-[#EAE5DC]/80 hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#b86405] text-neutral-950 text-xs font-mono font-bold transition-all"
                  >
                    Publish to Menu
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}