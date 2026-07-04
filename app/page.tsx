import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { WelcomeStory } from "@/components/WelcomeStory";
import { MenuSection } from "@/components/MenuSection";
import { CwtchNookBooking } from "@/components/CwtchNookBooking";
import { OurSpaceGallery } from "@/components/OurSpaceGallery";
import { ContactSection } from "@/components/ContactSection";
import { AdminDashboard } from "@/components/AdminDashboard";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Suspense fallback={<div className="min-h-[30vh]" />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<div className="min-h-[30vh]" />}>
        <WelcomeStory />
      </Suspense>
      <Suspense fallback={<div className="min-h-[30vh]" />}>
        <MenuSection />
      </Suspense>
      <Suspense fallback={<div className="min-h-[30vh]" />}>
        <CwtchNookBooking />
      </Suspense>
      <Suspense fallback={<div className="min-h-[30vh]" />}>
        <OurSpaceGallery />
      </Suspense>
      <Suspense fallback={<div className="min-h-[30vh]" />}>
        <ContactSection />
      </Suspense>
      <Suspense fallback={<div className="min-h-[30vh]" />}>
        <AdminDashboard />
      </Suspense>
      <Footer />
    </main>
  );
}
