import React from 'react';
import { Booking, RecommendedStay } from '../types';
import { RECOMMENDED_STAYS } from '../roomsData';
import { 
  Compass, 
  Award, 
  CalendarCheck, 
  Heart, 
  Star, 
  ArrowRight, 
  Sparkles,
  PlaneTakeoff,
  Luggage,
  Calendar
} from 'lucide-react';

interface GuestDashboardProps {
  bookings: Booking[];
  onSelectRecommended: (roomId: string) => void;
  onNavigate: (view: string) => void;
  onCancelBooking?: (bookingId: string) => void;
}

export default function GuestDashboard({ 
  bookings, 
  onSelectRecommended, 
  onNavigate,
  onCancelBooking
}: GuestDashboardProps) {

  // Default initial recommended stays
  const recommendedList: RecommendedStay[] = RECOMMENDED_STAYS;

  // Active bookings list
  const activeBookings = bookings.filter(b => b.status !== 'CANCELLED');

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10 space-y-10 text-left text-[#1b1b1e]">
      
      {/* Hero Welcome Banner and Loyalty panel */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Welcome message */}
        <div className="lg:col-span-2 flex flex-col justify-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1a2b4b]/10 text-[#031635] text-xs font-bold rounded-lg w-max select-none">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Luxury Concierge Services Online</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[#031635] tracking-tight">
            Welcome back, Alexander
          </h2>
          <p className="text-sm md:text-base text-[#44474e] max-w-xl leading-relaxed">
            It's an absolute pleasure to see you again. Your next luxury escape is masterfully coordinated and just around the corner under our Elite status suite.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <button 
              onClick={() => onNavigate('rooms')}
              className="px-6 py-3 bg-[#006b5e] hover:bg-[#005046] text-white font-semibold text-xs md:text-sm rounded-xl transition-all shadow-md active:scale-95 uppercase tracking-wider select-none h-12"
            >
              Book New Stay
            </button>
            <button 
              onClick={() => onNavigate('rooms')}
              className="px-6 py-3 border border-[#E2E8F0] hover:border-[#1a2b4b]/30 bg-white text-[#031635] font-semibold text-xs md:text-sm rounded-xl hover:bg-[#f5f3f6] transition-all h-12"
            >
              Explore Special Offers
            </button>
          </div>
        </div>

        {/* Loyalty Membership Rewards Board Card */}
        <div className="bg-[#1a2b4b] rounded-xl p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden text-left border border-white/5">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                Membership Status
              </span>
              <div className="w-10 h-10 bg-[#9ef2e1]/10 rounded-full flex items-center justify-center border border-white/10 text-[#9ef2e1]">
                <Award className="w-5 h-5 fill-current" />
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-white leading-none">Gold Elite</h3>
            <p className="text-xs text-white/60 tracking-wider font-mono mt-1.5">Member ID: SH-8829-1102</p>
          </div>

          <div className="mt-8 relative z-10">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-white/70 font-semibold uppercase tracking-wider">Points Balance</span>
              <span className="font-bold text-white tracking-wide">24,500 pts</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#9ef2e1] w-[78%] rounded-full shadow-inner animate-pulse"></div>
            </div>
            <p className="text-[10px] mt-2 text-white/50 italic tracking-wider">
              5,500 pts to Platinum Excellence status
            </p>
          </div>

          {/* Graphical overlay background decoration */}
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        </div>

      </section>

      {/* Next Upcoming stay layout (Screen 2) */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-[#031635] flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
          <CalendarCheck className="w-5 h-5" />
          <span>Next Upcoming Stay</span>
        </h3>

        {activeBookings.length > 0 ? (
          activeBookings.map((bk, idx) => (
            <div 
              key={bk.id || idx}
              className="relative h-96 rounded-2xl overflow-hidden group shadow-lg text-left"
            >
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA70qvYJvgPcT7To7de4m44AA0PXxHFDyqFsQ1kaHKo-S52fUlhuSSS5KDweudS00z9j788VK-U9p2FUcMyb69FO9OS0qiGDXX7yVKlMEWXbZNcFujqbpQU5h2ZvojW9Uub6CocLcf4r100Gt1XRMLBtMD2M-Edj190Zrzg3tgVklq5PIKErp9Vy1tNKWTOFjodoAOveF6BdgZLPo7xW9tdkZckoVArg3bq1VV2XH4CHDN3jMl7ndWSdBH3TbYKHXodBqBdz1vocoE" 
                alt="Paris suite metropolitan overlook" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 referral-no-referrer"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#031635] via-[#031635]/40 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-white text-left z-10">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1 bg-[#006b5e] text-white text-[10px] font-black rounded-lg tracking-wider select-none uppercase">
                      {bk.status}
                    </span>
                    <span className="text-xs text-white/80 font-mono">Reference ID: {bk.id}</span>
                  </div>
                  <h4 className="text-2xl md:text-4xl font-extrabold tracking-tight">{bk.room.name}</h4>
                  <p className="text-white/90 text-sm md:text-base flex items-center gap-1.5">
                    <Luggage className="w-4 h-4 text-[#9ef2e1]" />
                    <span>The Ritz-Carlton, Paris • {bk.checkIn} to {bk.checkOut} ({bk.days} Nights)</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => onSelectRecommended('grand-executive')}
                    className="px-5 py-2.5 bg-white text-[#031635] hover:bg-neutral-100 transition-colors rounded-xl text-xs font-semibold select-none shadow mr-2"
                  >
                    Manage Suite Details
                  </button>
                  {onCancelBooking && (
                    <button 
                      onClick={() => onCancelBooking(bk.id)}
                      className="px-4 py-2.5 bg-red-600/20 backdrop-blur-md border border-red-500/30 text-red-200 hover:bg-red-600 hover:text-white transition-all rounded-xl text-xs font-medium"
                    >
                      Cancel Stay
                    </button>
                  )}
                </div>
              </div>
              
            </div>
          ))
        ) : (
          <div className="p-10 bg-white border border-[#E2E8F0] rounded-xl text-center">
            <p className="text-base font-bold text-[#031635]">No upcoming stays scheduled currently.</p>
            <p className="text-xs text-[#75777f] mt-1">Coordinated escape paths will render automatically here once booked.</p>
            <button 
              onClick={() => onNavigate('rooms')}
              className="mt-4 px-6 py-2 bg-[#031635] text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-all uppercase tracking-wider"
            >
              Browse Rooms List
            </button>
          </div>
        )}
      </section>

      {/* Recommended For You list section (Screen 2) */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-[#E2E8F0] pb-3">
          <div>
            <h3 className="text-xl font-bold text-[#031635] tracking-tight">Recommended for You</h3>
            <p className="text-xs text-[#75777f] mt-1">Curated premium retreats based on your active Elite guest record</p>
          </div>
          <button 
            onClick={() => onNavigate('rooms')}
            className="text-[#031635] hover:text-[#006b5e] font-bold text-xs flex items-center gap-1 select-none transition-colors"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedList.map((rec) => (
            <div 
              key={rec.id}
              className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1.5 text-left flex flex-col justify-between"
            >
              <div className="p-0 relative h-56 overflow-hidden">
                <img 
                  src={rec.image} 
                  alt={rec.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 referral-no-referrer"
                  referrerPolicy="no-referrer"
                />
                <button className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-red-500 rounded-full transition-all">
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>

              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-1.5 text-left">
                    <h5 className="font-bold text-sm text-[#031635] tracking-tight leading-tight">{rec.name}</h5>
                    <div className="flex items-center text-amber-500 text-xs font-semibold shrink-0">
                      <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                      <span>{rec.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#75777f]">{rec.location} • {rec.nightsText}</p>
                </div>

                <div className="flex justify-between items-center mt-5 pt-4 border-t border-[#E2E8F0]/80">
                  <span className="text-lg font-black text-[#031635]">
                    ${rec.price}
                    <span className="text-[10px] text-[#75777f] font-normal">/night</span>
                  </span>
                  <button 
                    onClick={() => onSelectRecommended('grand-executive')}
                    className="px-4 py-2 border border-[#031635] text-[#031635] font-bold text-[10px] uppercase rounded-lg hover:bg-[#031635] hover:text-white transition-all select-none"
                  >
                    Details
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
