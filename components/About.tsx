
import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !scrollWrapperRef.current) return;

    // Pin the entire section so it stays fixed in the viewport while we scrub the animation
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=400%', // Adjust this for longer/shorter scrolling felt duration
      pin: true,
      animation: gsap.to(scrollWrapperRef.current, {
        yPercent: -80, // Translates the massive track upwards
        ease: 'none',
      }),
      scrub: 1, // Smooth dragging physics
    });
  }, { scope: sectionRef });

  return (
    <section id="about" ref={sectionRef} className="h-screen w-full relative z-20 bg-[#A67B5B] overflow-hidden">

      {/* Slide 0: ABOUT US intro */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center p-8 sm:p-16 z-0 bg-[#A67B5B]">
        <div className="max-w-5xl w-full flex flex-col items-center text-center space-y-8 text-white font-inter">
          <div className="font-tech uppercase tracking-[0.4em] text-xs sm:text-[14px] mb-4 text-white/50">
            ABOUT US
          </div>
          <p className="text-[28px] sm:text-[45px] lg:text-[60px] leading-[1.2] tracking-tight font-thin">
            REclose is built on a simple, powerful premise: You should be the one who trains your AI. We've moved beyond simple "chatting." With REclose, you are building a digital extension of your own knowledge.
          </p>
        </div>
      </div>

      {/* Slide 1: The Master Overlay that naturally sits below and then we pull the *contents* up */}
      <div className="absolute top-0 left-0 w-full h-full z-10 flex justify-center items-end pb-12 pointer-events-none">
        {/* Sparkle Decoration - bottom right */}
        <div className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 z-50">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C12 7.52285 16.4772 12 22 12C16.4772 12 12 16.4772 12 22C12 16.4772 7.52285 12 2 12C7.52285 12 12 7.52285 12 2Z" fill="#E8DCD1" opacity="0.6" />
          </svg>
        </div>
      </div>

      {/* The massive hidden track that we slide upwards via GSAP */}
      <div
        ref={scrollWrapperRef}
        className="absolute top-full left-0 w-full flex flex-col items-center bg-[#A67B5B] shadow-[0_-30px_60px_rgba(0,0,0,0.15)] z-20 rounded-t-[3rem] lg:rounded-t-[4rem] min-h-[400vh]"
      >
        <div className="max-w-5xl w-full flex flex-col gap-[70vh] text-center px-6 sm:px-12 lg:px-24 py-[40vh] pb-[100vh]">

          {/* Point 1: CUSTOM TRAINING ENGINE */}
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <div className="uppercase tracking-[0.25em] text-[12px] sm:text-[14px] text-white font-light opacity-90">
              CUSTOM TRAINING ENGINE
            </div>
            <p className="text-[26px] sm:text-[34px] lg:text-[44px] xl:text-[48px] leading-[1.25] tracking-tight font-[200] text-white w-full">
              You don't just 'talk' to REclose; you cultivate a digital extension of your own knowledge by training it on your specific documents and codebases.
            </p>
          </div>

          {/* Point 2: CONTEXTUAL GROUNDING */}
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <div className="uppercase tracking-[0.25em] text-[12px] sm:text-[14px] text-white font-light opacity-90">
              CONTEXTUAL GROUNDING
            </div>
            <p className="text-[26px] sm:text-[34px] lg:text-[44px] xl:text-[48px] leading-[1.25] tracking-tight font-[200] text-white w-full">
              By grounding the AI in your unique data, the system eliminates the 'fluff' and hallucinations common in generic models, ensuring every answer is factually accurate to your business.
            </p>
          </div>

          {/* Point 3: ADAPTIVE INTELLIGENCE */}
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <div className="uppercase tracking-[0.25em] text-[12px] sm:text-[14px] text-white font-light opacity-90">
              ADAPTIVE INTELLIGENCE
            </div>
            <p className="text-[26px] sm:text-[34px] lg:text-[44px] xl:text-[48px] leading-[1.25] tracking-tight font-[200] text-white w-full">
              The system doesn't stay static; it learns from every interaction, becoming more efficient and aligned with your specific goals over time.
            </p>
          </div>

          {/* Point 4: SOVEREIGN DATA ARCHITECTURE */}
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <div className="uppercase tracking-[0.25em] text-[12px] sm:text-[14px] text-white font-light opacity-90">
              SOVEREIGN DATA ARCHITECTURE
            </div>
            <p className="text-[26px] sm:text-[34px] lg:text-[44px] xl:text-[48px] leading-[1.25] tracking-tight font-[200] text-white w-full">
              Your training data is yours alone; REclose is built with a privacy-first approach to ensure you retain full ownership of the intelligence you build.
            </p>
          </div>

        </div>
      </div>

    </section>
  );
};

export default About;
