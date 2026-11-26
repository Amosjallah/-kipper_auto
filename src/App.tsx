import { useMemo, useState } from 'react';
import {
  ArrowRight,
  CarFront,
  Headphones,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import {
  BUSINESS_INFO,
  BodyStyle,
  FEATURED_BRANDS,
  ServiceMode,
  VEHICLES,
  Vehicle,
} from './data/catalog';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { SafeImage } from './components/SafeImage';
import { VehicleModal } from './components/VehicleModal';
import { FinancingModal, TradeInModal } from './components/ServiceModals';

const BODY_TABS: Array<{ label: string; value: 'ALL' | BodyStyle }> = [
  { label: 'All Vehicles', value: 'ALL' },
  { label: 'SUVs', value: 'SUV' },
  { label: 'Sedans', value: 'Sedan' },
  { label: 'Trucks', value: 'Truck' },
  { label: 'Coupes', value: 'Coupe' },
  { label: 'Hybrids', value: 'Hybrid' },
];

export default function App() {
  const [serviceMode, setServiceMode] = useState<ServiceMode>('all');
  const [selectedMake, setSelectedMake] = useState<string>('ALL');
  const [selectedBodyStyle, setSelectedBodyStyle] = useState<'ALL' | BodyStyle>('ALL');
  const [maxPrice, setMaxPrice] = useState<string>('ALL');

  const [modalVehicle, setModalVehicle] = useState<{
    vehicle: Vehicle;
    tab: 'buy' | 'rent';
  } | null>(null);
  const [isFinancingOpen, setIsFinancingOpen] = useState(false);
  const [isTradeInOpen, setIsTradeInOpen] = useState(false);

  const uniqueMakes = useMemo(
    () => Array.from(new Set(VEHICLES.map((v) => v.make))).sort(),
    []
  );

  const filteredVehicles = useMemo(() => {
    return VEHICLES.filter((v) => {
      if (serviceMode === 'sale' && !v.availableForSale) return false;
      if (serviceMode === 'rent' && !v.availableForRent) return false;
      if (selectedMake !== 'ALL' && v.make !== selectedMake) return false;
      if (selectedBodyStyle !== 'ALL' && v.bodyStyle !== selectedBodyStyle) return false;
      if (maxPrice !== 'ALL') {
        const cap = Number(maxPrice);
        if (serviceMode === 'rent') {
          if (v.dailyRentPrice > cap) return false;
        } else {
          if (v.salePrice > cap) return false;
        }
      }
      return true;
    });
  }, [serviceMode, selectedMake, selectedBodyStyle, maxPrice]);

  const handleResetFilters = () => {
    setServiceMode('all');
    setSelectedMake('ALL');
    setSelectedBodyStyle('ALL');
    setMaxPrice('ALL');
  };

  const handleSearchScroll = (e: React.FormEvent) => {
    e.preventDefault();
    const section = document.getElementById('inventory');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBrandFilter = (brand: string) => {
    setSelectedMake(brand);
    setSelectedBodyStyle('ALL');
    setMaxPrice('ALL');
    const el = document.getElementById('inventory');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-white text-[#111317]">
      <Navbar
        onOpenFinancing={() => setIsFinancingOpen(true)}
        onOpenTradeIn={() => setIsTradeInOpen(true)}
        onSelectService={(mode) => {
          setServiceMode(mode);
          setMaxPrice('ALL');
        }}
      />

      <main className="flex-1">
        {/* 3-Slide Hero Carousel */}
        <HeroSlider
          onSelectService={(mode) => {
            setServiceMode(mode);
            setMaxPrice('ALL');
          }}
          onOpenSellCar={() => setIsTradeInOpen(true)}
        />

        {/* Overlapping Dark Inventory Search Bar */}
        <section className="relative z-20 -mt-14 px-4 sm:px-6 lg:px-8">
          <form
            onSubmit={handleSearchScroll}
            className="max-w-6xl mx-auto bg-[#161920] text-white rounded-md shadow-xl border border-white/10 p-5 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Search Dealership &amp; Rental Fleet
              </h2>
              <div className="inline-flex items-center gap-1 p-1 bg-[#0E1015] rounded border border-white/10 self-start">
                {(
                  [
                    { label: 'All Cars', value: 'all' },
                    { label: 'Buy a Car', value: 'sale' },
                    { label: 'Rent a Car', value: 'rent' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setServiceMode(opt.value);
                      setMaxPrice('ALL');
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
                      serviceMode === opt.value
                        ? 'bg-[#D9232E] text-white'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Make</label>
                <select
                  value={selectedMake}
                  onChange={(e) => setSelectedMake(e.target.value)}
                  className="w-full h-11 px-3 text-sm bg-white text-[#111317] rounded border border-[#E2E5EA] focus:outline-none focus:ring-2 focus:ring-[#D9232E]"
                >
                  <option value="ALL">Any Make</option>
                  {uniqueMakes.map((make) => (
                    <option key={make} value={make}>
                      {make}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Body Style
                </label>
                <select
                  value={selectedBodyStyle}
                  onChange={(e) => setSelectedBodyStyle(e.target.value as 'ALL' | BodyStyle)}
                  className="w-full h-11 px-3 text-sm bg-white text-[#111317] rounded border border-[#E2E5EA] focus:outline-none focus:ring-2 focus:ring-[#D9232E]"
                >
                  <option value="ALL">Any Body Style</option>
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Truck">Truck</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {serviceMode === 'rent' ? 'Max Daily Rate' : 'Max Purchase Price'}
                </label>
                <select
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full h-11 px-3 text-sm bg-white text-[#111317] rounded border border-[#E2E5EA] focus:outline-none focus:ring-2 focus:ring-[#D9232E]"
                >
                  <option value="ALL">
                    {serviceMode === 'rent' ? 'Any Daily Rate' : 'Any Price'}
                  </option>
                  {serviceMode === 'rent' ? (
                    <>
                      <option value="100">Up to $100 / day</option>
                      <option value="200">Up to $200 / day</option>
                      <option value="350">Up to $350 / day</option>
                    </>
                  ) : (
                    <>
                      <option value="35000">Up to $35,000</option>
                      <option value="65000">Up to $65,000</option>
                      <option value="125000">Up to $125,000</option>
                    </>
                  )}
                </select>
              </div>

              <div className="lg:col-span-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 h-11 px-6 bg-[#D9232E] hover:bg-[#B81B25] text-white text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Search className="w-4 h-4" />
                  Search Vehicles
                </button>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="h-11 px-4 text-xs font-semibold text-slate-300 hover:text-white border border-white/20 rounded hover:border-white/40 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Section 1: Car Dealership & Rental Fleet (12 Vehicles) */}
        <section id="inventory" className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-xs font-bold uppercase tracking-widest text-[#D9232E]">
                Shop &amp; Rent Inventory
              </p>
              <h2 className="mt-1.5 text-3xl sm:text-4xl font-extrabold text-[#111317] tracking-tight text-balance">
                Dealership Showcase &amp; Rental Fleet
              </h2>
              <p className="mt-2.5 text-sm text-slate-600">
                Every vehicle is ready for outright purchase, flexible financing, or daily and
                weekly rental.
              </p>
            </div>

            {/* Body Style Tabs (Crimson Underline Active Indicator) */}
            <div className="mt-8 border-b border-[#E2E5EA] flex items-center justify-center gap-2 sm:gap-6 overflow-x-auto">
              {BODY_TABS.map((tab) => {
                const isActive = selectedBodyStyle === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setSelectedBodyStyle(tab.value)}
                    className={`pb-3 px-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'border-[#D9232E] text-[#111317]'
                        : 'border-transparent text-slate-500 hover:text-[#111317]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* 3-Column Uniform Vehicle Grid */}
            {filteredVehicles.length === 0 ? (
              <div className="mt-12 py-16 text-center bg-[#F7F8FA] rounded-md border border-[#E2E5EA]">
                <CarFront className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-[#111317]">No vehicles match your filters</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Try clearing your price cap or selecting a different body style.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-5 px-5 py-2.5 bg-[#D9232E] text-white text-xs font-bold uppercase tracking-wider rounded cursor-pointer"
                >
                  Show All Vehicles
                </button>
              </div>
            ) : (
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {filteredVehicles.map((vehicle) => (
                  <article
                    key={vehicle.id}
                    className="group bg-white border border-[#E2E5EA] rounded-md overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    {/* 4:3 Vehicle Photo */}
                    <div className="relative aspect-[4/3] w-full bg-[#111317] overflow-hidden">
                      <SafeImage
                        src={vehicle.image}
                        alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      <span className="absolute top-3 left-3 bg-[#111317]/90 text-white text-xs font-bold px-2.5 py-1 rounded-xs tabular-nums">
                        {vehicle.year}
                      </span>
                    </div>

                    {/* Card Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          {vehicle.bodyStyle} <span aria-hidden="true">·</span> {vehicle.fuelType}
                        </p>
                        <h3 className="mt-1 text-lg font-bold text-[#111317] tracking-tight">
                          {vehicle.year} {vehicle.make} {vehicle.model}{' '}
                          <span className="font-semibold text-slate-600">{vehicle.trim}</span>
                        </h3>

                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                          <span className="tabular-nums">{vehicle.mileage}</span>
                          <span aria-hidden="true">·</span>
                          <span>{vehicle.transmission}</span>
                          <span aria-hidden="true">·</span>
                          <span>{vehicle.seats} Seats</span>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-[#E2E5EA]">
                        <div className="flex items-baseline justify-between gap-2">
                          <div>
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                              Buy Price
                            </span>
                            <span className="text-2xl font-extrabold text-[#111317] tabular-nums">
                              ${vehicle.salePrice.toLocaleString()}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                              Rental Rate
                            </span>
                            <span className="text-lg font-bold text-[#D9232E] tabular-nums">
                              ${vehicle.dailyRentPrice}
                              <span className="text-xs font-medium text-slate-500">/day</span>
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={() => setModalVehicle({ vehicle, tab: 'buy' })}
                            className="py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-[#111317] bg-[#F7F8FA] hover:bg-[#111317] hover:text-white border border-[#E2E5EA] rounded transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Buy Details
                          </button>
                          <button
                            type="button"
                            onClick={() => setModalVehicle({ vehicle, tab: 'rent' })}
                            className="py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-white bg-[#D9232E] hover:bg-[#B81B25] rounded transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                          >
                            Rent Car
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Dark 4-Column Trust & Services Strip */}
        <section className="bg-[#111317] text-white py-12 border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded bg-[#D9232E]/15 border border-[#D9232E]/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#D9232E]" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider">Quality You Can Trust</h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  Every dealership and rental vehicle passes a 150-point mechanical &amp; road
                  safety inspection.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded bg-[#D9232E]/15 border border-[#D9232E]/40 flex items-center justify-center shrink-0">
                <Tag className="w-5 h-5 text-[#D9232E]" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider">Buy &amp; Sell Cars</h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  Competitive dealership pricing, instant trade-in appraisals, and direct cash
                  offers with photo upload.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded bg-[#D9232E]/15 border border-[#D9232E]/40 flex items-center justify-center shrink-0">
                <KeyRound className="w-5 h-5 text-[#D9232E]" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider">Flexible Car Rentals</h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  Daily, weekly, and chauffeur-driven rental plans ready for business trips,
                  events, or personal travel.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded bg-[#D9232E]/15 border border-[#D9232E]/40 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5 text-[#D9232E]" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider">Direct Showroom Desk</h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  Speak directly with our team anytime on{' '}
                  <a
                    href={`tel:${BUSINESS_INFO.phoneRaw}`}
                    className="text-white font-semibold underline decoration-[#D9232E] tabular-nums"
                  >
                    {BUSINESS_INFO.phoneDisplay}
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: 50/50 Split Dealership Services Banner */}
        <section id="services" className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Panel: Easy Financing */}
          <div className="relative bg-white min-h-[360px] flex items-center overflow-hidden border-b lg:border-b-0 lg:border-r border-[#E2E5EA]">
            <div className="absolute inset-y-0 right-0 w-3/5 pointer-events-none opacity-90">
              <SafeImage
                src={BUSINESS_INFO.financingBannerImage}
                alt="Pearl white luxury sedan"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
            </div>

            <div className="relative z-10 max-w-md px-8 sm:px-12 py-12">
              <p className="text-xs font-bold uppercase tracking-widest text-[#D9232E]">
                Flexible Financing
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#111317] tracking-tight text-balance">
                Drive Now, Pay Your Way
              </h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Calculate monthly installments and get pre-approved for any dealership vehicle in
                minutes.
              </p>
              <button
                type="button"
                onClick={() => setIsFinancingOpen(true)}
                className="mt-6 px-6 py-3 bg-[#D9232E] hover:bg-[#B81B25] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
              >
                Get Pre-Approved
              </button>
            </div>
          </div>

          {/* Right Panel: Sell Your Car / Value Your Trade */}
          <div className="relative bg-[#111317] text-white min-h-[360px] flex items-center overflow-hidden">
            <div className="absolute inset-0">
              <SafeImage
                src={BUSINESS_INFO.tradeBannerImage}
                alt="Showroom specialist holding vehicle smart key"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0E1014]/95 via-[#0E1014]/80 to-[#0E1014]/35" />
            </div>

            <div className="relative z-10 max-w-md px-8 sm:px-12 py-12">
              <p className="text-xs font-bold uppercase tracking-widest text-[#D9232E]">
                Sell or Trade Your Car
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight text-balance">
                What&apos;s Your Car Worth?
              </h2>
              <p className="mt-3 text-sm text-slate-200 leading-relaxed">
                Upload photos of your car and submit your vehicle details for a fast dealership
                purchase or trade-in offer.
              </p>
              <button
                type="button"
                onClick={() => setIsTradeInOpen(true)}
                className="mt-6 px-6 py-3 bg-transparent hover:bg-white hover:text-[#111317] text-white border border-white/60 text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
              >
                Sell / Value Your Car
              </button>
            </div>
          </div>
        </section>

        {/* Brands We Carry Strip */}
        <section className="py-12 bg-white border-t border-[#E2E5EA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Brands We Buy, Sell &amp; Rent
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {FEATURED_BRANDS.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => handleBrandFilter(brand)}
                  className="text-base sm:text-lg font-extrabold tracking-wider uppercase text-slate-400 hover:text-[#D9232E] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Dark 4-Column Footer */}
      <footer id="contact" className="bg-[#111317] text-slate-300 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: 3D Brand Mark */}
          <div>
            <div className="h-16 w-52 bg-white rounded p-1.5 overflow-hidden flex items-center justify-center mb-4">
              <SafeImage
                src={BUSINESS_INFO.logoImage}
                alt="$KIPPER AUTO$ 3D Logo"
                className="w-full h-full object-contain scale-[1.22]"
              />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs">
              More than a dealership. {BUSINESS_INFO.name} is your trusted automotive partner for
              buying, selling, and renting quality vehicles.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Our Services
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="#inventory"
                  onClick={() => setServiceMode('sale')}
                  className="hover:text-[#D9232E] transition-colors"
                >
                  Car Dealership Inventory
                </a>
              </li>
              <li>
                <a
                  href="#inventory"
                  onClick={() => setServiceMode('rent')}
                  className="hover:text-[#D9232E] transition-colors"
                >
                  Car Rental Fleet
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsFinancingOpen(true)}
                  className="hover:text-[#D9232E] transition-colors cursor-pointer"
                >
                  Apply for Financing
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsTradeInOpen(true)}
                  className="hover:text-[#D9232E] transition-colors cursor-pointer"
                >
                  Sell or Trade Your Car
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Customer Care
            </h3>
            <ul className="space-y-3 text-xs">
              <li>
                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  className="inline-flex items-center gap-2 text-white font-semibold hover:text-[#D9232E] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#D9232E] shrink-0" />
                  <span className="tabular-nums">{BUSINESS_INFO.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#D9232E] shrink-0" />
                  <span>{BUSINESS_INFO.email}</span>
                </a>
              </li>
              <li className="inline-flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D9232E] shrink-0 mt-0.5" />
                <span>{BUSINESS_INFO.location}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Hours */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Showroom Hours
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <p className="font-semibold text-white">Car Sales &amp; Buying</p>
                <p className="text-slate-400 mt-0.5">{BUSINESS_INFO.salesHours}</p>
                <p className="text-slate-400">Sunday: By Appointment</p>
              </div>
              <div>
                <p className="font-semibold text-white">Car Rentals Desk</p>
                <p className="text-slate-400 mt-0.5">{BUSINESS_INFO.rentalHours}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved.</p>
            <p className="tabular-nums">Direct Sales &amp; Rentals: {BUSINESS_INFO.phoneDisplay}</p>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      {modalVehicle && (
        <VehicleModal
          key={`${modalVehicle.vehicle.id}-${modalVehicle.tab}`}
          vehicle={modalVehicle.vehicle}
          initialTab={modalVehicle.tab}
          onClose={() => setModalVehicle(null)}
        />
      )}

      <FinancingModal isOpen={isFinancingOpen} onClose={() => setIsFinancingOpen(false)} />

      <TradeInModal isOpen={isTradeInOpen} onClose={() => setIsTradeInOpen(false)} />
    </div>
  );
}
