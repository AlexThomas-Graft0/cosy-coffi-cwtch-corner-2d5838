'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

const TIME_SLOTS = [
  { id: '09:00 - 10:30', label: '09:00 - 10:30' },
  { id: '11:00 - 12:30', label: '11:00 - 12:30' },
  { id: '13:00 - 14:30', label: '13:00 - 14:30' },
  { id: '15:00 - 16:30', label: '15:00 - 16:30' },
  { id: '17:00 - 18:30', label: '17:00 - 18:30' },
];

const GUIDELINES = [
  {
    title: 'Time Slots',
    text: 'Bookings are limited to 90 minutes to ensure everyone gets a turn to cwtch.',
  },
  {
    title: 'Capacity',
    text: 'The booth comfortably fits 1 to 4 people.',
  },
  {
    title: 'Cost',
    text: 'The Nook is completely free to reserve. We only ask that you order a warm drink or a bake during your stay to support our local staff.',
  },
  {
    title: 'The Quiet Code',
    text: 'We ask that phone calls, video meetings, and loud laptop typing are kept out of the Nook. It’s a space meant for quiet contemplation and low-whispered conversations.',
  },
];

const FAQS = [
  {
    q: 'Is there a deposit required to book?',
    a: 'No deposit is needed. We trust our community to respect the booking times. If your plans change, please use the cancellation link in your confirmation email so we can open the slot for someone else.',
  },
  {
    q: 'Can I work on my laptop in the Nook?',
    a: 'You are welcome to read, write, and browse on your devices, but we kindly ask that you refrain from hopping on Zoom calls, playing audio out loud, or heavy, rapid typing. The Nook is designed to be a low-sensory, peaceful environment.',
  },
  {
    q: 'What happens if I’m running late?',
    a: 'We hold all reservations for 15 minutes. If you’re running a bit late, don’t worry—but if you’re more than 15 minutes behind, we may open the booth back up to walk-in guests looking for a cozy spot.',
  },
];

