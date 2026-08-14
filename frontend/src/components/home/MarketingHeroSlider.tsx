import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Flame,
  Zap,
  ShoppingBag,
  Percent,
} from 'lucide-react';

interface SlideData {
  id: string;
  tag: string;
  tagIcon: React.ReactNode;
  title: string;
  subtitle: string;
  discountBadge: string;
  ctaText: string;
  ctaLink: string;
  bgGradient: string;
  image: string;
  accentColor: string;
}

const SLIDES: SlideData[] = [
  {
    id: 'skincare-glow',
    tag: 'MEGA BEAUTY FESTIVAL',
    tagIcon: <Flame className="w-3.5 h-3.5 text-[#F7E200]" />,
    title: '100% Certified Ayurvedic & Salon Glow Formulas',
    subtitle: 'Kumkumadi Tailam serums, 24K gold facial kits & hyaluronic moisture infusions.',
    discountBadge: 'UP TO 55% OFF + EXTRA 10% FOR PLUS MEMBERS',
    ctaText: 'SHOP SKINCARE NOW',
    ctaLink: '/shop?category=skincare',
    bgGradient: 'from-[#0B1E48] via-[#1E3A8A] to-[#2563EB]',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    accentColor: '#F7E200',
  },
  {
    id: 'hair-spa',
    tag: 'SALON PROFESSIONAL ESSENTIALS',
    tagIcon: <Sparkles className="w-3.5 h-3.5 text-[#34D399]" />,
    title: 'Intense Hair Repair & Brazilian Keratin Spa',
    subtitle: 'Moroccan argan oils, scalp detox ampoules & thermal damage protection kits.',
    discountBadge: 'BUY 1 GET 1 AT 50% OFF • SALON COMBO',
    ctaText: 'EXPLORE HAIR SPA',
    ctaLink: '/shop?category=hair-care',
    bgGradient: 'from-[#022C22] via-[#064E3B] to-[#059669]',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    accentColor: '#34D399',
  },
  {
    id: 'bridal-cosmetics',
    tag: 'BRIDAL & RUNWAY BEAUTY',
    tagIcon: <Zap className="w-3.5 h-3.5 text-[#FDA4AF]" />,
    title: 'Waterproof Velvet Mattes & HD Makeup Bases',
    subtitle: 'Dermatologically tested 18H hold foundation, velvet lipsticks & illuminating primers.',
    discountBadge: 'FLAT 40% OFF ON ORDERS OVER ₹1,499',
    ctaText: 'SHOP BRIDAL RANGE',
    ctaLink: '/shop?category=makeup',
    bgGradient: 'from-[#4C0519] via-[#881337] to-[#E11D48]',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80',
    accentColor: '#FDA4AF',
  },
  {
    id: 'parlour-wholesale',
    tag: 'PARLOUR WHOLESALE & BULK DESK',
    tagIcon: <Percent className="w-3.5 h-3.5 text-[#FDE047]" />,
    title: 'Commercial Salon Packs & Equipment Supply',
    subtitle: 'Direct from verified cosmetic labs with GST invoice & 24H express door dispatch.',
    discountBadge: 'EXTRA 20% MARGIN FOR REGISTERED MERCHANTS',
    ctaText: 'EXPLORE BULK DEALS',
    ctaLink: '/shop',
    bgGradient: 'from-[#0F172A] via-[#1E293B] to-[#2874F0]',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80',
    accentColor: '#FDE047',
  },
];

export const MarketingHeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-play every 5 seconds
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  // Touch Swipe Support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  const active = SLIDES[currentSlide];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative rounded-[4px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.12)] font-sans select-none min-h-[280px] sm:min-h-[320px] transition-all duration-700"
    >
      {/* Dynamic Background Gradient with smooth transition */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${active.bgGradient} transition-all duration-700`}
      />

      {/* Decorative High-Res Visual Thumbnail Overlay */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 sm:opacity-40 lg:opacity-60 pointer-events-none mix-blend-overlay overflow-hidden">
        <img
          src={active.image}
          alt={active.title}
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col justify-between min-h-[280px] sm:min-h-[320px] text-white max-w-3xl space-y-4">
        {/* Top Tag & Quality Guarantee */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-[2px] border border-white/10 uppercase tracking-wider">
            {active.tagIcon}
            <span>{active.tag}</span>
          </div>

          <div className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-[2px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
            <span>100% Quality Certified</span>
          </div>
        </div>

        {/* Headline & Subtitle */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight drop-shadow-sm text-white">
            {active.title}
          </h2>
          <p className="text-xs sm:text-sm text-white/90 font-normal leading-relaxed max-w-xl">
            {active.subtitle}
          </p>
        </div>

        {/* Offer Badge & Primary Call-to-Action */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <div className="bg-white text-[#212121] text-xs font-bold px-3 py-1.5 rounded-[2px] shadow-sm flex items-center gap-1.5 border border-white/20">
            <ShoppingBag className="w-3.5 h-3.5 text-[#2874F0]" />
            <span>{active.discountBadge}</span>
          </div>

          <Link
            to={active.ctaLink}
            className="bg-[#F7E200] hover:bg-[#ffe600] text-[#212121] font-bold text-xs sm:text-sm px-5 py-2 rounded-[2px] flex items-center gap-2 shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider"
          >
            <span>{active.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Interactive Progress Indicator Dots */}
        <div className="flex items-center gap-2 pt-4">
          {SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 transition-all duration-300 rounded-[2px] cursor-pointer ${
                currentSlide === idx ? 'w-8 bg-[#F7E200]' : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Left Navigation Arrow */}
      <button
        onClick={handlePrev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-[2px] bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer border border-white/10"
        title="Previous Campaign"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Right Navigation Arrow */}
      <button
        onClick={handleNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-[2px] bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer border border-white/10"
        title="Next Campaign"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
