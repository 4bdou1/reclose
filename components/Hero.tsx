import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);
import { ArrowRight, X, Sparkles } from 'lucide-react';
import Spline from '@splinetool/react-spline';
import Reveal from './Reveal.tsx';
import TheReceptionist from './TheReceptionist';

/**
 * High-status Keyhole-Chat logo accurately reconstructed from the reference image.
 */
const KeyholeLogo = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" stroke="#C5A059" strokeWidth="1.5" strokeOpacity="0.8" />
    <circle cx="50" cy="50" r="38" stroke="#CBD5E1" strokeWidth="1.2" strokeOpacity="0.4" />
    <path
      d="M50 25 C 38 25, 30 35, 30 45 C 30 52, 35 58, 40 62 L 35 75 L 50 68 L 65 75 L 60 62 C 65 58, 70 52, 70 45 C 70 35, 62 25, 50 25 Z"
      fill="#C5A059"
      fillOpacity="0.9"
    />
    <circle cx="50" cy="45" r="8" fill="#020205" />
    <path d="M50 45 L 44 58 L 56 58 Z" fill="#020205" />
  </svg>
);
const socialLogos = [
  { name: 'Facebook', color: '#1877F2', svg: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg> },
  { name: 'Instagram', color: '#E1306C', svg: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.975-9.458a1.44 1.44 0 100-2.88 1.44 1.44 0 000 2.88z" /></svg> },
  { name: 'WhatsApp', color: '#25D366', svg: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.966-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.525.146-.18.194-.3.297-.495.099-.195.048-.375-.025-.525-.075-.15-.672-1.62-.924-2.22-.246-.585-.495-.51-.673-.51-.174 0-.374-.015-.573-.015-.198 0-.523.075-.797.375-.273.3-1.045 1.02-1.045 2.49 0 1.47 1.07 2.895 1.217 3.09.149.195 2.105 3.21 5.1 4.5.711.3 1.265.48 1.697.615.714.225 1.365.195 1.88.12.574-.09 1.767-.72 2.016-1.425.249-.705.249-1.29.174-1.425-.075-.135-.275-.21-.575-.36zM12.002 22.11c-1.71 0-3.384-.45-4.854-1.305l-.348-.195-3.606.945.966-3.51-.21-.345A9.92 9.92 0 0 1 2.08 12.06c0-5.505 4.485-9.99 9.998-9.99 2.67 0 5.178 1.035 7.058 2.925a9.96 9.96 0 0 1 2.916 7.065c-.006 5.505-4.496 9.99-10.05 9.99zm-5.004-3.54c1.474.87 3.166 1.335 4.935 1.335A7.88 7.88 0 0 0 19.854 12A7.88 7.88 0 0 0 12.002 4.14C7.658 4.14 4.12 7.68 4.12 12.03a7.88 7.88 0 0 0 1.554 4.71l-1.002 3.654 3.766-.99z" /></svg> },
  { name: 'X', color: '#000000', svg: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg> },
  { name: 'TikTok', color: '#000000', svg: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.589 6.686a4.793 4.793 0 0 1-3.97-1.161 4.78 4.78 0 0 1-1.328-3.525h-3.805v13.623a4.135 4.135 0 1 1-4.135-4.135 4.1 4.1 0 0 1 2.37.75v-4.045a8.1 8.1 0 0 0-2.37-.35 8.136 8.136 0 1 0 8.135 8.135V9.453a8.775 8.775 0 0 0 5.103 1.637z" /></svg> }
];

const FallingLetters = ({ text, scrollY, offset = 0, speed = 0.5 }: { text: string, scrollY: number, offset?: number, speed?: number }) => {
  return (
    <span className="flex items-center">
      {text.split('').map((char, i) => {
        // Calculate the drop distance unique to this letter's index
        const rawDrop = (scrollY * speed) - (i * 25) - offset;
        const drop = Math.max(0, rawDrop);
        // Cap it at 110% so it fully drops out of the mask without endless math
        const translateY = Math.min(110, drop);

        return (
          <span key={i} className="overflow-hidden inline-flex relative pt-4 -mt-4 pb-4 -mb-4 px-1 -mx-1">
            <span
              className="will-change-transform inline-block transition-transform duration-[50ms] ease-out leading-none"
              style={{ transform: `translateY(${translateY}%)` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          </span>
        );
      })}
    </span>
  );
};

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [receptionistState, setReceptionistState] = useState<'idle' | 'bouncingUp' | 'draggingDown'>('idle');
  const cardRef = useRef<HTMLDivElement>(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !textContainerRef.current) return;

    // Use GSAP ScrollTrigger to pin the section while scrolling horizontally
    const container = textContainerRef.current;

    // We calculate how far the text needs to move to reveal FREEDOM
    // (the width of the text - the width of the screen + some padding/offset)
    const textTargetWidth = container.scrollWidth;
    const windowWidth = window.innerWidth;
    const xDistance = -(textTargetWidth - windowWidth + 100);

    const tl = gsap.to(container, {
      x: xDistance,
      ease: 'none'
    });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: () => "+=" + window.innerHeight,
      pin: true,
      pinSpacing: false, // Prevents GSAP from pushing the About section down, allowing parallax overlap!
      animation: tl,
      scrub: 1, // Smooth dragging transition synced to scroll
      onUpdate: (self) => {
        // Feed real scroll progress back to the Falling Letters Gravity engine
        setScrollY(self.progress * 3000);
      }
    });
  }, { scope: sectionRef });

  const [agentAnim, setAgentAnim] = useState<'idle' | 'leaving' | 'away' | 'returning'>('idle');
  const [leaveAnim, setLeaveAnim] = useState('animate-[fallAndRollOut_2s_forwards]');

  const handleLineClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      const isRoll = Math.random() > 0.5;
      setLeaveAnim(isRoll ? 'animate-[fallAndRollOut_2s_forwards]' : 'animate-[fallAndBounceOut_2.5s_forwards]');
      setAgentAnim('leaving');
      setTimeout(() => setAgentAnim('away'), 2500);
    } else {
      setIsExpanded(false);
      setAgentAnim('returning');
      setTimeout(() => setAgentAnim('idle'), 2500);
    }
  };

  const getAgentClass = () => {
    if (agentAnim === 'idle') return '';
    if (agentAnim === 'leaving') return leaveAnim;
    if (agentAnim === 'away') return 'opacity-0 pointer-events-none hidden';
    if (agentAnim === 'returning') return 'animate-[agentReturn_2.5s_forwards]';
    return '';
  };

  useEffect(() => {
    // Elegant fall back up via browser histories without router pop
    const handlePopState = () => {
      if (window.location.pathname === '/') {
        setReceptionistState('idle'); // Slide it back up
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleInitiateReceptionist = () => {
    if (isExpanded || receptionistState !== 'idle') return;

    setReceptionistState('bouncingUp');

    // Wait for the bounce-up to hit the top frame
    setTimeout(() => {
      setReceptionistState('draggingDown');

      // Do NOT trigger React Router DOM navigation (`navigate()`)
      // so we avoid unmounting and keep the fully-loaded, perfectly-rendered track
      setTimeout(() => {
        window.history.pushState(null, '', '/receptionist');
      }, 1000);
    }, 500); // Wait for bounce
  };

  const handleCloseReceptionist = () => {
    setReceptionistState('idle');
    window.history.pushState(null, '', '/');
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden bg-transparent z-10">
      <div className="absolute inset-0 pointer-events-none"></div>

      {/* DYNAMICALLY HIDE GLOBAL NAVBAR DURING DRAG SEQUENCE */}
      <style>{`
        ${receptionistState !== 'idle' ? `
          #global-navbar {
            opacity: 0 !important;
            pointer-events: none !important;
          }
        ` : ''}
      `}</style>

      {/* PARALLAX CURTAIN EFFECT (ACTUAL DASHBOARD DRAGGED DOWN) */}
      <div
        className={`fixed inset-0 z-[200] bg-black shadow-[0_30px_100px_rgba(0,0,0,0.9)] overflow-hidden ${receptionistState === 'draggingDown' ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{
          transform: receptionistState === 'draggingDown' ? 'translateY(0%)' : 'translateY(-100%)',
          transition: 'transform 1000ms cubic-bezier(0.86,0,0.07,1)'
        }}
      >
        <div className="w-full h-full">
          <TheReceptionist onClose={handleCloseReceptionist} />
        </div>
      </div>

      {/* THE PENDULUM AGENT TRIGGER */}
      <div
        className={`absolute right-12 md:right-[22%] top-[-15px] flex flex-col items-center z-[210] pointer-events-auto`}
        style={{
          transform:
            receptionistState === 'idle' ? 'translateY(0)' : 'translateY(-45vh)', // Retracts and stays up
          opacity:
            receptionistState === 'idle' ? 1 : 0, // Fades out completely
          transition:
            receptionistState === 'idle'
              ? 'transform 500ms ease, opacity 500ms ease'
              : 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 250ms ease 100ms'
        }}
      >
        {/* The Pin */}
        <div className="w-3 h-3 rounded-full bg-[#171827] shadow-[0_4px_10px_rgba(0,0,0,0.5)] border-[2px] border-slate-300 relative z-20 mt-4"></div>

        {/* The Swinging Wrapper */}
        <div className={`relative flex flex-col items-center origin-top top-[-6px] ${agentAnim === 'idle' && receptionistState === 'idle' ? 'animate-[swing_4s_ease-in-out_infinite]' : 'rotate-0 transition-transform duration-300'}`}>
          {/* The Rope */}
          <div className={`w-[2px] bg-slate-300 transition-opacity duration-300 h-[35vh] sm:h-[40vh] shadow-sm ${isExpanded ? 'opacity-0' : 'opacity-100'}`}></div>

          <div
            className={`relative cursor-pointer group p-2 sm:p-4 mt-[-4px] ${getAgentClass()}`}
            onClick={handleInitiateReceptionist}
          >
            <div className="absolute inset-0 bg-[#C5A059]/15 blur-2xl rounded-full group-hover:bg-[#C5A059]/40 transition-all duration-700 scale-[2.0]"></div>
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-[#171827] backdrop-blur-3xl rounded-full border border-slate-700/50 p-2 sm:p-2.5 shadow-[0_0_50px_rgba(197,160,89,0.2)] group-hover:scale-110 group-hover:shadow-[0_0_80px_rgba(197,160,89,0.5)] group-hover:border-[#C5A059]/60 transition-all duration-500">
              <KeyholeLogo className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>

      {/* SLEEK SCROLL INDICATOR */}
      <div className={`hidden md:flex absolute right-6 lg:right-10 top-[35%] -translate-y-1/2 flex-col items-center justify-center gap-[4.5rem] z-40 transition-opacity duration-700 ${receptionistState !== 'idle' || isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto hover:opacity-70'}`}>
        <span className="text-[9px] font-tech font-bold uppercase tracking-[0.3em] text-[#171827] rotate-90 origin-center whitespace-nowrap cursor-default">
          Scroll
        </span>
        <div className="w-[1.5px] h-20 bg-slate-200/60 relative overflow-hidden rounded-full">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-[#171827] bg-gradient-to-b from-transparent via-[#171827] to-[#171827] animate-[scrollLineBounce_2s_infinite]"></div>
        </div>
      </div>

      {/* MASSIVE BACKGROUND TYPOGRAPHY LAYER */}
      <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 select-none flex items-center justify-start transition-opacity duration-[1200ms] ease-out ${receptionistState !== 'idle' ? 'opacity-0' : 'opacity-100'}`}>
        <div
          ref={textContainerRef}
          className="absolute top-[8%] flex flex-row items-center justify-start w-max tracking-[-0.08em] whitespace-nowrap will-change-transform pl-[10%] xl:pl-[15%]"
        >
          <span
            className="text-[17vw] xl:text-[16vw] font-black font-sans uppercase leading-none bg-clip-text text-transparent bg-gradient-to-b from-[#C0C5CE] via-[#E8EBEF] to-[#FDFDFD] opacity-100"
            style={{
              transform: 'scaleY(2.3)',
              transformOrigin: 'top',
            }}
          >
            Sales Engine
          </span>
          <span
            className="ml-[15vw] text-[17vw] xl:text-[16vw] font-black font-sans uppercase leading-none bg-clip-text text-transparent bg-gradient-to-b from-[#C0C5CE] via-[#E8EBEF] to-[#FDFDFD]"
            style={{
              transform: 'scaleY(2.3)',
              transformOrigin: 'top',
            }}
          >
            FREEDOM
          </span>
        </div>
      </div>

      {/* LANDING PAGE CONTENT LAYER */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full transition-all duration-[800ms] ${receptionistState !== 'idle' ? 'opacity-10 blur-xl scale-[0.98]' : 'opacity-100 blur-0 scale-100'}`}>
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-[80vh] py-20 relative">

          {/* LEFT COLUMN: TEXT CONTENT */}
          <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left z-20">


            <Reveal delay={100}>
              <div className="relative pt-12 -mt-6 lg:-mt-10">
                <div
                  onClick={handleLineClick}
                  className="cursor-pointer group flex flex-col absolute top-0 left-0 z-50 pointer-events-auto"
                >
                  <div className={`flex items-center gap-1 mb-2 text-[10px] font-bold font-tech uppercase text-[#171827] tracking-widest transition-opacity duration-300 ${isExpanded ? 'opacity-0 h-0 hidden' : 'opacity-100'}`}>
                    <span className="mr-1">READ MORE</span>
                    <div className="flex">
                      <span className="text-[#A67B5B] animate-[appear_1.5s_infinite_0s]">&gt;</span>
                      <span className="text-[#A67B5B] animate-[appear_1.5s_infinite_0.2s]">&gt;</span>
                      <span className="text-[#A67B5B] animate-[appear_1.5s_infinite_0.4s]">&gt;</span>
                    </div>
                  </div>
                  <div className={`bg-[#A67B5B] shadow-[0_0_15px_rgba(166,123,91,0.4)] transition-all duration-[1000ms] ease-[cubic-bezier(0.25,1,0.5,1)] origin-top ${isExpanded ? 'w-1.5 h-[320px] lg:h-[350px]' : 'w-20 h-1.5'}`}></div>

                  {/* EXPANDED CONTENT REVEAL */}
                  <div className={`absolute -top-12 lg:-top-16 left-10 sm:left-16 w-[350px] sm:w-[500px] lg:w-[850px] xl:w-[950px] flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-14 font-rounded text-[#171827] transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${isExpanded ? 'opacity-100 translate-x-0 pointer-events-auto delay-500' : 'opacity-0 translate-x-12 pointer-events-none'}`}>

                    {/* LEFT COLUMN - MANIFESTO */}
                    <div className="flex flex-col justify-center gap-6 font-medium text-[16px] lg:text-[19px] leading-[1.6] lg:w-[45%]">
                      <p>
                        <span className="font-bold">REclose isn't just a tool; it's a shift in power.</span> It's about taking AI out of the hands of the "Big Tech" gatekeepers and putting the ability to create specialized intelligence into the hands of the individuals who actually have the ideas.
                      </p>
                      <p>
                        The future of AI isn't one giant model that knows everything—it's millions of personal models that know exactly what you need.
                      </p>
                    </div>

                    {/* RIGHT COLUMN - PREMIUM WINDOW EFFECT */}
                    <div className="lg:w-[55%] flex items-center justify-center">
                      <div className="bg-[#A67B5B] backdrop-blur-xl border border-white/20 shadow-[0_30px_80px_-15px_rgba(166,123,91,0.4)] rounded-[2.5rem] p-10 lg:p-14 flex items-center justify-center text-center w-full relative overflow-hidden group">

                        {/* SOFT WINDOW LIGHTING MASK */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20 pointer-events-none"></div>
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none"></div>

                        {/* DECORATIVE SWASH SERIF TEXT */}
                        <p className="relative z-10 font-swash italic font-semibold text-[#F4F1E1] text-[36px] sm:text-[44px] lg:text-[56px] leading-[1.05] tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                          Welcome to the <br />era of Personal <br /><span className="font-bold">Intelligence.</span>
                        </p>
                      </div>
                    </div>

                  </div>

                </div>

                <h1 className="text-[12vw] sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-bold tracking-tight mb-8 lg:mb-12 leading-[0.95] text-[#171827] font-tech uppercase whitespace-nowrap">
                  <div className={`transition-all duration-[1000ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${isExpanded ? '-translate-x-[150%] opacity-0' : 'translate-x-0 opacity-100'}`}>
                    <FallingLetters text="ELITE" scrollY={scrollY} offset={0} speed={0.4} />
                  </div>
                  <div className={`flex items-end transition-all duration-[1000ms] ease-[cubic-bezier(0.25,1,0.5,1)] delay-[100ms] ${isExpanded ? 'translate-x-[150%] opacity-0' : 'translate-x-0 opacity-100'}`}>
                    <FallingLetters text="CLOSURE" scrollY={scrollY} offset={60} speed={0.4} />
                    <span
                      className="flex flex-col text-slate-800 leading-[1.3] font-sans uppercase tracking-[0.05em] text-[10px] md:text-[12px] lg:text-[14px] font-medium whitespace-nowrap text-left mb-3 lg:mb-[14px] ml-4 md:ml-6 transition-transform duration-[50ms] ease-out"
                      style={{ transform: `translateY(${Math.min(150, Math.max(0, (scrollY * 0.4) - 200))}%)`, opacity: scrollY > 500 ? 0 : 1 }}
                    >
                      <span>10+ high-status meetings.</span>
                      <span>Monthly. On autopilot</span>
                    </span>
                  </div>
                </h1>
              </div>
            </Reveal>

            {/* Initialize Command Removed */}


          </div>

          {/* RIGHT COLUMN: SPLINE 3D ROBOT */}
          <div className="w-full lg:w-[45%] h-[400px] sm:h-[500px] lg:h-[700px] relative mt-12 lg:mt-0 flex flex-col items-center justify-center">
            <Reveal delay={200} width="100%">
              <div className="absolute inset-0 z-10 pointer-events-auto">
                <Spline scene="https://prod.spline.design/SokewL4BBPnArKiI/scene.splinecode" />
              </div>
            </Reveal>
          </div>

        </div>



      </div>

      <style>{`
        @keyframes appear {
          0%, 100% { opacity: 0; transform: translateX(-5px); }
          50% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes swing {
          0%, 100% { transform: rotate(-7deg); }
          50% { transform: rotate(7deg); }
        }
        @keyframes scrollLineBounce {
          0% { transform: translateY(-100%); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(200%); opacity: 0; }
        }
        @keyframes agentReturn {
          0% { transform: translateY(-100vh) scale(1.0); opacity: 0; }
          30% { transform: translateY(0) scale(1.0); opacity: 1; }
          45% { transform: translateY(-50px) scale(1.0); }
          65% { transform: translateY(0) scale(1.0); }
          80% { transform: translateY(-20px) scale(1.0); }
          100% { transform: translateY(0) scale(1.0); opacity: 1; }
        }
        @keyframes fallAndRollOut {
          0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
          40% { transform: translateY(50vh) rotate(90deg); opacity: 1; }
          100% { transform: translate(150vw, 50vh) rotate(1080deg); opacity: 0; }
        }
        @keyframes fallAndBounceOut {
          0% { transform: translateY(0px) translateX(0px); opacity: 1; animation-timing-function: ease-in; }
          25% { transform: translateY(50vh) translateX(10vw) scaleY(0.9); animation-timing-function: ease-out; }
          50% { transform: translateY(30vh) translateX(30vw) scaleY(1); animation-timing-function: ease-in; }
          75% { transform: translateY(50vh) translateX(50vw) scaleY(0.9); animation-timing-function: ease-out; }
          100% { transform: translateY(40vh) translateX(100vw) scaleY(1); opacity: 0; }
        }
        @keyframes orbitRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes goldSheen {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulseSize {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        .animate-orbitRotate {
          animation: orbitRotate 45s linear infinite;
        }
        .animate-goldSheen {
          background-size: 300% 300%;
          animation: goldSheen 8s ease infinite;
        }
        .cubic-bezier-reclose {
          transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        }
        /* Mask to make sure any bleeding edges of Spline canvas blend softly */
        .mask-spline {
          mask-image: radial-gradient(circle at center, black 60%, transparent 100%);
          -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
        }
      `}</style>
    </section >
  );
};

export default Hero;