export function CwtchNookBooking() {
  // Hardcoded date anchor as requested by style guidelines to avoid dynamic date generation mismatch during hydration
  const [selectedDate, setSelectedDate] = useState('2024-11-14');
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState('1');
  const [notes, setNotes] = useState('');

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Fetch bookings for the selected date
  useEffect(() => {
    async function fetchBookings() {
      try {
        if (!supabase) return;
        const { data, error } = await supabase
          .from('bookings')
          .select('time_slot')
          .eq('booking_date', selectedDate)
          .eq('status', 'confirmed');

        if (error) throw error;

        if (data) {
          setBookedSlots(data.map((b: { time_slot: string }) => b.time_slot));
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        // Fallback or offline simulation
        if (selectedDate === '2024-11-14') {
          setBookedSlots(['11:00 - 12:30']); // Mimic the "Fully Booked" copy
        } else {
          setBookedSlots([]);
        }
      }
    }
    fetchBookings();
  }, [selectedDate]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setErrorMessage('Please select a time slot first.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (!supabase) {
        throw new Error('Supabase client is not initialized.');
      }

      const { error } = await supabase.from('bookings').insert([
        {
          customer_name: fullName,
          customer_email: email,
          customer_phone: phone,
          booking_date: selectedDate,
          time_slot: selectedSlot,
          guest_count: parseInt(guests, 10),
          special_notes: notes,
          status: 'confirmed',
        },
      ]);

      if (error) throw error;

      setSubmitSuccess(true);
      setBookedSlots((prev) => [...prev, selectedSlot]);
    } catch (err: any) {
      console.error('Error creating booking:', err);
      setErrorMessage(
        err.message || 'Something went wrong while securing your cwtch slot. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setGuests('1');
    setNotes('');
    setSelectedSlot(null);
    setSubmitSuccess(false);
    setErrorMessage(null);
  };

  return (
    <section
      id="cwtch-nook"
      className="relative bg-[#121212] text-[#EAE5DC] py-24 px-6 md:px-12 lg:px-24 overflow-hidden font-sans"
    >
      {/* Soft Ambient Glows */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-[#D97706]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-[400px] h-[400px] bg-[#222B24]/40 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="max-w-3xl mb-16">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.2em] text-[#D97706] font-mono font-semibold block mb-3"
          >
            The Ultimate Sanctuary
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-[#EAE5DC] mb-6 font-display"
          >
            your quiet corner is waiting.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-[#EAE5DC]/80 leading-relaxed font-light"
          >
            Tucked away in the quietest corner of our cafe is the{' '}
            <span className="italic text-[#D97706]">Cwtch Nook</span>—a
            semi-private booth designed for slow living. Surrounded by soft wool
            blankets, a dedicated dim reading lamp, and a shelf of our favorite
            books, it’s the perfect spot to study, write, catch up deeply, or
            simply exist in peace.
          </motion.p>
        </div>

        {/* Main Content Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT SIDE: Guidelines & FAQs */}
          <div className="lg:col-span-5 space-y-12">
            {/* Guidelines Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-[#222B24] border border-[#222B24]/80 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#D97706]/10 to-transparent rounded-bl-full" />
              <h3 className="text-2xl font-light text-[#EAE5DC] mb-8 font-display border-b border-[#EAE5DC]/10 pb-4">
                The Nook Guidelines
              </h3>
              <ul className="space-y-6">
                {GUIDELINES.map((item, index) => (
                  <li key={index} className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#D97706] mt-[10px]" />
                    <div>
                      <h4 className="font-medium text-[#EAE5DC] text-base font-sans">
                        {item.title}
                      </h4>
                      <p className="text-sm text-[#EAE5DC]/70 mt-1 leading-relaxed font-light">
                        {item.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Cozy Image Vignette */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative h-64 md:h-80 rounded-3xl overflow-hidden group shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80"
                alt="Inside the Cwtch Nook"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-xs uppercase tracking-widest text-[#D97706] font-mono font-semibold mb-1">
                  Atmosphere
                </p>
                <h4 className="text-lg font-light text-[#EAE5DC] font-display">
                  Soft wool blankets & amber glow.
                </h4>
              </div>
            </motion.div>

            {/* FAQs Accordion */}
            <div className="space-y-4">
              <h3 className="text-2xl font-light text-[#EAE5DC] font-display mb-4">
                Booking FAQs
              </h3>
              {FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border-b border-[#EAE5DC]/10 pb-4 transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full flex justify-between items-center text-left py-3 group focus:outline-none"
                    >
                      <span className="text-base font-medium text-[#EAE5DC] group-hover:text-[#D97706] transition-colors pr-4">
                        {faq.q}
                      </span>
                      <span className="text-[#D97706] text-xl transform transition-transform duration-300">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm text-[#EAE5DC]/80 font-light leading-relaxed pb-3 pl-1">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE: Interactive Reservation System */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-[#222B24] border border-[#222B24]/80 rounded-3xl p-8 md:p-12 shadow-2xl relative"
            >
              {/* Overlay Success Screen */}
              <AnimatePresence>
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 bg-[#222B24] rounded-3xl p-8 md:p-12 flex flex-col justify-center items-center text-center z-20"
                  >
                    <div className="w-16 h-16 bg-[#D97706]/20 rounded-full flex items-center justify-center mb-6">
                      <svg
                        className="w-8 h-8 text-[#D97706]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-light text-[#EAE5DC] font-display mb-4">
                      your cwtch is secure.
                    </h3>
                    <p className="text-base text-[#EAE5DC]/80 max-w-md mx-auto mb-8 font-light leading-relaxed">
                      We've reserved the Nook for you on{' '}
                      <span className="font-medium text-[#D97706]">
                        {selectedDate}
                      </span>{' '}
                      at{' '}
                      <span className="font-medium text-[#D97706]">
                        {selectedSlot}
                      </span>
                      . A confirmation email with details and quiet-code instructions has been sent to{' '}
                      <span className="italic">{email}</span>. We can't wait to brew for you.
                    </p>
                    <button
                      onClick={handleReset}
                      className="px-8 py-3 rounded-full border border-[#D97706] text-[#D97706] hover:bg-[#D97706] hover:text-[#121212] transition-all duration-300 font-medium tracking-wide text-sm uppercase"
                    >
                      Make Another Booking
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <h3 className="text-2xl font-light text-[#EAE5DC] mb-8 font-display">
                Real-time Slot Selector
              </h3>

              {/* Step 1: Date Selection */}
              <div className="mb-8">
                <label className="block text-xs uppercase tracking-widest text-[#EAE5DC]/60 font-mono mb-3">
                  1. Select Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedSlot(null);
                    }}
                    min="2024-11-01"
                    max="2024-12-31"
                    className="w-full bg-[#121212] border border-[#EAE5DC]/15 rounded-xl px-5 py-4 text-[#EAE5DC] focus:outline-none focus:border-[#D97706] transition-colors focus:ring-1 focus:ring-[#D97706]"
                  />
                </div>
                <p className="text-xs text-[#EAE5DC]/40 mt-2 italic font-light">
                  Choose any date in November or December 2024.
                </p>
              </div>

              {/* Step 2: Available Time Slots */}
              <div className="mb-8">
                <label className="block text-xs uppercase tracking-widest text-[#EAE5DC]/60 font-mono mb-3">
                  2. Available Time Slots (90-Min Sessions)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TIME_SLOTS.map((slot) => {
                    const isBooked = bookedSlots.includes(slot.id);
                    const isSelected = selectedSlot === slot.id;

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedSlot(slot.id)}
                        className={`group relative py-4 px-5 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between ${
                          isBooked
                            ? 'bg-[#121212]/30 border-transparent cursor-not-allowed opacity-40'
                            : isSelected
                            ? 'bg-[#D97706] border-[#D97706] text-[#121212]'
                            : 'bg-[#121212] border-[#EAE5DC]/10 hover:border-[#D97706]/75'
                        }`}
                      >
                        <span
                          className={`font-mono text-sm font-semibold tracking-wide ${
                            isSelected ? 'text-[#121212]' : 'text-[#EAE5DC]'
                          }`}
                        >
                          {slot.label}
                        </span>
                        <span
                          className={`text-xs mt-2 block font-light ${
                            isBooked
                              ? 'text-red-400 font-mono'
                              : isSelected
                              ? 'text-[#121212]/90 font-medium'
                              : 'text-[#D97706] group-hover:underline'
                          }`}
                        >
                          {isBooked ? 'Fully Booked' : isSelected ? 'Selected Slot' : 'Available'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Reservation Details Form */}
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#EAE5DC]/60 font-mono mb-3">
                    3. Reservation Form
                  </label>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Full Name (e.g., Lowri Roberts)"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-[#121212] border border-[#EAE5DC]/15 rounded-xl px-5 py-4 text-[#EAE5DC] placeholder-[#EAE5DC]/30 focus:outline-none focus:border-[#D97706] transition-colors focus:ring-1 focus:ring-[#D97706] text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="email"
                        required
                        placeholder="Email Address (e.g., lowri@example.com)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#121212] border border-[#EAE5DC]/15 rounded-xl px-5 py-4 text-[#EAE5DC] placeholder-[#EAE5DC]/30 focus:outline-none focus:border-[#D97706] transition-colors focus:ring-1 focus:ring-[#D97706] text-sm"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Phone Number (e.g., 07123 456789)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#121212] border border-[#EAE5DC]/15 rounded-xl px-5 py-4 text-[#EAE5DC] placeholder-[#EAE5DC]/30 focus:outline-none focus:border-[#D97706] transition-colors focus:ring-1 focus:ring-[#D97706] text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#EAE5DC]/60 font-mono mb-2">
                        Number of Guests
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full bg-[#121212] border border-[#EAE5DC]/15 rounded-xl px-5 py-4 text-[#EAE5DC] focus:outline-none focus:border-[#D97706] transition-colors focus:ring-1 focus:ring-[#D97706] text-sm"
                      >
                        <option value="1">1 Guest</option>
                        <option value="2">2 Guests</option>
                        <option value="3">3 Guests</option>
                        <option value="4">4 Guests</option>
                      </select>
                    </div>

                    <div>
                      <textarea
                        rows={3}
                        placeholder="Cozy Requests (e.g., I'm bringing a book I've been dying to finish, or note any dietary restrictions if you'd like us to set aside a specific bake for you...)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-[#121212] border border-[#EAE5DC]/15 rounded-xl px-5 py-4 text-[#EAE5DC] placeholder-[#EAE5DC]/30 focus:outline-none focus:border-[#D97706] transition-colors focus:ring-1 focus:ring-[#D97706] text-sm resize-none"
                      />
                    </div>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-4 bg-red-900/20 border border-red-900/50 text-red-200 text-sm rounded-xl">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#D97706] hover:bg-[#D97706]/95 text-[#121212] font-semibold text-sm uppercase tracking-widest rounded-xl transition-all duration-300 shadow-xl shadow-[#D97706]/10 hover:shadow-[#D97706]/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-[#121212]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Securing your booth...
                    </>
                  ) : (
                    'Reserve this time slot'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}