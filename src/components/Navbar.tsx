import { Phone, MapPin, Clock, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { BUSINESS_INFO } from '../data/catalog';
import { SafeImage } from './SafeImage';

interface NavbarProps {
  onOpenFinancing: () => void;
  onOpenTradeIn: () => void;
  onSelectService: (mode: 'all' | 'sale' | 'rent') => void;
}

export function Navbar({ onOpenFinancing, onOpenTradeIn, onSelectService }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavService = (mode: 'all' | 'sale' | 'rent', hash: string) => {
    onSelectService(mode);
    setMobileMenuOpen(false);
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="sticky top-0 z-40 w-full">
      {/* Slim Utility Contact Strip */}
      <div className="bg-[#111317] text-slate-300 border-b border-white/10 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 truncate">
            <span className="hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap">
              <MapPin className="w-3.5 h-3.5 text-[#D9232E] shrink-0" />
              {BUSINESS_INFO.location}
            </span>
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="inline-flex items-center gap-1.5 text-white font-medium hover:text-[#D9232E] transition-colors whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-[#D9232E] shrink-0" />
              <span className="tabular-nums">{BUSINESS_INFO.phoneDisplay}</span>
            </a>
          </div>
          <div className="hidden md:flex items-center gap-5 text-slate-300 whitespace-nowrap">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D9232E] shrink-0" />
              Sales: Mon–Sat 8am–7pm
            </span>
            <span aria-hidden="true" className="text-white/25">|</span>
            <span>Rentals: Daily 7am–9pm</span>
          </div>
        </div>
      </div>

      {/* Main 3-Zone Top Navigation Bar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#E2E5EA] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Brand 3D Emblem */}
          <a
            href="#top"
            className="flex items-center shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9232E] rounded"
            aria-label="$KIPPER AUTO$ Home"
          >
            <div className="h-14 sm:h-16 w-44 sm:w-56 overflow-hidden rounded bg-white flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.03]">
              <SafeImage
                src={BUSINESS_INFO.logoImage}
                alt="$KIPPER AUTO$ 3D Metallic Logo"
                className="w-full h-full object-contain scale-[1.24]"
                fallbackLabel="$KIPPER AUTO$"
              />
            </div>
          </a>

          {/* Zone 2: Concise Single-Line Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-semibold tracking-wide text-[#111317]">
            <a
              href="#inventory"
              onClick={(e) => {
                e.preventDefault();
                handleNavService('sale', '#inventory');
              }}
              className="hover:text-[#D9232E] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-[#D9232E]"
            >
              Buy a Car
            </a>
            <a
              href="#inventory"
              onClick={(e) => {
                e.preventDefault();
                handleNavService('rent', '#inventory');
              }}
              className="hover:text-[#D9232E] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-[#D9232E]"
            >
              Car Rentals
            </a>
            <button
              type="button"
              onClick={onOpenTradeIn}
              className="hover:text-[#D9232E] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-[#D9232E] cursor-pointer"
            >
              Sell Your Car
            </button>
            <a
              href="#services"
              className="hover:text-[#D9232E] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-[#D9232E]"
            >
              Financing
            </a>
            <a
              href="#contact"
              className="hover:text-[#D9232E] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-[#D9232E]"
            >
              Contact
            </a>
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenFinancing}
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#D9232E] hover:bg-[#B81B25] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#D9232E]"
            >
              Get Pre-Approved
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded border border-[#E2E5EA] text-[#111317] hover:bg-slate-50 cursor-pointer"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-[#E2E5EA] px-4 py-4 space-y-2">
            <a
              href="#inventory"
              onClick={(e) => {
                e.preventDefault();
                handleNavService('sale', '#inventory');
              }}
              className="block py-2.5 px-3 text-sm font-semibold text-[#111317] hover:bg-slate-50 rounded"
            >
              Buy a Car
            </a>
            <a
              href="#inventory"
              onClick={(e) => {
                e.preventDefault();
                handleNavService('rent', '#inventory');
              }}
              className="block py-2.5 px-3 text-sm font-semibold text-[#111317] hover:bg-slate-50 rounded"
            >
              Car Rentals
            </a>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTradeIn();
              }}
              className="w-full text-left block py-2.5 px-3 text-sm font-semibold text-[#111317] hover:bg-slate-50 rounded cursor-pointer"
            >
              Sell Your Car
            </button>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 text-sm font-semibold text-[#111317] hover:bg-slate-50 rounded"
            >
              Financing
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 text-sm font-semibold text-[#111317] hover:bg-slate-50 rounded"
            >
              Contact
            </a>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenFinancing();
              }}
              className="w-full mt-2 py-3 px-4 text-xs font-bold uppercase tracking-wider text-white bg-[#D9232E] hover:bg-[#B81B25] rounded cursor-pointer"
            >
              Get Pre-Approved
            </button>
          </div>
        )}
      </header>
    </div>
  );
}
