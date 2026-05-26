import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Room, Booking } from './types';
import { INITIAL_ROOMS, INITIAL_BOOKINGS } from './roomsData';
import Header from './components/Header';
import RoomsList from './components/RoomsList';
import RoomDetail from './components/RoomDetail';
import Checkout from './components/Checkout';
import BookingSuccess from './components/BookingSuccess';
import GuestDashboard from './components/GuestDashboard';
import SupportPortal from './components/SupportPortal';
import AdminPortal from './components/AdminPortal';
import { 
  Building2, 
  Copyright, 
  MapPin, 
  Compass, 
  Globe, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Flame, 
  ShieldCheck, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const fallbackImage = INITIAL_ROOMS[0]?.image || '';

type ApiRoom = {
  id: string;
  type: string;
  price: number;
  status: string;
};

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'API request failed');
  }

  return result.data as T;
}

function mapApiRoom(room: ApiRoom): Room {
  return {
    id: room.id,
    name: `${room.type} Room ${room.id}`,
    price: Number(room.price),
    image: fallbackImage,
    location: 'Grand Horizon Hotel',
    capacity: room.type === 'Suite' || room.type === 'Executive' ? '4 Guests' : '2 Guests',
    bedType: room.type === 'Standard' ? 'Double Bed' : 'King Size',
    size: room.type === 'Standard' ? '400 sq ft' : '650 sq ft',
    rating: 4.7,
    amenities: ['High-speed WiFi', 'Climate Control', 'Smart TV', 'Private Bathroom'],
    available: room.status === 'Available',
    tag: room.type === 'Executive' ? 'Featured Premium' : undefined,
    statusText: room.status,
  };
}

