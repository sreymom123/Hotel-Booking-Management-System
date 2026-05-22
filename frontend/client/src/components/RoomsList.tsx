import React, { useState } from 'react';
import { Room } from '../types';
import { 
  Search, 
  MapPin, 
  Wifi, 
  Wind, 
  Tv, 
  Coffee, 
  GlassWater as MiniBar, 
  Monitor as Desk, 
  ChevronRight, 
  Star, 
  SlidersHorizontal, 
  CalendarDays, 
  Users, 
  Filter,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface RoomsListProps {
  rooms: Room[];
  onSelectRoom: (roomId: string) => void;
  onNavigate: (view: string) => void;
}

export default function RoomsList({ rooms, onSelectRoom, onNavigate }: RoomsListProps) {
  // Search state initialized similarly to Screen 1
  const [checkIn, setCheckIn] = useState('2026-10-12');
  const [checkOut, setCheckOut] = useState('2026-10-15');
  const [guestsCount, setGuestsCount] = useState('2 Adults, 1 Child');
  const [selectedType, setSelectedType] = useState('All');
  
  // Sorting state
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high'>('popular');

  // Search trigger state (reflects final filters)
  const [activeFilters, setActiveFilters] = useState({
    type: 'All',
    guests: 'All'
  });

  const handleUpdateSearch = () => {
    setActiveFilters({
      type: selectedType,
      guests: guestsCount
    });
  };

  // Icon mapping helper
  const renderAmenityIcon = (name: string) => {
    switch (name) {
      case 'Gigabit WiFi':
      case 'High-speed WiFi':
        return <Wifi className="w-4 h-4 text-[#006b5e]" />;
      case 'Climate Control':
        return <Wind className="w-4 h-4 text-[#006b5e]" />;
      case 'Mini Bar':
        return <MiniBar className="w-4 h-4 text-[#006b5e]" />;
      case 'Smart TV':
        return <Tv className="w-4 h-4 text-[#006b5e]" />;
      case 'Nespresso Machine':
      case 'Coffee Maker':
        return <Coffee className="w-4 h-4 text-[#006b5e]" />;
      case 'Work Desk':
        return <Desk className="w-4 h-4 text-[#006b5e]" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-[#006b5e]" />;
    }
  };

  // Filter application
  let filteredRooms = rooms.filter(room => {
    if (activeFilters.type !== 'All') {
      if (activeFilters.type === 'Suites' && !room.name.toLowerCase().includes('suite')) return false;
      if (activeFilters.type === 'Rooms' && room.name.toLowerCase().includes('suite')) return false;
    }
    return true;
  });

  // Sort application
  filteredRooms = [...filteredRooms].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return b.rating - a.rating; // Popular default
  });

  return (
    <section className="px-6 md:px-12 py-10 max-w-[1600px] mx-auto w-full">
      
      {/* Page Hero Welcome Block */}
      <div className="bg-[#031635] text-white rounded-2xl p-6 md:p-10 mb-10 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#031635] to-[#1a2b4b] opacity-95"></div>
        
        {/* Abstract background motif */}
        <div className="absolute right-0 top-0 w-80 h-80 opacity-10 pointer-events-none -mr-20 -mt-20">
          <svg fill="currentColor" viewBox="0 0 100 100" className="text-[#9ef2e1]">
            <circle cx="50" cy="50" r="40" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs text-[#9ef2e1] font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Premium Sanctuary Status Active</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
            Find your perfect sanctuary
          </h2>
          <p className="text-white/80 text-sm md:text-base font-medium mb-8 max-w-2xl leading-relaxed">
            Exclusive rates for Premium Guests are now active. Browse our curated collection of luxury rooms and suites across the globe.
          </p>

          {/* Integrated Search Console Card */}
          <div className="bg-[#fbf8fc] p-3 rounded-2xl flex flex-col lg:flex-row items-center gap-4 text-[#1b1b1e] shadow-xl">
            <div className="flex-grow w-full grid grid-cols-1 md:grid-cols-3 gap-3">
              
              {/* Check-in Calendar */}
              <div className="flex items-center gap-3 px-4 py-3 bg-[white] border border-[#E2E8F0] rounded-xl hover:border-[#1a2b4b]/30 transition-all group relative">
                <CalendarDays className="text-[#031635] w-5 h-5 flex-shrink-0" />
                <div className="flex flex-col flex-grow text-left">
                  <span className="text-[10px] font-bold text-[#44474e] uppercase tracking-wider">Dates of Stay</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <input 
                      type="date" 
                      value={checkIn} 
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="text-xs font-semibold focus:outline-none border-none p-0 bg-transparent text-[#1b1b1e] w-24"
                    />
                    <span className="text-xs text-[#75777f]">-</span>
                    <input 
                      type="date" 
                      value={checkOut} 
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="text-xs font-semibold focus:outline-none border-none p-0 bg-transparent text-[#1b1b1e] w-24"
                    />
                  </div>
                </div>
              </div>

              {/* Guests Count */}
              <div className="flex items-center gap-3 px-4 py-3 bg-[white] border border-[#E2E8F0] rounded-xl hover:border-[#1a2b4b]/30 transition-all group relative">
                <Users className="text-[#031635] w-5 h-5 flex-shrink-0" />
                <div className="flex flex-col flex-grow text-left">
                  <span className="text-[10px] font-bold text-[#44474e] uppercase tracking-wider">Total Guests</span>
                  <select 
                    value={guestsCount} 
                    onChange={(e) => setGuestsCount(e.target.value)}
                    className="text-xs font-semibold focus:outline-none border-none p-0 bg-transparent text-[#1b1b1e] mt-0.5"
                  >
                    <option value="1 Adult">1 Adult</option>
                    <option value="2 Adults">2 Adults</option>
                    <option value="2 Adults, 1 Child">2 Adults, 1 Child</option>
                    <option value="3 Adults">3 Adults</option>
                    <option value="4 Adults">4 Adults</option>
                  </select>
                </div>
              </div>

              {/* Room Type */}
              <div className="flex items-center gap-3 px-4 py-3 bg-[white] border border-[#E2E8F0] rounded-xl hover:border-[#1a2b4b]/30 transition-all group relative">
                <Filter className="text-[#031635] w-5 h-5 flex-shrink-0" />
                <div className="flex flex-col flex-grow text-left">
                  <span className="text-[10px] font-bold text-[#44474e] uppercase tracking-wider">Room Category</span>
                  <select 
                    value={selectedType} 
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="text-xs font-semibold focus:outline-none border-none p-0 bg-transparent text-[#1b1b1e] mt-0.5"
                  >
                    <option value="All">All Tiers (Deluxe & Suites)</option>
                    <option value="Suites">Suites Only</option>
                    <option value="Rooms">Rooms Only</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Launch Query Button */}
            <button 
              onClick={handleUpdateSearch}
              className="w-full lg:w-auto px-10 py-4 bg-[#006b5e] hover:bg-[#005046] text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap select-none"
            >
              Update Search
            </button>
          </div>
        </div>
      </div>

      {/* Grid Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-[#031635] tracking-tight">Available Rooms</h3>
          <p className="text-sm text-[#44474e] mt-1">
            Showing {filteredRooms.length} outstanding results for your parameters
          </p>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="text-xs font-bold text-[#44474e] uppercase tracking-wider">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#1b1b1e] focus:outline-none focus:ring-1 focus:ring-[#031635]"
          >
            <option value="popular">Popularity (High Rated)</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Content Layout Grid */}
      {filteredRooms.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E2E8F0] p-10">
          <p className="text-lg font-bold text-[#031635]">No rooms fit your exact query.</p>
          <p className="text-sm text-[#44474e] mt-1">Try broadening your Room Category filter.</p>
          <button 
            onClick={() => { setActiveFilters({ type: 'All', guests: 'All' }); setSelectedType('All'); }}
            className="mt-4 px-6 py-2 bg-[#031635] text-white text-xs font-bold rounded-lg hover:opacity-90"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {filteredRooms.map((room) => {
            const isFeatured = room.tag === 'Featured Premium';

            if (isFeatured) {
              return (
                <div 
                  key={room.id}
                  className="group bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300 md:col-span-2 lg:col-span-2 shadow-sm"
                >
                  <div className="relative h-64 md:h-96 overflow-hidden">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 referral-no-referrer"
                      src={room.image}
                      alt={room.name}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-6 left-6 bg-[#031635] text-white px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 z-10 shadow-lg select-none border border-white/10">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                      <span>{room.tag}</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end text-white">
                      <div>
                        <h4 className="text-2xl md:text-3xl font-black tracking-tight">{room.name}</h4>
                        <div className="flex items-center gap-2 opacity-90 text-xs md:text-sm mt-1">
                          <MapPin className="w-4 h-4 text-[#9ef2e1]" />
                          <span>{room.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                    <div className="flex-1 text-left">
                      <div className="flex flex-wrap gap-2.5 mb-5">
                        {room.amenities.slice(0, 3).map((amenity, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-center gap-1.5 bg-[#f5f3f6] px-3.5 py-1.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold text-[#44474e]"
                          >
                            {renderAmenityIcon(amenity)}
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm md:text-base text-[#44474e] leading-relaxed">
                        The Grand Executive Suite represents the pinnacle of luxury living, featuring a private balcony, separate living area, and a masterfully designed marble ensuite bathroom with a rainfall shower and panoramic skyline views.
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-center min-w-[200px] md:border-l border-[#E2E8F0] md:pl-8">
                      <div className="text-right">
                        {room.originalPrice && (
                          <span className="block text-xs font-bold text-[#75777f] line-through mb-1">
                            ${room.originalPrice}
                          </span>
                        )}
                        <span className="text-2xl md:text-3xl font-black text-[#031635]">
                          ${room.price}
                          <span className="text-xs text-[#44474e] font-normal tracking-wide">/night</span>
                        </span>
                      </div>
                      <button 
                        onClick={() => onSelectRoom(room.id)}
                        className="mt-6 w-full py-3 bg-[#031635] text-white font-bold text-xs md:text-sm rounded-xl hover:bg-[#1a2b4b] transition-all active:scale-[0.98] shadow-md hover:shadow-lg select-none uppercase tracking-widest"
                      >
                        Explore Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // Standard layout cards
            return (
              <div 
                key={room.id}
                className="group bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300 shadow-sm"
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 referral-no-referrer"
                    src={room.image}
                    alt={room.name}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#031635] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm select-none border border-[#E2E8F0]">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                    <span>{room.rating}</span>
                  </div>
                  <div className="absolute bottom-3 left-4 select-none">
                    <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider backdrop-blur-md shadow-sm ${
                      room.statusText === 'Last 2 Left' 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-[#4A9E8F] text-white'
                    }`}>
                      {room.statusText || 'Available'}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="text-left">
                    <h4 className="text-lg font-bold text-[#031635] truncate">{room.name}</h4>
                    <p className="text-xs text-[#75777f] mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">{room.location}</span>
                    </p>
                    <div className="flex gap-2.5 my-4">
                      {room.amenities.slice(0, 3).map((amenity, idx) => (
                        <div key={idx} title={amenity} className="p-2 bg-[#f5f3f6] rounded-lg border border-[#E2E8F0]">
                          {renderAmenityIcon(amenity)}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between mt-auto">
                    <div className="text-left">
                      <span className="text-xl font-black text-[#031635]">${room.price}</span>
                      <span className="block text-[10px] text-[#75777f] uppercase font-bold tracking-tight">Excl. Taxes</span>
                    </div>
                    <button 
                      onClick={() => onSelectRoom(room.id)}
                      className="px-5 py-2.5 bg-[#006b5e] hover:bg-[#005046] text-white font-semibold text-xs rounded-xl transition-all active:scale-95 shadow-md uppercase tracking-wider"
                    >
                      Detail
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      )}

    </section>
  );
}
