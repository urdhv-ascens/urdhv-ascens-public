'use client';

import { useState } from 'react';
import { Hero } from "@/components/sections/Hero";
import { Capabilities } from "@/components/sections/Capabilities";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Contact } from "@/components/sections/Contact";
import { CourseEntryModal } from "@/components/sections/CourseEntryModal";

export default function Home() {
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  return (
    <div className="bg-black text-white selection:bg-emerald-500/20 selection:text-emerald-300 min-h-screen">
      <Hero onOpenCourseModal={() => setIsCourseModalOpen(true)} />
      
      {/* Studio Capabilities Infinite Two-Row Small Card Carousel */}
      <Capabilities onOpenCourseModal={() => setIsCourseModalOpen(true)} />
      
      <About />
      <Projects onOpenCourseModal={() => setIsCourseModalOpen(true)} />
      
      {/* Precision Services Infinite Two-Row Small Card Carousel */}
      <Services onOpenCourseModal={() => setIsCourseModalOpen(true)} />
      
      <Contact />

      {/* Interactive Visitor Course Access Flow (Spec §6) */}
      <CourseEntryModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
      />
    </div>
  );
}
