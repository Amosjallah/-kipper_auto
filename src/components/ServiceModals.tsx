import { useRef, useState } from 'react';
import { X, Check, Calculator, CarFront, Upload, ImagePlus, Trash2 } from 'lucide-react';
import { BUSINESS_INFO } from '../data/catalog';

interface FinancingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FinancingModal({ isOpen, onClose }: FinancingModalProps) {
  const [vehicleBudget, setVehicleBudget] = useState(32000);
  const [downPayment, setDownPayment] = useState(6000);
  const [termMonths, setTermMonths] = useState(48);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const principal = Math.max(0, vehicleBudget - downPayment);
  const monthlyRate = 0.085 / 12;
  const estMonthly =
    principal > 0
      ? Math.round(
          (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
            (Math.pow(1 + monthlyRate, termMonths) - 1)
        )
      : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Dealership Financing Application"
    >
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-2xl border border-[#E2E5EA] overflow-hidden">
        <div className="px-6 py-4 bg-[#111317] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#D9232E]" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              $KIPPER AUTO$ Financing
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
            aria-label="Close financing modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#111317]">Pre-Approval Submitted</h3>
              <p className="text-sm text-slate-600">
                Thank you, <span className="font-semibold text-[#111317]">{name}</span>. Our
                financing desk will call <span className="tabular-nums font-medium">{phone}</span>{' '}
                within 2 business hours. Direct line:{' '}
                <span className="tabular-nums font-semibold">{BUSINESS_INFO.phoneDisplay}</span>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="mt-2 px-6 py-2.5 bg-[#111317] text-white text-xs font-bold uppercase tracking-wider rounded cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-4"
            >
              <div className="bg-[#F7F8FA] p-4 rounded border border-[#E2E5EA] flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Estimated Monthly Payment</span>
                  <span className="text-3xl font-extrabold text-[#111317] tabular-nums">
                    ${estMonthly.toLocaleString()}
                    <span className="text-xs font-normal text-slate-500"> / mo</span>
                  </span>
                </div>
                <span className="text-xs text-slate-600 tabular-nums text-right">
                  {termMonths} Months
                  <br />
                  8.5% Est. APR
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#111317] mb-1">
                    Vehicle Price ($)
                  </label>
                  <input
                    type="number"
                    min={5000}
                    step={500}
                    value={vehicleBudget}
                    onChange={(e) => setVehicleBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-[#E2E5EA] rounded tabular-nums focus:outline-none focus:border-[#D9232E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111317] mb-1">
                    Down Payment ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-[#E2E5EA] rounded tabular-nums focus:outline-none focus:border-[#D9232E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111317] mb-1">
                  Repayment Term
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[36, 48, 60].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTermMonths(m)}
                      className={`py-2 text-xs font-semibold rounded border cursor-pointer tabular-nums ${
                        termMonths === m
                          ? 'bg-[#111317] text-white border-[#111317]'
                          : 'bg-white text-slate-700 border-[#E2E5EA]'
                      }`}
                    >
                      {m} Months
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E2E5EA] rounded focus:outline-none focus:border-[#D9232E]"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone (+233 ...)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E2E5EA] rounded focus:outline-none focus:border-[#D9232E]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#D9232E] hover:bg-[#B81B25] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
              >
                Submit Pre-Approval Request
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

interface UploadedPhoto {
  id: string;
  name: string;
  dataUrl: string;
}

interface TradeInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TradeInModal({ isOpen, onClose }: TradeInModalProps) {
  const [sellerName, setSellerName] = useState('');
  const [phone, setPhone] = useState('');
  const [makeModel, setMakeModel] = useState('');
  const [year, setYear] = useState('2021');
  const [mileage, setMileage] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [condition, setCondition] = useState<'Excellent' | 'Good' | 'Fair'>('Good');
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    setPhotoError(null);

    const remainingSlots = 5 - photos.length;
    if (remainingSlots <= 0) {
      setPhotoError('You can attach up to 5 photos of your vehicle.');
      return;
    }

    const validFiles = Array.from(fileList)
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, remainingSlots);

    if (validFiles.length === 0) {
      setPhotoError('Please select valid image files (JPG, PNG, or WebP).');
      return;
    }

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotos((prev) => {
            if (prev.length >= 5) return prev;
            return [
              ...prev,
              {
                id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                name: file.name,
                dataUrl: reader.result as string,
              },
            ];
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    setPhotoError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (photos.length === 0) {
      setPhotoError('Please upload at least 1 photo of your car so our dealer can inspect it.');
      return;
    }
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    setSubmittedRef(`KA-SELL-${randomCode}`);
  };

  const handleResetAndClose = () => {
    setSubmittedRef(null);
    setSellerName('');
    setPhone('');
    setMakeModel('');
    setMileage('');
    setAskingPrice('');
    setPhotos([]);
    setPhotoError(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Sell or Trade Your Car"
    >
      <div className="relative w-full max-w-xl bg-white rounded-lg shadow-2xl border border-[#E2E5EA] overflow-hidden my-auto">
        <div className="px-6 py-4 bg-[#111317] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CarFront className="w-5 h-5 text-[#D9232E]" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Sell or Trade Your Vehicle
            </h2>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
            aria-label="Close sell car modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[85vh] overflow-y-auto">
          {submittedRef ? (
            <div className="py-4 space-y-5">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
                  <Check className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#D9232E]">
                  Submission #{submittedRef}
                </p>
                <h3 className="text-xl font-bold text-[#111317]">
                  Sent to $KIPPER AUTO$ Dealer Desk
                </h3>
                <p className="text-sm text-slate-600">
                  Thank you, <span className="font-semibold text-[#111317]">{sellerName}</span>.
                  Our buyer has received your vehicle details and {photos.length} uploaded{' '}
                  {photos.length === 1 ? 'photo' : 'photos'}, and will call{' '}
                  <span className="tabular-nums font-medium">{phone}</span> with a cash or trade-in
                  offer.
                </p>
              </div>

              {/* Dealer View Preview Card */}
              <div className="bg-[#F7F8FA] border border-[#E2E5EA] rounded-md p-4 space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-[#E2E5EA] pb-2">
                  <span className="font-bold uppercase tracking-wider text-[#111317]">
                    Dealer Appraisal Preview
                  </span>
                  <span className="text-slate-500">
                    {year} {makeModel}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="aspect-[4/3] rounded overflow-hidden border border-[#E2E5EA] bg-white"
                    >
                      <img
                        src={photo.dataUrl}
                        alt={`Uploaded vehicle ${year} ${makeModel}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-slate-500">Mileage: </span>
                    <span className="font-semibold text-[#111317] tabular-nums">{mileage}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Condition: </span>
                    <span className="font-semibold text-[#111317]">{condition}</span>
                  </div>
                  {askingPrice && (
                    <div className="col-span-2">
                      <span className="text-slate-500">Desired Price: </span>
                      <span className="font-semibold text-[#D9232E] tabular-nums">
                        ${Number(askingPrice).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-3 bg-[#111317] hover:bg-[#1A1D24] text-white text-xs font-bold uppercase tracking-wider rounded cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Fill in your vehicle details and upload clear photos of your car so{' '}
                <span className="font-semibold text-[#111317]">$KIPPER AUTO$</span> can inspect it
                and send you a same-day cash or trade-in offer.
              </p>

              {/* Seller Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#111317] mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Kwame Mensah"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E2E5EA] rounded focus:outline-none focus:border-[#D9232E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111317] mb-1">
                    Your Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+233 25 685 3935"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E2E5EA] rounded focus:outline-none focus:border-[#D9232E]"
                  />
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#111317] mb-1">
                    Make &amp; Model
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Toyota Camry SE"
                    value={makeModel}
                    onChange={(e) => setMakeModel(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E2E5EA] rounded focus:outline-none focus:border-[#D9232E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111317] mb-1">Year</label>
                  <input
                    type="number"
                    required
                    min={1995}
                    max={2027}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E2E5EA] rounded tabular-nums focus:outline-none focus:border-[#D9232E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#111317] mb-1">
                    Mileage (km)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 62,000 km"
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E2E5EA] rounded focus:outline-none focus:border-[#D9232E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111317] mb-1">
                    Condition
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as 'Excellent' | 'Good' | 'Fair')}
                    className="w-full px-3 py-2 text-xs border border-[#E2E5EA] rounded bg-white focus:outline-none focus:border-[#D9232E]"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111317] mb-1">
                    Asking Price ($, opt.)
                  </label>
                  <input
                    type="number"
                    min={500}
                    placeholder="e.g. 22000"
                    value={askingPrice}
                    onChange={(e) => setAskingPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E2E5EA] rounded tabular-nums focus:outline-none focus:border-[#D9232E]"
                  />
                </div>
              </div>

              {/* Car Photo Uploader */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#111317]">
                    Upload Car Photos (for Dealer Inspection)
                  </label>
                  <span className="text-[11px] text-slate-500 tabular-nums">
                    {photos.length} / 5 photos
                  </span>
                </div>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    processFiles(e.dataTransfer.files);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-[#D9232E] bg-[#D9232E]/5'
                      : 'border-[#CBD2DC] hover:border-[#D9232E] bg-[#F7F8FA]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      processFiles(e.target.files);
                      e.target.value = '';
                    }}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-9 h-9 rounded-full bg-white border border-[#E2E5EA] flex items-center justify-center text-[#D9232E]">
                      {photos.length > 0 ? (
                        <ImagePlus className="w-4 h-4" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </div>
                    <p className="text-xs font-semibold text-[#111317]">
                      Click to upload or drag &amp; drop car photos
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Front, rear, and interior photos (JPG, PNG, WebP · up to 5 images)
                    </p>
                  </div>
                </div>

                {photoError && (
                  <p className="mt-1.5 text-xs font-medium text-[#D9232E]" role="alert">
                    {photoError}
                  </p>
                )}

                {photos.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="relative group aspect-[4/3] rounded overflow-hidden border border-[#E2E5EA] bg-[#111317]"
                      >
                        <img
                          src={photo.dataUrl}
                          alt={photo.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removePhoto(photo.id);
                          }}
                          aria-label={`Remove ${photo.name}`}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/75 hover:bg-[#D9232E] text-white flex items-center justify-center cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#D9232E] hover:bg-[#B81B25] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
              >
                Submit Car &amp; Photos to Dealer
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
