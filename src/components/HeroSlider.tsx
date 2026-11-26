import { useEffect, useState } from 'react';
import { Calendar, CarFront, ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES, HeroSlide } from '../data/catalog';
import { SafeImage } from './SafeImage';

interface HeroSliderProps {
  onSelectService: (mode: 'sale' | 'rent') => void;
  onOpenSellCar: () => void;
}

export function HeroSlider({ onSelectService, onOpenSellCar }: HeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isPaused || prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handleCtaAction = (action: HeroSlide['primaryCtaAction']) => {
    if (action === 'sell') {
      onOpenSellCar();
      return;
    }
    onSelectService(action);
    const el = document.getElementById('inventory');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const currentSlide = HERO_SLIDES[activeIndex];

  return (
    <section
      className="relative bg-[#111317] text-white overflow-hidden min-h-[560px] sm:min-h-[640px] lg:min-h-[700px] flex items-center justify-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured Vehicle Showcase"
    >
      {/* Background Slides Stack */}
      <div className="absolute inset-0">
        {HERO_SLIDES.map((slide, idx) => {
          const isCurrent = idx === activeIndex;
          return (
            <div
              key={slide.id}
              aria-hidden={!isCurrent}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                isCurrent ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'
              }`}
            >
              <SafeImage
                src={slide.image}
                alt={slide.imageAlt}
                className={`w-full h-full object-cover object-center transition-transform duration-1000 ${
                  isCurrent ? 'scale-105 sm:scale-110' : 'scale-100'
                }`}
              />
            </div>
          );
        })}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#0B0D11]/75 via-[#0B0D11]/55 to-[#0B0D11]/85" />
      </div>

      {/* Previous / Next Controls */}
      <button
        type="button"
        onClick={goPrev}
        aria-label="Previous slide"
        className="hidden sm:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-[#D9232E] text-white border border-white/25 items-center justify-center transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={goNext}
        aria-label="Next slide"
        className="hidden sm:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-[#D9232E] text-white border border-white/25 items-center justify-center transition-colors cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Centered Content Overlay */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 pt-16 pb-32 sm:pt-20 sm:pb-36 flex flex-col items-center justify-center text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#D9232E] mb-3">
            {currentSlide.kicker}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-extrabold tracking-tight leading-[1.08] text-balance drop-shadow-md">
            {currentSlide.headlineStart}
            <span className="text-[#D9232E]">{currentSlide.headlineAccent}</span>
            {currentSlide.headlineEnd}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-100 max-w-2xl mx-auto leading-relaxed drop-shadow-xs">
            {currentSlide.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => handleCtaAction(currentSlide.primaryCtaAction)}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-[#D9232E] hover:bg-[#B81B25] rounded transition-colors whitespace-nowrap shadow-lg cursor-pointer"
            >
              {currentSlide.primaryCtaAction === 'sell' && <CarFront className="w-4 h-4" />}
              {currentSlide.primaryCtaLabel}
            </button>
            <button
              type="button"
              onClick={() => handleCtaAction(currentSlide.secondaryCtaAction)}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-[#111317]/80 hover:bg-[#111317] border border-white/40 rounded transition-colors whitespace-nowrap shadow-lg cursor-pointer"
            >
              {currentSlide.secondaryCtaAction === 'rent' && (
                <Calendar className="w-4 h-4 text-[#D9232E]" />
              )}
              {currentSlide.secondaryCtaLabel}
            </button>
          </div>
        </div>

        {/* 3-Slide Indicator Bars */}
        <div
          className="mt-10 flex items-center justify-center gap-3"
          role="tablist"
          aria-label="Choose showcase slide"
        >
          {HERO_SLIDES.map((slide, idx) => {
            const isCurrent = idx === activeIndex;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                aria-label={`Slide ${idx + 1}: ${slide.kicker}`}
                onClick={() => setActiveIndex(idx)}
                className="group py-2 px-1 cursor-pointer focus-visible:outline-none"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? 'w-12 bg-[#D9232E]'
                      : 'w-6 bg-white/40 group-hover:bg-white/75'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
