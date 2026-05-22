import React from 'react';
import { Booking } from '../types';
import { 
  CheckCircle, 
  MapPin, 
  Download, 
  Printer, 
  QrCode, 
  Home, 
  ShieldCheck, 
  Car, 
  Utensils, 
  Sparkles, 
  Mail, 
  Calendar,
  Share2,
  AlertTriangle,
  BookOpen,
  Apple
} from 'lucide-react';

interface BookingSuccessProps {
  booking: Booking;
  onNavigate: (view: string) => void;
  onPrint?: () => void;
}

export default function BookingSuccess({ booking, onNavigate, onPrint }: BookingSuccessProps) {
  const { room, checkIn, checkOut, days, guests, totalPrice, paymentMethod, id } = booking;

  // Invoice calculations
  const baseNightsTotal = room.price * days;
  const tax = Math.round(baseNightsTotal * 0.12);
  const serviceCharge = 120; // fixed representation

  const handlePrintMock = () => {
    if (onPrint) onPrint();
    else window.print();
  };

  const handleDownloadInvoice = () => {
    alert(`Downloading Invoice for Reference: ${id}.pdf ... Success!`);
  };

  const handleAppleWallet = () => {
    alert(`Pass added to Apple Wallet: Referral ${id}. Thank you!`);
  };

  const isOnline = paymentMethod === 'ONLINE';

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-10 space-y-12 text-[#1b1b1e] text-left">
      
      {/* Dynamic Header based on payment type (Screen 5 & 7) */}
      <div className="w-full text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#4A9E8F]/10 rounded-full">
          <CheckCircle className="w-12 h-12 text-[#4A9E8F] fill-[#4A9E8F]/10" />
        </div>
        
        <h1 className="text-3xl md:text-5xl font-black text-[#031635] tracking-tight">
          {isOnline ? 'Booking Successful!' : 'Booking Reserved - Pay at Hotel'}
        </h1>
        
        <p className="text-sm md:text-base text-[#44474e] max-w-xl mx-auto leading-relaxed">
          {isOnline 
            ? `Thank you, ${booking.guestInfo.firstName}. Your stay at Nexus Hospitality is fully confirmed. We have processed your transaction and sent details to ${booking.guestInfo.email}.`
            : `Your reservation is fully secured, ${booking.guestInfo.firstName}. Please present this digital receipt/voucher at the front desk upon arrival for seamless registration.`
          }
        </p>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Stay card details and actions (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-6 md:items-center">
              
              <div className="w-full md:w-1/3 aspect-[4/3] rounded-lg overflow-hidden bg-[#f5f3f6] shrink-0 border border-[#E2E8F0]">
                {/* Specific hotlink from Screen 5 details */}
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcefGC5hEM1f7DFa_wo9fxoO0LuOTVDj55gX4rM4oeOudlY9RQIM_CZnM4zODzQOd22qXn6h4sbgLuC67vmYNLGfefO2egENZ8C6ayImVSymC1Z1r6jv4JiHTh-a2M4lYIwmSig2Ld59rZ1oRfUdWV0rFhabpDWseHqCosLbxQrXDtDIkLtar-yRKl175TiC-HV-E7p3p8qKlJPRNifN02Fv9AoQZ-GL2euvJtwQzjNp6OMzYUzAY1itoAOUP-G6X25BRHxAQmBRQ" 
                  alt="Corporate Suite Metropolitan room" 
                  className="w-full h-full object-cover referral-no-referrer"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-grow text-left space-y-4">
                <div className="flex justify-between items-start gap-2.5">
                  <h3 className="text-xl md:text-2xl font-bold text-[#031635] tracking-tight">{room.name}</h3>
                  <span className="px-3 py-1 bg-[#4A9E8F]/10 text-[#4a9e8f] text-[10px] font-black uppercase rounded-full tracking-wider select-none shrink-0 border border-[#4a9e8f]/20">
                    {booking.status}
                  </span>
                </div>

                <p className="text-xs text-[#75777f] flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-[#006b5e]" />
                  <span>{room.location} • Nexus Grand</span>
                </p>

                <div className="grid grid-cols-2 gap-y-4 gap-x-2.5 border-t border-[#E2E8F0] pt-4 text-sm">
                  <div>
                    <span className="text-[10px] text-[#75777f] uppercase font-bold tracking-wider block">Check-in</span>
                    <span className="font-bold text-[#1b1b1e]">{checkIn}</span>
                    <span className="text-xs text-[#75777f] block mt-0.5">After 3:00 PM</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#75777f] uppercase font-bold tracking-wider block">Check-out</span>
                    <span className="font-bold text-[#1b1b1e]">{checkOut}</span>
                    <span className="text-xs text-[#75777f] block mt-0.5">By 11:00 AM</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#75777f] uppercase font-bold tracking-wider block">Guests & Rooms</span>
                    <span className="font-bold text-[#1b1b1e] block mt-0.5">{guests} • 1 Room</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#75777f] uppercase font-bold tracking-wider block">Reference Code</span>
                    <span className="font-mono text-xs font-black text-[#031635] uppercase tracking-wide block mt-1">
                      {id}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Action buttons (Screen 5/7) */}
          <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
            <button 
              onClick={() => onNavigate('bookings')}
              className="flex-grow bg-[#031635] hover:bg-[#1a2b4b] text-white font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-xl transition-all shadow active:scale-95 flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>View My Bookings</span>
            </button>
            <button 
              onClick={handleDownloadInvoice}
              className="flex-grow border border-[#c5c6cf] hover:border-[#031635] text-[#1b1b1e] font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-xl hover:bg-[#f5f3f6] transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download Invoice</span>
            </button>
            <button 
              onClick={() => onNavigate('home')}
              className="flex-grow border border-[#c5c6cf] hover:border-[#031635] text-[#1b1b1e] font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-xl hover:bg-[#f5f3f6] transition-all flex items-center justify-center gap-1.5"
            >
              <Home className="w-4 h-4" />
              <span>Return to Home</span>
            </button>
          </div>

          {/* Pay at Property barcode and Apple Wallet indicators (Screen 7 QR Section) */}
          {!isOnline && (
            <div className="bg-[#f5f3f6] px-6 py-6 rounded-xl border border-[#E2E8F0] flex flex-col sm:flex-row items-center gap-6 text-left">
              <div className="bg-white p-2 border border-[#c5c6cf] rounded-xl flex-shrink-0">
                <QrCode className="w-16 h-16 text-[#031635]" />
              </div>
              <div className="flex-grow space-y-1">
                <p className="text-xs font-bold text-[#1b1b1e] uppercase tracking-wider">Verification Required</p>
                <p className="text-xs text-[#75777f] leading-relaxed">
                  Present this dynamic QR code to the front-desk officer upon arrival. They will scan it securely to instantly authorize room keys and retrieve custom preferences.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5 shrink-0 self-end sm:self-center">
                <button 
                  onClick={handleAppleWallet}
                  className="flex items-center gap-1.5 bg-black text-white px-4 py-2.5 rounded-lg text-xs font-semibold hover:opacity-90 select-none animate-bounce"
                >
                  <Apple className="w-4 h-4 fill-current" />
                  <span>Add to Wallet</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Price summary details (4 cols) */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          <div className="bg-[#e9e7eb] border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
            <h3 className="text-xs font-black tracking-widest text-[#031635] uppercase mb-4 block border-b border-[#c5c6cf] pb-2">
              PRICE SUMMARY
            </h3>
            
            <div className="space-y-3.5 text-xs text-[#44474e]">
              <div className="flex justify-between">
                <span>${room.price} x {days} nights</span>
                <span className="font-semibold text-[#1b1b1e]">${baseNightsTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Premium Service Charge (10%)</span>
                <span className="font-semibold text-[#1b1b1e]">${serviceCharge}</span>
              </div>
              <div className="flex justify-between border-b border-[#c5c6cf] pb-3">
                <span>VAT (5%)</span>
                <span className="font-semibold text-[#1b1b1e]">${tax}</span>
              </div>
              
              <div className="pt-2 flex justify-between items-center text-sm md:text-base font-black">
                <span className="text-[#031635] uppercase tracking-wide">
                  {isOnline ? 'Total Paid' : 'Total Due'}
                </span>
                <span className="text-[#031635] text-lg md:text-xl">
                  ${totalPrice}
                </span>
              </div>
            </div>

            <div className="mt-6 p-3 bg-white/60 border border-[#E2E8F0] rounded-lg flex items-center gap-2.5 text-[#0e7163]">
              <ShieldCheck className="w-4 h-4" />
              <p className="text-[10px] uppercase font-bold tracking-wider text-left">
                Secured via Nexus Finance
              </p>
            </div>
          </div>

          {/* Need help? contact concierge */}
          <div className="bg-[#1a2b4b] text-white rounded-xl p-6 relative overflow-hidden text-left shadow border border-white/5">
            <h4 className="text-lg font-bold mb-2">Need assistance?</h4>
            <p className="text-xs text-white/70 mb-5 leading-relaxed">
              Our dynamic digital concierge office is active 24/7 to resolve transfer, spa bookings, or suite room adjustments.
            </p>
            <a 
              href="mailto:support@nexushospitality.com"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#9ef2e1] text-[#00201b] font-bold text-xs rounded-xl hover:opacity-95 select-none"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Concierge</span>
            </a>
          </div>

        </div>

      </div>

      {/* Helpful suggestions area (Screen 5 bottom segment) */}
      <section className="border-t border-[#E2E8F0]/80 pt-10 space-y-6">
        <h4 className="text-lg font-bold text-[#031635]">Elite Experience Additions</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-4 items-start text-left">
            <div className="p-3 bg-[#f5f3f6] rounded-xl text-[#031635] shrink-0 border border-[#E2E8F0]">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-[#031635] mb-1">Airport Transfer</h5>
              <p className="text-xs text-[#75777f] leading-relaxed">
                Book a premium chauffeured luxury sedan or electric SUV directly from your profile interface.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start text-left">
            <div className="p-3 bg-[#f5f3f6] rounded-xl text-[#031635] shrink-0 border border-[#E2E8F0]">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-[#031635] mb-1">Dining Reservations</h5>
              <p className="text-xs text-[#75777f] leading-relaxed">
                Secure executive dining slots at the legendary Nexus Peak rooftop Michelin-starred restaurant.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start text-left">
            <div className="p-3 bg-[#f5f3f6] rounded-xl text-[#031635] shrink-0 border border-[#E2E8F0]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-[#031635] mb-1">Spa &amp; Wellness</h5>
              <p className="text-xs text-[#75777f] leading-relaxed">
                Elite Suite visitors receive complimentary 2-hour daily passes to the private salt-cave and thermal pools.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