export default function App() {
  // Navigation / View state
  const [currentView, setCurrentView] = useState<string>('home'); // 'home' (Guest Portals), 'rooms', 'detail', 'checkout', 'success', 'support', 'admin'
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Live rooms and bookings database in React state
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // Active selected entities
  const [selectedRoomId, setSelectedRoomId] = useState<string>('grand-executive');
  const [lastBookingResult, setLastBookingResult] = useState<Booking | null>(INITIAL_BOOKINGS[0]);

  // Transferred variables between detail & checkout
  const [bookingDates, setBookingDates] = useState({
    checkIn: '2026-10-24',
    checkOut: '2026-10-28',
    occupancy: '2 Adults'
  });

  // Admin login credentials status
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    void loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const apiRooms = await apiRequest<ApiRoom[]>('/rooms');
      setRooms(apiRooms.map(mapApiRoom));
    } catch (error) {
      console.error(error);
    }
  };

  // Quick navigation helpers
  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleSelectRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setCurrentView('detail');
    window.scrollTo(0, 0);
  };

  const handleBookNow = (checkIn: string, checkOut: string, occupancy: string) => {
    setBookingDates({ checkIn, checkOut, occupancy });
    setCurrentView('checkout');
    window.scrollTo(0, 0);
  };

  const handleSubmitBooking = async (newBooking: Booking) => {
    try {
      const createdBooking = await apiRequest<{ id: string; status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'; totalPrice: number }>('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          roomId: newBooking.room.id,
          guestName: `${newBooking.guestInfo.firstName} ${newBooking.guestInfo.lastName}`,
          checkInDate: newBooking.checkIn,
          checkOutDate: newBooking.checkOut,
          guestCount: Number.parseInt(newBooking.guests, 10) || 1,
          specialRequest: newBooking.specialRequests,
        }),
      });

      const savedBooking = {
        ...newBooking,
        id: createdBooking.id,
        status: createdBooking.status,
        totalPrice: createdBooking.totalPrice,
      };

      setBookings(prev => [savedBooking, ...prev]);
      setLastBookingResult(savedBooking);
      setRooms(prevRooms => prevRooms.map(r =>
        r.id === savedBooking.room.id ? { ...r, available: false, statusText: 'Occupied' } : r
      ));
      setCurrentView('success');
      window.scrollTo(0, 0);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unable to create booking');
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you absolutely sure you wish to cancel this booking reservation?')) {
      // Release room status back to available
      const targetedBooking = bookings.find(b => b.id === bookingId);
      if (targetedBooking) {
        setRooms(prevRooms => prevRooms.map(r => 
          r.id === targetedBooking.room.id ? { ...r, available: true } : r
        ));
      }

      setBookings(prev => prev.map(bk => 
        bk.id === bookingId ? { ...bk, status: 'CANCELLED' } : bk
      ));
    }
  };

  // Admin status manipulation triggers
  const handleUpdateBookingStatus = (bookingId: string, status: 'CONFIRMED' | 'PENDING' | 'CANCELLED') => {
    setBookings(prev => prev.map(bk => 
      bk.id === bookingId ? { ...bk, status } : bk
    ));
  };

  const handleToggleRoomAvailability = (roomId: string) => {
    setRooms(prev => prev.map(r => 
      r.id === roomId ? { ...r, available: !r.available } : r
    ));
  };

  // Find active room metadata safely
  const currentSelectedRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];

  return (
    <div className="min-h-screen bg-[#fbf8fc] flex flex-col font-sans selection:bg-[#9ef2e1] selection:text-[#00201b]">
      
      {/* Absolute Header layout */}
      <Header 
        currentView={currentView}
        onNavigate={handleNavigate}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onToggleAdmin={() => handleNavigate('admin')}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Content Router with fluid Motion layout transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {currentView === 'home' && (
              <GuestDashboard 
                bookings={bookings}
                onSelectRecommended={handleSelectRoom}
                onNavigate={handleNavigate}
                onCancelBooking={handleCancelBooking}
              />
            )}

            {currentView === 'rooms' && (
              <RoomsList 
                rooms={rooms.filter(r => 
                  r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  r.location.toLowerCase().includes(searchTerm.toLowerCase())
                )}
                onSelectRoom={handleSelectRoom}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'detail' && (
              <RoomDetail 
                room={currentSelectedRoom}
                onBack={() => handleNavigate('rooms')}
                onBook={handleBookNow}
              />
            )}

            {currentView === 'checkout' && (
              <Checkout 
                room={currentSelectedRoom}
                checkIn={bookingDates.checkIn}
                checkOut={bookingDates.checkOut}
                occupancy={bookingDates.occupancy}
                onSubmitBooking={handleSubmitBooking}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'success' && lastBookingResult && (
              <BookingSuccess 
                booking={lastBookingResult}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'support' && (
              <SupportPortal />
            )}

            {currentView === 'admin' && (
              <AdminPortal 
                bookings={bookings}
                rooms={rooms}
                isAdminLoggedIn={isAdminLoggedIn}
                onLoginSuccess={() => setIsAdminLoggedIn(true)}
                onLogout={() => setIsAdminLoggedIn(false)}
                onUpdateBookingStatus={handleUpdateBookingStatus}
                onToggleRoomAvailability={handleToggleRoomAvailability}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistent global luxury-tier Footer */}
      <footer className="bg-[#031635] text-white border-t border-white/10 pt-16 pb-12 mt-16 text-left selection:bg-white/10 selection:text-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand block */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-[#9ef2e1] border border-white/5">
                <Building2 className="w-4.5 h-4.5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">Nexus Hospitality</span>
            </div>
            <p className="text-xs text-white/60 leading-relaxed max-w-xs">
              Meticulously integrating state-of-the-art workspace suites and premium private residences with timeless Swiss-Modern architecture.
            </p>
          </div>

          {/* Quick links block */}
          <div className="space-y-4">
            <h5 className="font-bold text-xs uppercase tracking-wider text-[#9ef2e1]">Guest Services</h5>
            <ul className="space-y-2 text-xs text-white/70">
              <li><button onClick={() => handleNavigate('rooms')} className="hover:text-white transition-colors">Curated Room Collection</button></li>
              <li><button onClick={() => handleNavigate('home')} className="hover:text-white transition-colors">Exclusive Gold Elite Rewards</button></li>
              <li><button onClick={() => handleNavigate('support')} className="hover:text-white transition-colors">24/7 Digital Concierge Office</button></li>
              <li><a href="#" className="hover:text-white transition-colors">Virtual Reality Walkthrough</a></li>
            </ul>
          </div>

          {/* Legal / safety parameters */}
          <div className="space-y-4">
            <h5 className="font-bold text-xs uppercase tracking-wider text-[#9ef2e1]">Legal &amp; Privacy</h5>
            <ul className="space-y-2 text-xs text-white/70 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Terms of Accommodation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">General Privacy Guidelines</a></li>
              <li><a href="#" className="hover:text-white transition-colors">TLS 256 SSL Lock Cryptography</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Corporate Headquarters Coordinate</a></li>
            </ul>
          </div>

          {/* Corporate details */}
          <div className="space-y-4 text-xs">
            <h5 className="font-bold uppercase tracking-wider text-[#9ef2e1]">Operational Status</h5>
            <div className="space-y-2 text-white/75 leading-relaxed font-semibold">
              <p className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#9ef2e1]" />
                <span>Global Nodes: USA, France, Japan, Italy</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Loyalty tier synchronization: Active</span>
              </p>
            </div>
            
            {/* Social channels icons */}
            <div className="flex gap-4.5 pt-2">
              <a href="https://twitter.com" className="text-white/60 hover:text-[#9ef2e1] transition-colors" target="_blank" rel="noopener noreferrer">
                <Twitter className="w-4.5 h-4.5" />
              </a>
              <a href="https://linkedin.com" className="text-white/60 hover:text-[#9ef2e1] transition-colors" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-4.5 h-4.5" />
              </a>
              <a href="https://instagram.com" className="text-white/60 hover:text-[#9ef2e1] transition-colors" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Global legal disclaimer block */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-12 mt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[10px] text-white/40 font-semibold gap-4">
          <div className="flex items-center gap-1.5">
            <Copyright className="w-3.5 h-3.5" />
            <span>2026 Nexus Hospitality Group. All Sovereign Rights Reserved.</span>
          </div>
          <div className="flex gap-5">
            <a href="#" className="hover:underline">Global Registry No. NH-990-2A</a>
            <a href="#" className="hover:underline">Bylaws</a>
            <a href="#" className="hover:underline">Security Audit Statement</a>
          </div>
        </div>

      </footer>

      {/* Floating Immediate Concierge Support Button for high luxury-tier accessibility */}
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          onClick={() => handleNavigate('support')}
          className="flex items-center gap-2 bg-[#006b5e] hover:bg-[#005046] text-white px-5 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 select-none font-bold text-xs uppercase tracking-widest border border-white/10 group h-12"
          title="Instant Help Ticket Dispatch"
        >
          <MessageSquare className="w-4.5 h-4.5 text-[#9ef2e1] animate-bounce" />
          <span>Concierge</span>
        </button>
      </div>

    </div>
  );
}
