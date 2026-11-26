import { useState, useMemo } from 'react';
import { X, Check, Calendar, Phone, ShieldCheck, Gauge, Fuel, Users, Cog } from 'lucide-react';
import { BUSINESS_INFO, Vehicle } from '../data/catalog';
import { SafeImage } from './SafeImage';

interface VehicleModalProps {
  vehicle: Vehicle | null;
  initialTab?: 'buy' | 'rent';
  onClose: () => void;
}

export function VehicleModal({ vehicle, initialTab = 'buy', onClose }: VehicleModalProps) {
  const [activeTab, setActiveTab] = useState<'buy' | 'rent'>(initialTab);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pickupDate, setPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });
  const [driverOption, setDriverOption] = useState<'self' | 'chauffeur'>('self');
  const [paymentPlan, setPaymentPlan] = useState<'cash' | 'finance'>('finance');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const rentalDays = useMemo(() => {
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [pickupDate, returnDate]);

  if (!vehicle) return null;

  const chauffeurFeePerDay = driverOption === 'chauffeur' ? 35 : 0;
  const baseRentalSubtotal =
    rentalDays >= 7
      ? Math.floor(rentalDays / 7) * vehicle.weeklyRentPrice +
        (rentalDays % 7) * vehicle.dailyRentPrice
      : rentalDays * vehicle.dailyRentPrice;
  const totalRentalCost = baseRentalSubtotal + rentalDays * chauffeurFeePerDay;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomId = Math.floor(1000 + Math.random() * 9000);
    setSubmittedRef(`KA-${activeTab === 'buy' ? 'BUY' : 'RNT'}-${randomId}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vehicle-modal-title"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden my-auto border border-[#E2E5EA]">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#111317] flex items-center justify-center shadow-sm border border-[#E2E5EA] cursor-pointer"
          aria-label="Close vehicle details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left Showcase Column */}
          <div className="md:col-span-6 bg-[#F7F8FA] flex flex-col justify-between p-6 border-b md:border-b-0 md:border-r border-[#E2E5EA]">
            <div>
              <div className="aspect-[4/3] w-full overflow-hidden rounded bg-[#111317] mb-5">
                <SafeImage
                  src={vehicle.image}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-xs font-semibold uppercase tracking-wider text-[#D9232E]">
                {vehicle.bodyStyle} · Stock {vehicle.vin}
              </p>
              <h2
                id="vehicle-modal-title"
                className="text-2xl font-bold text-[#111317] mt-1 tracking-tight"
              >
                {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
              </h2>

              <div className="grid grid-cols-2 gap-3 mt-5 text-xs text-slate-600">
                <div className="flex items-center gap-2 bg-white p-2.5 rounded border border-[#E2E5EA]">
                  <Gauge className="w-4 h-4 text-[#D9232E] shrink-0" />
                  <span className="tabular-nums font-medium">{vehicle.mileage}</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2.5 rounded border border-[#E2E5EA]">
                  <Cog className="w-4 h-4 text-[#D9232E] shrink-0" />
                  <span className="font-medium">{vehicle.transmission}</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2.5 rounded border border-[#E2E5EA]">
                  <Fuel className="w-4 h-4 text-[#D9232E] shrink-0" />
                  <span className="font-medium">{vehicle.fuelType}</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2.5 rounded border border-[#E2E5EA]">
                  <Users className="w-4 h-4 text-[#D9232E] shrink-0" />
                  <span className="font-medium">{vehicle.seats} Seats · {vehicle.drivetrain}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#E2E5EA]">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Key Equipment
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#111317]">
                  {vehicle.highlights.map((item) => (
                    <li key={item} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#D9232E] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E2E5EA] flex items-center justify-between text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#D9232E]" />
                150-Point Certified Inspection
              </span>
              <a
                href={`tel:${BUSINESS_INFO.phoneRaw}`}
                className="inline-flex items-center gap-1 font-semibold text-[#111317] hover:text-[#D9232E]"
              >
                <Phone className="w-3.5 h-3.5 text-[#D9232E]" />
                <span className="tabular-nums">{BUSINESS_INFO.phoneDisplay}</span>
              </a>
            </div>
          </div>

          {/* Right Action & Booking Column */}
          <div className="md:col-span-6 p-6 flex flex-col justify-between">
            {submittedRef ? (
              <div className="my-auto py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
                  <Check className="w-7 h-7" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#D9232E]">
                  Confirmation #{submittedRef}
                </p>
                <h3 className="text-2xl font-bold text-[#111317]">
                  {activeTab === 'buy' ? 'Purchase Inquiry Received' : 'Rental Reservation Confirmed'}
                </h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold text-[#111317]">{fullName}</span>. Our
                  showroom specialist at <span className="font-semibold">$KIPPER AUTO$</span> will
                  contact you on <span className="tabular-nums font-medium">{phone}</span> shortly.
                </p>
                <div className="bg-[#F7F8FA] rounded p-4 text-left text-xs space-y-1.5 border border-[#E2E5EA] max-w-sm mx-auto">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Vehicle</span>
                    <span className="font-semibold text-[#111317]">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </span>
                  </div>
                  {activeTab === 'rent' ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Rental Window</span>
                        <span className="tabular-nums font-medium">
                          {pickupDate} to {returnDate} ({rentalDays} days)
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-[#E2E5EA] pt-1.5 mt-1.5">
                        <span className="font-semibold text-[#111317]">Estimated Total</span>
                        <span className="tabular-nums font-bold text-[#D9232E]">
                          ${totalRentalCost.toLocaleString()}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dealership Price</span>
                      <span className="tabular-nums font-bold text-[#D9232E]">
                        ${vehicle.salePrice.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-4 px-6 py-2.5 bg-[#111317] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[#1A1D24] cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                {/* Service Switcher: Buy vs Rent */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-[#F1F3F6] rounded-md mb-5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('buy')}
                    className={`py-2 px-3 text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer whitespace-nowrap ${
                      activeTab === 'buy'
                        ? 'bg-[#111317] text-white shadow-xs'
                        : 'text-slate-600 hover:text-[#111317]'
                    }`}
                  >
                    Buy Vehicle
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('rent')}
                    className={`py-2 px-3 text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer whitespace-nowrap ${
                      activeTab === 'rent'
                        ? 'bg-[#D9232E] text-white shadow-xs'
                        : 'text-slate-600 hover:text-[#111317]'
                    }`}
                  >
                    Rent Vehicle
                  </button>
                </div>

                {/* Pricing Summary */}
                {activeTab === 'buy' ? (
                  <div className="flex items-baseline justify-between pb-4 mb-4 border-b border-[#E2E5EA]">
                    <div>
                      <span className="text-xs text-slate-500 block">Dealership Price</span>
                      <span className="text-3xl font-extrabold text-[#111317] tabular-nums">
                        ${vehicle.salePrice.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-600">
                      Est. ${Math.round((vehicle.salePrice * 0.85) / 60).toLocaleString()}/mo · 60 mos
                    </span>
                  </div>
                ) : (
                  <div className="flex items-baseline justify-between pb-4 mb-4 border-b border-[#E2E5EA]">
                    <div>
                      <span className="text-xs text-slate-500 block">Rental Rate</span>
                      <span className="text-3xl font-extrabold text-[#D9232E] tabular-nums">
                        ${vehicle.dailyRentPrice}
                        <span className="text-sm font-medium text-slate-500"> / day</span>
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-600 tabular-nums">
                      Weekly Rate: ${vehicle.weeklyRentPrice}/wk
                    </span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {activeTab === 'rent' ? (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#111317] mb-1">
                            Pickup Date
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              required
                              value={pickupDate}
                              onChange={(e) => setPickupDate(e.target.value)}
                              className="w-full px-3 py-2 text-xs border border-[#E2E5EA] rounded focus:outline-none focus:border-[#D9232E]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#111317] mb-1">
                            Return Date
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              required
                              min={pickupDate}
                              value={returnDate}
                              onChange={(e) => setReturnDate(e.target.value)}
                              className="w-full px-3 py-2 text-xs border border-[#E2E5EA] rounded focus:outline-none focus:border-[#D9232E]"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#111317] mb-1">
                          Driving Preference
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setDriverOption('self')}
                            className={`py-2 px-3 text-xs font-medium rounded border cursor-pointer ${
                              driverOption === 'self'
                                ? 'border-[#111317] bg-[#111317] text-white'
                                : 'border-[#E2E5EA] text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            Self-Drive (Included)
                          </button>
                          <button
                            type="button"
                            onClick={() => setDriverOption('chauffeur')}
                            className={`py-2 px-3 text-xs font-medium rounded border cursor-pointer ${
                              driverOption === 'chauffeur'
                                ? 'border-[#111317] bg-[#111317] text-white'
                                : 'border-[#E2E5EA] text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            Chauffeur (+$35/day)
                          </button>
                        </div>
                      </div>

                      <div className="bg-[#F7F8FA] p-3 rounded border border-[#E2E5EA] flex items-center justify-between text-xs">
                        <span className="inline-flex items-center gap-1.5 text-slate-600">
                          <Calendar className="w-3.5 h-3.5 text-[#D9232E]" />
                          <span className="tabular-nums font-medium">{rentalDays} Days Total</span>
                        </span>
                        <span className="text-base font-bold text-[#111317] tabular-nums">
                          ${totalRentalCost.toLocaleString()}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-[#111317] mb-1">
                        Purchase Preference
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentPlan('finance')}
                          className={`py-2 px-3 text-xs font-medium rounded border cursor-pointer ${
                            paymentPlan === 'finance'
                              ? 'border-[#111317] bg-[#111317] text-white'
                              : 'border-[#E2E5EA] text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          Dealership Financing
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentPlan('cash')}
                          className={`py-2 px-3 text-xs font-medium rounded border cursor-pointer ${
                            paymentPlan === 'cash'
                              ? 'border-[#111317] bg-[#111317] text-white'
                              : 'border-[#E2E5EA] text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          Direct Cash / Transfer
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#111317] mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Kwame Mensah"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#E2E5EA] rounded focus:outline-none focus:border-[#D9232E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#111317] mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+233 25 000 0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#E2E5EA] rounded focus:outline-none focus:border-[#D9232E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#111317] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#E2E5EA] rounded focus:outline-none focus:border-[#D9232E]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-[#D9232E] hover:bg-[#B81B25] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
                  >
                    {activeTab === 'buy'
                      ? 'Reserve Vehicle / Request Test Drive'
                      : `Confirm Rental Booking ($${totalRentalCost.toLocaleString()})`}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
