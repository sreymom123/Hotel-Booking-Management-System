import React, { useState } from 'react';
import { Booking, Room } from '../types';
import { 
  Lock, 
  User, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Fingerprint, 
  Layers, 
  Clock, 
  Plus, 
  CheckCircle, 
  X, 
  RotateCcw,
  Sparkles,
  UserCheck,
  Building,
  RefreshCw,
  Search,
  CheckCircle2
} from 'lucide-react';

interface AdminPortalProps {
  bookings: Booking[];
  rooms: Room[];
  isAdminLoggedIn: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
  onUpdateBookingStatus: (bookingId: string, status: 'CONFIRMED' | 'PENDING' | 'CANCELLED') => void;
  onToggleRoomAvailability: (roomId: string) => void;
}

export default function AdminPortal({
  bookings,
  rooms,
  isAdminLoggedIn,
  onLoginSuccess,
  onLogout,
  onUpdateBookingStatus,
  onToggleRoomAvailability
}: AdminPortalProps) {
  // Login input states
  const [adminIdInput, setAdminIdInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [loginError, setLoginError] = useState('');

  // Dashboard search & filters
  const [bookingFilterSearch, setBookingFilterSearch] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminIdInput.toLowerCase() === 'admin' && passwordInput.toLowerCase() === 'admin') {
      setLoginError('');
      onLoginSuccess();
    } else {
      setLoginError('Invalid Administrator credentials. Please enter admin/admin for bypass.');
    }
  };

  // Filter bookings list
  const filteredBookings = bookings.filter(b => 
    b.id.toLowerCase().includes(bookingFilterSearch.toLowerCase()) ||
    b.guestInfo.firstName.toLowerCase().includes(bookingFilterSearch.toLowerCase()) ||
    b.guestInfo.lastName.toLowerCase().includes(bookingFilterSearch.toLowerCase()) ||
    b.room.name.toLowerCase().includes(bookingFilterSearch.toLowerCase())
  );

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 relative bg-[#fbf8fc]">
        
        {/* Background watermark motif */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-5 select-none">
          <span className="font-extrabold text-[22vw] text-[#031635] tracking-tighter uppercase leading-none">
            NEXUS STAFF
          </span>
        </div>

        {/* Central high-security login panel login card */}
        <div className="w-full max-w-[450px] bg-white border border-[#c5c6cf] rounded-xl shadow-2xl relative overflow-hidden z-10">
          
          {/* Top animated bar indicator */}
          <div className="h-1.5 bg-gradient-to-r from-[#031635] via-[#4a9e8f] to-[#1a2b4b]" />

          <div className="p-8 sm:p-10 flex flex-col items-center text-center">
            
            {/* Security shield icon logo */}
            <div className="w-16 h-16 bg-[#031635] text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-white/10">
              <ShieldCheck className="w-8 h-8 text-[#9ef2e1] fill-[#9ef2e1]/10" />
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-black text-[#031635] tracking-tight">Nexus Hospitality</h1>
              <p className="text-xs font-bold text-[#44474e] uppercase tracking-widest mt-1">Admin Portal Access</p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-5 text-left">
              
              {/* Login Error notification state */}
              {loginError && (
                <p className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-lg border border-red-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{loginError}</span>
                </p>
              )}

              {/* Admin ID input field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#44474e] uppercase tracking-wider block flex justify-between">
                  <span>Admin ID</span>
                  <Fingerprint className="w-4 h-4 text-[#75777f]" />
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 w-4 h-4 text-[#75777f]" />
                  <input 
                    type="text" 
                    value={adminIdInput}
                    onChange={(e) => setAdminIdInput(e.target.value)}
                    required
                    placeholder="Enter Admin ID"
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-[#c5c6cf] focus:border-[#031635] focus:ring-1 focus:ring-[#031635] outline-none transition-all text-sm bg-[#fbf8fc]"
                  />
                </div>
                <p className="text-[10px] text-[#75777f] font-semibold block mt-0.5">*(Hint: enter "admin")</p>
              </div>

              {/* Password input field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-[#44474e] uppercase tracking-wider block">Password</label>
                  <button 
                    type="button" 
                    onClick={() => alert('Access credentials code default is: admin')}
                    className="text-xs text-[#006b5e] hover:underline font-semibold"
                  >
                    Forgot Admin Credentials?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-[#75777f]" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-12 rounded-lg border border-[#c5c6cf] focus:border-[#031635] focus:ring-1 focus:ring-[#031635] outline-none transition-all text-sm bg-[#fbf8fc]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-[#75777f] hover:text-[#1b1b1e]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-[#75777f] font-semibold block mt-0.5">*(Hint: enter "admin")</p>
              </div>

              {/* Remember device toggle */}
              <div className="flex items-center gap-2.5 py-1 select-none">
                <input 
                  type="checkbox"
                  id="remember"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="w-4 h-4 text-[#031635] focus:ring-[#031635] rounded border-[#c5c6cf]"
                />
                <label htmlFor="remember" className="text-xs text-[#44474e] font-semibold cursor-pointer">
                  Remember this administrator device for 30 days
                </label>
              </div>

              {/* Action secure CTA button */}
              <button 
                type="submit"
                className="w-full py-4 bg-[#031635] hover:bg-[#1a2b4b] text-white font-bold text-xs uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 select-none shadow transition-all active:scale-[0.98] h-12 mt-2"
              >
                <span>Secure Login</span>
                <UserCheck className="w-4 h-4" />
              </button>

            </form>

            {/* Badges footer display */}
            <div className="mt-8 pt-6 border-t border-[#c5c6cf] w-full flex justify-between items-center text-[10px] text-[#75777f] font-bold tracking-tight">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#006b5e]" />
                <span>AES-256 ENCRYPTED</span>
              </span>
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>SYSTEM v4.8.2</span>
              </span>
            </div>

          </div>
        </div>

      </div>
    );
  }

  // Admin Logged-In full workspace view
  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10 space-y-10 text-left text-[#1b1b1e]">
      
      {/* Header Panel with summary metrics */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#4A9E8F]/10 text-[#4a9e8f] text-xs font-bold rounded-lg border border-[#4a9e8f]/20 tracking-wider mb-2 select-none">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>Operational Active Synchronizer</span>
          </div>
          <h2 className="text-3xl font-black text-[#031635]">Administrative Portal Workspace</h2>
          <p className="text-sm text-[#75777f] mt-1">
            Realtime guest check-ins, metadata management, and rooms allocation console
          </p>
        </div>
        <button 
          onClick={onLogout}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow"
        >
          Sign Out Portal
        </button>
      </div>

      {/* Analytical Stats Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
          <p className="text-[10px] text-[#75777f] uppercase font-bold tracking-widest">Active Bookings</p>
          <p className="text-2xl font-black text-[#031635] mt-1">{bookings.length}</p>
          <div className="text-[10px] text-[#006b5e] font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>All systems synced</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
          <p className="text-[10px] text-[#75777f] uppercase font-bold tracking-widest">Allocated Rooms</p>
          <p className="text-2xl font-black text-[#031635] mt-1">
            {rooms.filter(r => !r.available).length} <span className="text-xs font-normal text-[#cf4820]">occupied</span>
          </p>
          <div className="text-[10px] text-[#75777f] font-semibold mt-1">
            {rooms.filter(r => r.available).length} remaining available keys
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
          <p className="text-[10px] text-[#75777f] uppercase font-bold tracking-widest">Active Loyalty Tiers</p>
          <p className="text-2xl font-black text-[#006b5e] mt-1">Gold Elite</p>
          <div className="text-[10px] text-[#75777f] font-semibold mt-1">
            Alexander Wright verified
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
          <p className="text-[10px] text-[#75777f] uppercase font-bold tracking-widest">Portal Status</p>
          <p className="text-2xl font-black text-[#006b5e] mt-1">AES-256</p>
          <div className="text-[10px] text-[#006b5e] font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Secure 256 SSL Live</span>
          </div>
        </div>
      </div>

      {/* Bookings Manifest Panel */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-md">
        <div className="p-6 bg-[#f5f3f6] border-b border-[#E2E8F0] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-lg font-bold text-[#031635]">Live Bookings Manifest</h3>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 w-4 h-4 text-[#75777f] top-1/2 transform -translate-y-1/2" />
            <input 
              type="text"
              value={bookingFilterSearch}
              onChange={(e) => setBookingFilterSearch(e.target.value)}
              placeholder="Search guest name or ID..."
              className="w-full bg-white border border-[#c5c6cf] rounded-xl pl-10 pr-4 py-2 text-xs text-[#1b1b1e] placeholder-[#75777f] focus:outline-none focus:ring-1 focus:ring-[#031635]"
            />
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="p-10 text-center text-[#75777f]">
            No live bookings matched your search query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-[#efedf0] border-b border-[#E2E8F0] text-[#44474e] font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Reference</th>
                  <th className="p-4">Primary Guest</th>
                  <th className="p-4">Suite / Room</th>
                  <th className="p-4">Itinerary Dates</th>
                  <th className="p-4 text-right font-mono">Invoice Amount</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Dispatch Status</th>
                  <th className="p-4 text-center">Interactive Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredBookings.map((bk) => (
                  <tr key={bk.id} className="hover:bg-[#f5f3f6]/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#031635]">{bk.id}</td>
                    <td className="p-4">
                      <div className="font-semibold">{bk.guestInfo.firstName} {bk.guestInfo.lastName}</div>
                      <div className="text-[10px] text-[#75777f] font-mono">{bk.guestInfo.email}</div>
                    </td>
                    <td className="p-4 font-semibold text-[#011]">
                      {bk.room.name}
                      <span className="text-[10px] font-normal text-[#75777f] block">{bk.room.location}</span>
                    </td>
                    <td className="p-4 text-[#44474e]">
                      <div>{bk.checkIn} to {bk.checkOut}</div>
                      <div className="text-[10px] font-bold text-[#006b5e] uppercase tracking-wide mt-0.5">
                        {bk.days} Nights
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-[#031635]">${bk.totalPrice}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                        bk.paymentMethod === 'ONLINE' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {bk.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                        bk.status === 'CONFIRMED' 
                          ? 'bg-[#4A9E8F]/10 text-[#4a9e8f]' 
                          : bk.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {bk.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {bk.status !== 'CONFIRMED' && (
                          <button 
                            onClick={() => onUpdateBookingStatus(bk.id, 'CONFIRMED')}
                            className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded text-[10px] font-semibold"
                            title="Promote Status to Confirmed"
                          >
                            Approve
                          </button>
                        )}
                        {bk.status !== 'CANCELLED' && (
                          <button 
                            onClick={() => onUpdateBookingStatus(bk.id, 'CANCELLED')}
                            className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-semibold"
                            title="Mark Booking Cancelled"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rooms metadata overrides panel (Screen 6 details view concept) */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-md">
        <div className="p-6 bg-[#f5f3f6] border-b border-[#E2E8F0]">
          <h3 className="text-lg font-bold text-[#031635]">Live Rooms Status Overrides</h3>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="bg-[#f5f3f6] border border-[#E2E8F0] rounded-xl p-4 flex flex-col justify-between h-40">
              <div className="text-left">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#75777f]">Active Tier Key</span>
                <h4 className="font-bold text-sm text-[#031635] truncate mt-0.5">{room.name}</h4>
                <p className="text-[10px] text-[#75777f]">{room.location}</p>
              </div>

              <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#c5c6cf]/50">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                  room.available ? 'bg-[#4A9E8F]/20 text-[#006b5e]' : 'bg-red-100 text-red-800'
                }`}>
                  {room.available ? 'AVAILABLE' : 'OCCUPIED'}
                </span>

                <button 
                  onClick={() => onToggleRoomAvailability(room.id)}
                  className="px-2.5 py-1.5 bg-[#031635] text-white hover:bg-[#1a2b4b] text-[10px] font-bold uppercase rounded transition-colors"
                >
                  Toggle Stay
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
