import React, { useState } from 'react';
import { Room } from '../types';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Bed, 
  Maximize, 
  Wifi, 
  Wind, 
  Tv, 
  Coffee, 
  GlassWater as MiniBar, 
  Monitor as Desk, 
  Calendar, 
  User, 
  Info, 
  CheckCircle, 
  ChevronRight,
  Share2,
  Images,
  Play
} from 'lucide-react';

interface RoomDetailProps {
  room: Room;
  onBack: () => void;
  onBook: (checkIn: string, checkOut: string, guests: string) => void;
}

export default function RoomDetail({ room, onBack, onBook }: RoomDetailProps) {
  // Booking sidebar configuration
  const [checkIn, setCheckIn] = useState('2026-10-24');
  const [checkOut, setCheckOut] = useState('2026-10-28');
  const [occupancy, setOccupancy] = useState('2 Adults');

  // Interactive tour state
  const [activeTour, setActiveTour] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Helper: calculate date difference
  const calculateNights = (startStr: string, endStr: string) => {
    try {
      const start = new Date(startStr);
      const end = new Date(endStr);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return isNaN(diffDays) ? 4 : diffDays;
    } catch {
      return 4;
    }
  };

  const nights = calculateNights(checkIn, checkOut);
  const nightlyTotal = room.price * nights;
  const serviceFee = 120;
  const occupancyTax = Math.round(nightlyTotal * 0.12);
  const totalCharge = nightlyTotal + serviceFee + occupancyTax;

  const handleShare = () => {
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const renderAmenityWithIcon = (name: string, description: string, icon: React.ReactNode) => (
    <div className="flex items-center gap-4 p-4 bg-white hover:bg-[#efedf0] transition-colors rounded-xl border border-[#E2E8F0]">
      <div className="w-10 h-10 rounded-full bg-[#9ef2e1]/30 flex items-center justify-center text-[#0e7163]">
        {icon}
      </div>
      <div className="text-left">
        <span className="font-semibold text-sm text-[#1b1b1e] block">{name}</span>
        <span className="text-xs text-[#75777f]">{description}</span>
      </div>
    </div>
  );

  return (
    <section className="min-h-screen text-[#1b1b1e]">
      
      {/* Top Hero Room Banner */}
      <div className="relative w-full h-[55vh] md:h-[65vh] overflow-hidden">
        <img 
          className="w-full h-full object-cover referral-no-referrer"
          src={room.image}
          alt={room.name}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#031635]/80 via-transparent to-transparent"></div>
        
        {/* Navigation Elements */}
        <div className="absolute top-6 left-6 right-6 md:left-12 md:right-12 flex justify-between items-center z-10">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white/90 text-[#031635] text-xs font-bold rounded-lg hover:bg-white transition-all shadow select-none uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Available Rooms</span>
          </button>
        </div>

        {/* Info panel bottom-aligned overlay */}
        <div className="absolute bottom-8 left-6 right-6 md:left-12 md:right-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-white text-left">
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#9ef2e1] text-[#0e7163] text-xs font-bold mb-4 select-none">
              Premium Selection
            </span>
            <h2 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">{room.name}</h2>
            <p className="text-white/90 text-sm md:text-base max-w-2xl leading-relaxed">
              The pinnacle of luxury living featuring a private balcony, separate living area, and a masterfully designed marble ensuite bathroom.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all text-xs font-semibold select-none">
              <Images className="w-4 h-4" />
              <span>View Gallery</span>
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all text-xs font-semibold select-none relative"
            >
              <Share2 className="w-4 h-4" />
              <span>{shareCopied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout Block */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 text-[#1b1b1e]">
        
        {/* Left main details panel (Spans 8 cols) */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Room Description */}
          <div className="text-left">
            <h3 className="text-2xl font-bold text-[#031635] mb-5 tracking-tight border-b border-[#E2E8F0] pb-3">
              Room Description
            </h3>
            <p className="text-base text-[#44474e] leading-relaxed">
              The {room.name} offers an unparalleled luxury hospitality experience designed specifically for the discerning global traveler. Spanning {room.size} of meticulously curated workspace and premium comforts, this suite seamlessly blends contemporary modern style with functional automation. Enjoy breathtaking city panoramas from your private balcony, or unwind in the expansive living zone equipped with smart home controls, a Nespresso station, and a customizable mini bar. The Italian marble ensuite is a private sanctuary featuring a high-pressure rainfall shower, plush towels, and organic amenities.
            </p>
          </div>

          {/* Key Info Bento block */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#f5f3f6] p-6 rounded-xl border border-[#E2E8F0] flex flex-col items-center text-center shadow-sm">
              <Users className="text-[#031635] mb-3 w-8 h-8" />
              <p className="text-[10px] text-[#75777f] uppercase tracking-wider font-semibold">Capacity</p>
              <p className="font-bold text-lg text-[#031635] mt-1">{room.capacity}</p>
            </div>
            <div className="bg-[#f5f3f6] p-6 rounded-xl border border-[#E2E8F0] flex flex-col items-center text-center shadow-sm">
              <Bed className="text-[#031635] mb-3 w-8 h-8" />
              <p className="text-[10px] text-[#75777f] uppercase tracking-wider font-semibold">Bed Type</p>
              <p className="font-bold text-lg text-[#031635] mt-1">{room.bedType}</p>
            </div>
            <div className="bg-[#f5f3f6] p-6 rounded-xl border border-[#E2E8F0] flex flex-col items-center text-center shadow-sm">
              <Maximize className="text-[#031635] mb-3 w-8 h-8" />
              <p className="text-[10px] text-[#75777f] uppercase tracking-wider font-semibold">Room Size</p>
              <p className="font-bold text-lg text-[#031635] mt-1">{room.size}</p>
            </div>
          </div>

          {/* Amenities details column */}
          <div className="text-left">
            <h3 className="text-2xl font-bold text-[#031635] mb-6 tracking-tight border-b border-[#E2E8F0] pb-3">
              World-Class Amenities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {renderAmenityWithIcon('High-speed WiFi', 'Symmetric gigabit pipe', <Wifi className="w-5 h-5" />)}
              {renderAmenityWithIcon('Climate Control', 'Smart air cooling integration', <Wind className="w-5 h-5" />)}
              {renderAmenityWithIcon('Mini Bar', 'Curated local selection', <MiniBar className="w-5 h-5" />)}
              {renderAmenityWithIcon('Smart TV', '55 inch high-dynamic matrix', <Tv className="w-5 h-5" />)}
              {renderAmenityWithIcon('Nespresso Machine', 'Artisanal roasts provided', <Coffee className="w-5 h-5" />)}
              {renderAmenityWithIcon('Work Desk', 'Sleek dark oak layout', <Desk className="w-5 h-5" />)}
            </div>
          </div>

        </div>

        {/* Right sticky Booking sidebar panel (Spans 4 cols) */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="sticky top-24 bg-white border border-[#E2E8F0] rounded-2xl p-6 md:p-8 shadow-md text-left">
            
            {/* Price indicator header */}
            <div className="flex justify-between items-baseline mb-6 border-b border-[#E2E8F0] pb-4">
              <div>
                <p className="text-[10px] text-[#75777f] uppercase tracking-widest font-bold">Price per Night</p>
                <h4 className="text-2xl md:text-3xl font-black text-[#031635] mt-0.5">${room.price}</h4>
              </div>
              <div className="text-right flex items-center gap-1.5 text-[#4A9E8F] font-semibold text-xs">
                <CheckCircle className="w-4 h-4" />
                <span>Available</span>
              </div>
            </div>

            {/* Checkin / Dates interactive inputs */}
            <div className="space-y-4 mb-6">
              
              <div className="p-3 bg-[#f5f3f6] rounded-xl border border-[#E2E8F0]">
                <label className="block text-[10px] text-[#75777f] mb-1.5 uppercase font-bold tracking-wider">
                  Check-In & Check-Out Dates
                </label>
                <div className="flex items-center gap-1.5">
                  <input 
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="bg-transparent font-semibold border-none text-xs focus:ring-0 text-[#031635] w-full"
                  />
                  <span className="text-xs text-[#75777f]">-</span>
                  <input 
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="bg-transparent font-semibold border-none text-xs focus:ring-0 text-[#031635] w-full"
                  />
                </div>
              </div>

              <div className="p-4 bg-[#f5f3f6] rounded-xl border border-[#E2E8F0]">
                <label className="block text-[10px] text-[#75777f] mb-1.5 uppercase font-bold tracking-wider">
                  Occupancy
                </label>
                <select
                  value={occupancy}
                  onChange={(e) => setOccupancy(e.target.value)}
                  className="bg-transparent font-semibold border-none text-xs focus:ring-0 text-[#031635] w-full p-0"
                >
                  <option value="1 Adult">1 Adult</option>
                  <option value="2 Adults">2 Adults</option>
                  <option value="2 Adults, 1 Child">2 Adults, 1 Child</option>
                  <option value="3 Adults">3 Adults</option>
                </select>
              </div>

            </div>

            {/* Price Calculations */}
            <div className="space-y-3.5 mb-6 text-sm">
              <div className="flex justify-between text-[#44474e]">
                <span>${room.price} x {nights} nights</span>
                <span className="font-semibold text-[#1b1b1e]">${nightlyTotal}</span>
              </div>
              <div className="flex justify-between text-[#44474e]">
                <span>Premium Service Fee</span>
                <span className="font-semibold text-[#1b1b1e]">${serviceFee}</span>
              </div>
              <div className="flex justify-between text-[#44474e]">
                <span>Occupancy Tax (12%)</span>
                <span className="font-semibold text-[#1b1b1e]">${occupancyTax}</span>
              </div>
              <div className="pt-4 border-t border-[#E2E8F0] flex justify-between items-center text-base">
                <span className="font-bold text-[#031635]">Est. Total Price</span>
                <span className="font-black text-xl text-[#031635]">${totalCharge}</span>
              </div>
            </div>

            {/* Action CTA booking buttons */}
            <button 
              onClick={() => onBook(checkIn, checkOut, occupancy)}
              className="w-full py-4 bg-[#006b5e] hover:bg-[#005046] text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-widest select-none active:scale-[0.98]"
            >
              <span>Book Now</span>
              <ChevronRight className="w-5 h-5 animate-pulse" />
            </button>
            <p className="text-center mt-4 text-[11px] text-[#75777f]">
              Guaranteed lowest rates. Free cancellation up to 48 hours prior.
            </p>
          </div>
        </div>

      </div>

      {/* Secondary Section: Immersive virtual tour segment */}
      <section className="bg-[#0F172A] text-white py-14 mt-12 rounded-3xl overflow-hidden shadow-xl p-8 md:p-12">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center gap-12 text-left">
          
          <div className="w-full md:w-1/2 space-y-6">
            <h3 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Immersive Experience
            </h3>
            <p className="text-white/70 text-sm md:text-base leading-relaxed">
              Take a 360-degree high-definition virtual tour of our premium {room.name} and explore every detail from the cozy comfort of your device. From the premium textures of the Italian marble to the breathtaking cityscape vistas, discover the true essence of state-of-the-art hospitality.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => setActiveTour(true)}
                className="px-6 py-3 bg-[#9ef2e1] text-[#00201b] font-bold text-xs rounded-full hover:opacity-95 transition-opacity uppercase tracking-wider"
              >
                Start Virtual Tour
              </button>
              <button 
                onClick={() => alert('Starting video walkthrough... Enjoy!')}
                className="px-6 py-3 border border-white/20 hover:border-white/40 text-white font-bold text-xs rounded-full hover:bg-white/10 transition-all uppercase tracking-wider"
              >
                Video Walkthrough
              </button>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="aspect-video w-full rounded-xl overflow-hidden relative group shadow-2xl border border-white/10 bg-[#031635]">
              {activeTour ? (
                <div className="absolute inset-0 bg-[#031635] flex flex-col items-center justify-center p-6 text-center text-[#9ef2e1] overflow-hidden">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#9ef2e1] mb-3"></div>
                  <span className="font-bold text-sm tracking-wide">Calibrating 360° Gyroscope...</span>
                  <p className="text-xs text-white/70 mt-1 max-w-sm">Move your screen or drag with your pointer to rotate spatial perspective</p>
                  <button 
                    onClick={() => setActiveTour(false)}
                    className="mt-4 text-xs font-semibold hover:underline text-white bg-white/10 px-3 py-1.5 rounded-lg"
                  >
                    Close spatial view
                  </button>
                </div>
              ) : (
                <>
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5pJROwwmIFIfuU3tJ6f0WE_guVgIe2EK9F_AHmLbrV2jQ7TRk59hsthkaDRANF4FnktB7_iS2U1mQiYXWzJtCfsYENADAae0uELdb5hqsuRn8kIbNBtFDgkIc3uwiKZFNboIDD074P2lm8ikx4fTSDLasYIiUXSXLXhdyyGqWI4NzAzU3H8IpesZrOPhJohY2g_nUlyhQNSRoDfU_c4e0Em2LV_DuBI5EsAKRx8zyQ1ecZ8IDIarBQ4hqhLHPRinWlG29zOJqz6M" 
                    alt="Suite Desk close up details" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 referral-no-referrer"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-all">
                    <button 
                      onClick={() => setActiveTour(true)}
                      className="w-16 h-16 bg-[#031635]/80 hover:bg-[#031635] text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-xl border border-white/15"
                    >
                      <Play className="w-6 h-6 fill-current pl-1" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </section>

    </section>
  );
}
