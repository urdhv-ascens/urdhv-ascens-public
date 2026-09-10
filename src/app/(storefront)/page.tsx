'use client';

import { useState } from 'react';
import { Hero } from "@/components/sections/Hero";
import { InfiniteTwoRowCarousel } from "@/components/sections/InfiniteTwoRowCarousel";
import { About } from "@/components/sections/About";
import { Capabilities } from "@/components/sections/Capabilities";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Pricing } from "@/components/sections/Pricing";
import { Contact } from "@/components/sections/Contact";
import { CourseEntryModal } from "@/components/sections/CourseEntryModal";

export default function Home() {
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  return (
    <div className="bg-black text-white selection:bg-amber-500/20 selection:text-amber-300 min-h-screen">
      <Hero onOpenCourseModal={() => setIsCourseModalOpen(true)} />
      <InfiniteTwoRowCarousel onOpenCourseModal={() => setIsCourseModalOpen(true)} />
      <About />
      <Capabilities />
      <Projects />
      <Services />
      <Pricing />
      <Contact />

      {/* Interactive Visitor Course Access Flow (Spec §6) */}
      <CourseEntryModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
      />
    </div>
  );
}
