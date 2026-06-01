import React, { useState } from 'react';
import { Room, Booking } from '../types';
import { 
  Building2, 
  ChevronRight, 
  User, 
  Phone, 
  Mail, 
  CreditCard, 
  Users, 
  Info,
  Lock,
  Loader2,
  CheckCircle,
  Utensils,
  ReceiptText
} from 'lucide-react';

interface CheckoutProps {
  room: Room;
  checkIn: string;
  checkOut: string;
  occupancy: string;
  onSubmitBooking: (booking: Booking) => void;
  onNavigate: (view: string) => void;
}

type PaymentMethod = 'ONLINE' | 'PROPERTY' | 'BAKONG';

const roomServiceItems = [
  { id: 'breakfast', name: 'Khmer Breakfast Set', description: 'Rice porridge, fruit, coffee, and fresh juice.', price: 18 },
  { id: 'dinner', name: 'In-room Dinner', description: 'Two-course chef menu delivered between 6:00 PM and 9:00 PM.', price: 42 },
  { id: 'minibar', name: 'Mini-bar Refill', description: 'Water, soft drinks, snacks, and local tea selection.', price: 24 },
  { id: 'laundry', name: 'Express Laundry', description: 'Same-day garment care for arrival day.', price: 16 },
];

export default function Checkout({ 
  room, 
  checkIn, 
  checkOut, 
  occupancy, 
  onSubmitBooking,
  onNavigate
}: CheckoutProps) {
  // Input states
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('+1 (555) 000-0000');
  
  // Payment tab switch
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BAKONG');
  const [selectedServices, setSelectedServices] = useState<string[]>(['breakfast']);
  const [bakongConfirmed, setBakongConfirmed] = useState(false);
  
  // Credit card details
  const [cardNumber, setCardNumber] = useState('4421 8911 0022 4587');
  const [expiry, setExpiry] = useState('12 / 29');
  const [cvv, setCvv] = useState('321');
  
  // Special requests
  const [specialRequests, setSpecialRequests] = useState('A high-floor quiet room is preferred, thank you.');

  // Loading spinner & animation during submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Nights count calculation
  const calculateNights = (startStr: string, endStr: string) => {
    try {
      const start = new Date(startStr);
      const end = new Date(endStr);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return isNaN(diffDays) ? 3 : diffDays;
    } catch {
      return 3;
    }
  };

  const nights = calculateNights(checkIn, checkOut);
  const baseRate = room.price;
  const totalBase = baseRate * nights;
  const taxes = Math.round(totalBase * 0.12);
  const resortFees = 75;
  const roomServiceTotal = roomServiceItems
    .filter((item) => selectedServices.includes(item.id))
    .reduce((sum, item) => sum + item.price, 0);
  const finalTotalAmount = totalBase + taxes + resortFees + roomServiceTotal;
  const bakongReference = `BKG-${room.id}-${String(finalTotalAmount).padStart(4, '0')}`;
  const bakongAmountKhr = finalTotalAmount * 4100;
  const bakongPayload = [
    'BAKONG-KHQR',
    'merchant=Nexus Hospitality Room & Service',
    `amount_usd=${finalTotalAmount}`,
    `amount_khr=${bakongAmountKhr}`,
    `reference=${bakongReference}`,
  ].join('|');
  const bakongQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=12&data=${encodeURIComponent(bakongPayload)}`;

  const toggleRoomService = (serviceId: string) => {
    setSelectedServices((current) =>
      current.includes(serviceId)
        ? current.filter((id) => id !== serviceId)
        : [...current, serviceId],
    );
  };

  const selectPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
    if (method !== 'BAKONG') {
      setBakongConfirmed(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone) {
      alert('Please fill out all primary guest details.');
      return;
    }

    if (paymentMethod === 'BAKONG' && !bakongConfirmed) {
      alert('Please confirm the Bakong transfer after scanning the KHQR code.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate payment transaction with high craftsmanship
    setTimeout(() => {
      const newBooking: Booking = {
        id: `NH-${Math.floor(10000 + Math.random() * 90000)}-X`,
        room,
        checkIn,
        checkOut,
        days: nights,
        guests: occupancy,
        totalPrice: finalTotalAmount,
        status: paymentMethod === 'PROPERTY' ? 'PENDING' : 'CONFIRMED',
        paymentMethod,
        roomServiceTotal,
        roomServiceItems: roomServiceItems
          .filter((item) => selectedServices.includes(item.id))
          .map((item) => item.name),
        guestInfo: {
          firstName,
          lastName,
          email,
          phone
        },
        specialRequests
      };
      setIsSubmitting(false);
      onSubmitBooking(newBooking);
    }, 2800);
  };

  return (
    <section className="max-w-[1200px] mx-auto px-6 py-8 text-left text-[#1b1b1e]">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-8 text-sm text-[#44474e] font-medium">
        <button onClick={() => onNavigate('rooms')} className="hover:text-[#031635]">Discover Rooms</button>
        <ChevronRight className="w-4 h-4 text-[#75777f]" />
        <span className="text-[#03165b] font-semibold">{room.name}</span>
        <ChevronRight className="w-4 h-4 text-[#75777f]" />
        <span className="text-[#031635] font-black">Checkout</span>
      </nav>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Guest info and billing widgets */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Guest Details Container */}
          <section className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#1a2b4b]/10 flex items-center justify-center text-[#031635]">
                <User className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-[#031635]">Guest Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#44474e] uppercase tracking-wider block">First Name</label>
                <input 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. John" 
                  required
                  className="w-full h-11 px-4 rounded-lg border border-[#c5c6cf] focus:border-[#031635] focus:ring-1 focus:ring-[#031635] outline-none transition-all text-sm bg-[#fbf8fc]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#44474e] uppercase tracking-wider block">Last Name</label>
                <input 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Doe" 
                  required
                  className="w-full h-11 px-4 rounded-lg border border-[#c5c6cf] focus:border-[#031635] focus:ring-1 focus:ring-[#031635] outline-none transition-all text-sm bg-[#fbf8fc]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#44474e] uppercase tracking-wider block">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 w-4 h-4 text-[#75777f]" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe@example.com" 
                    required
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-[#c5c6cf] focus:border-[#031635] focus:ring-1 focus:ring-[#031635] outline-none transition-all text-sm bg-[#fbf8fc]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#44474e] uppercase tracking-wider block">Phone Number</label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3 w-4 h-4 text-[#75777f]" />
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000" 
                    required
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-[#c5c6cf] focus:border-[#031635] focus:ring-1 focus:ring-[#031635] outline-none transition-all text-sm bg-[#fbf8fc]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Payment Details Selector Block */}
          <section className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#1a2b4b]/10 flex items-center justify-center text-[#031635]">
                <CreditCard className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-[#031635]">Payment Method</h2>
            </div>

            {/* Slider Switch tabs */}
            <div className="grid grid-cols-3 p-1 bg-[#f5f3f6] rounded-xl mb-8">
              <button 
                type="button"
                onClick={() => selectPaymentMethod('BAKONG')}
                className={`py-3 px-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  paymentMethod === 'BAKONG' 
                    ? 'bg-white text-[#031635] shadow-sm' 
                    : 'text-[#44474e] hover:bg-white/50'
                }`}
              >
                Bakong KHQR
              </button>
              <button 
                type="button"
                onClick={() => selectPaymentMethod('ONLINE')}
                className={`py-3 px-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  paymentMethod === 'ONLINE' 
                    ? 'bg-white text-[#031635] shadow-sm' 
                    : 'text-[#44474e] hover:bg-white/50'
                }`}
              >
                Pay Online
              </button>
              <button 
                type="button"
                onClick={() => selectPaymentMethod('PROPERTY')}
                className={`py-3 px-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  paymentMethod === 'PROPERTY' 
                    ? 'bg-white text-[#031635] shadow-sm' 
                    : 'text-[#44474e] hover:bg-white/50'
                }`}
              >
                Pay at Property
              </button>
            </div>

            {paymentMethod === 'BAKONG' ? (
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6">
                <div className="bg-white border-2 border-[#031635] rounded-xl p-4 flex flex-col items-center justify-center aspect-square">
                  <div className="w-full flex items-center justify-between text-[10px] font-black text-[#031635] mb-2">
                    <span>KHQR</span>
                    <span>BAKONG</span>
                  </div>
                  <div className="flex-1 w-full bg-[#f5f3f6] rounded-lg border border-[#c5c6cf] flex items-center justify-center p-2">
                    <img
                      src={bakongQrUrl}
                      alt={`Bakong KHQR payment code for ${bakongReference}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="mt-2 text-[10px] font-bold text-[#75777f]">ABA / ACLEDA / Bakong</span>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-[#E2E8F0] bg-[#f5f3f6] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-black text-[#031635] uppercase tracking-wider">Scan to Pay</p>
                        <p className="text-sm text-[#44474e] mt-1">Nexus Hospitality Room &amp; Service</p>
                      </div>
                      <span className="font-black text-xl text-[#031635]">${finalTotalAmount}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                      <div>
                        <span className="text-[#75777f] uppercase font-bold block">KHR Estimate</span>
                        <span className="font-black text-[#1b1b1e]">{bakongAmountKhr.toLocaleString()} KHR</span>
                      </div>
                      <div>
                        <span className="text-[#75777f] uppercase font-bold block">Reference</span>
                        <span className="font-mono font-black text-[#1b1b1e]">{bakongReference}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setBakongConfirmed((value) => !value)}
                    className={`w-full h-12 rounded-xl border font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      bakongConfirmed
                        ? 'bg-[#4a9e8f] text-white border-[#4a9e8f]'
                        : 'bg-white text-[#031635] border-[#c5c6cf] hover:border-[#031635]'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{bakongConfirmed ? 'Bakong Transfer Confirmed' : 'I Have Paid with Bakong'}</span>
                  </button>

                  <p className="text-xs text-[#75777f] leading-relaxed">
                    The front desk will reconcile this reference with the Bakong settlement record before check-in. Room service items are included in the same payable amount.
                  </p>
                </div>
              </div>
            ) : paymentMethod === 'ONLINE' ? (
              <div className="space-y-6">
                
                {/* Instant Digital wallets */}
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button" 
                    onClick={() => alert('Autofilling credential settings from Apple Pay secure vault...')}
                    className="flex items-center justify-center h-14 border border-[#c5c6cf] hover:border-[#031635] rounded-xl hover:bg-[#f5f3f6] transition-colors"
                  >
                    <span className="text-sm font-semibold tracking-wide text-black text-center flex items-center gap-1">
                       Pay
                    </span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => alert('Syncing profiles with Google Pay dashboard...')}
                    className="flex items-center justify-center h-14 border border-[#c5c6cf] hover:border-[#031635] rounded-xl hover:bg-[#f5f3f6] transition-colors"
                  >
                    <span className="text-sm font-black text-blue-600 flex items-center gap-1">
                      <span className="text-red-500">G</span>oogle Pay
                    </span>
                  </button>
                </div>

                <div className="relative flex py-4 items-center">
                  <div className="flex-grow border-t border-[#E2E8F0]" />
                  <span className="mx-4 text-xs font-bold text-[#75777f] uppercase tracking-wider block">Or pay with credit card</span>
                  <div className="flex-grow border-t border-[#E2E8F0]" />
                </div>

                {/* Cards attributes inputs */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#44474e] uppercase tracking-wider block">Card Number</label>
                    <div className="relative flex items-center">
                      <input 
                        type="text" 
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="0000 0000 0000 0000" 
                        className="w-full h-11 px-4 pr-12 rounded-lg border border-[#c5c6cf] focus:border-[#031635] focus:ring-1 focus:ring-[#031635] outline-none transition-all text-sm bg-[#fbf8fc]"
                      />
                      <CreditCard className="absolute right-3.5 w-4 h-4 text-[#75777f]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#44474e] uppercase tracking-wider block">Expiry Date</label>
                      <input 
                        type="text" 
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM / YY" 
                        className="w-full h-11 px-4 rounded-lg border border-[#c5c6cf] focus:border-[#031635] focus:ring-1 focus:ring-[#031635] outline-none transition-all text-sm bg-[#fbf8fc]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#44474e] uppercase tracking-wider block">CVV</label>
                      <input 
                        type="text" 
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123" 
                        className="w-full h-11 px-4 rounded-lg border border-[#c5c6cf] focus:border-[#031635] focus:ring-1 focus:ring-[#031635] outline-none transition-all text-sm bg-[#fbf8fc]"
                      />
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-5 bg-[#9ef2e1]/10 border border-[#9ef2e1]/30 rounded-xl flex items-start gap-4 text-[#0e7163]">
                <Info className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#006b5e]" />
                <div className="text-left text-sm">
                  <p className="font-bold">Reservation Guarantee</p>
                  <p className="text-[#005046] mt-1 leading-relaxed">
                    Your rooms details will be firmly held. Final payment is requested upon arrival at the hotel front desk via credit card, wire, or cash.
                  </p>
                </div>
              </div>
            )}
          </section>

          <section className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#1a2b4b]/10 flex items-center justify-center text-[#031635]">
                <Utensils className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-[#031635]">Room Service Payment</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roomServiceItems.map((item) => {
                const selected = selectedServices.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleRoomService(item.id)}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      selected
                        ? 'border-[#006b5e] bg-[#9ef2e1]/10 shadow-sm'
                        : 'border-[#E2E8F0] bg-[#fbf8fc] hover:border-[#c5c6cf]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-[#031635]">{item.name}</p>
                        <p className="text-xs text-[#75777f] mt-1 leading-relaxed">{item.description}</p>
                      </div>
                      <span className="text-sm font-black text-[#031635]">${item.price}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#006b5e]">
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selected ? 'bg-[#006b5e] border-[#006b5e]' : 'bg-white border-[#c5c6cf]'
                      }`}>
                        {selected && <CheckCircle className="w-3 h-3 text-white" />}
                      </span>
                      <span>{selected ? 'Added to payment' : 'Add service'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Special Requests */}
          <section className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#031635] mb-5">Special Requests (Optional)</h2>
            <textarea 
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="e.g. Early check-in preference, hypoallergenic bedding, dietary adjustments, or airport shuttle coordinates..."
              rows={3}
              className="w-full p-4 rounded-lg border border-[#c5c6cf] focus:border-[#031635] focus:ring-1 focus:ring-[#031635] outline-none transition-all text-sm bg-[#fbf8fc] resize-none"
            />
            <p className="text-xs text-[#75777f] mt-2 italic">
              * Hospitality staff will prioritize these requests, but note some premium items may incur additions.
            </p>
          </section>

        </div>

        {/* Right Column: Pricing details and submit button */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Booking Summary Box card */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-md text-left">
            <div className="aspect-[16/10] w-full bg-[#fbf8fc] overflow-hidden relative">
              <img 
                src={room.image} 
                alt={room.name} 
                className="w-full h-full object-cover referral-no-referrer"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-[#031635] text-white text-xs font-bold px-2.5 py-1 rounded shadow-md border border-white/10">
                ⭐ {room.rating}
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-bold text-[#031635] mb-1">{room.name}</h3>
              <p className="text-xs text-[#75777f] mb-4 uppercase font-bold tracking-wider">{room.location}</p>

              <div className="space-y-4 border-t border-[#E2E8F0] pt-4 text-sm">
                
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-[#75777f] uppercase font-bold tracking-wide block">Check-in</span>
                    <span className="font-bold text-[#1b1b1e] text-xs sm:text-sm">{checkIn}</span>
                    <span className="text-[11px] text-[#75777f] block mt-0.5">After 3:00 PM</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#75777f] uppercase font-bold tracking-wide block">Check-out</span>
                    <span className="font-bold text-[#1b1b1e] text-xs sm:text-sm">{checkOut}</span>
                    <span className="text-[11px] text-[#75777f] block mt-0.5">By 11:00 AM</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 py-2 px-3 bg-[#f5f3f6] rounded-xl border border-[#E2E8F0]">
                  <Users className="w-4 h-4 text-[#031635]" />
                  <span className="text-xs font-semibold text-[#1b1b1e]">{occupancy}</span>
                </div>

              </div>
            </div>
          </div>

          {/* Pricing breakdowns details summary card */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-md text-left">
            <h4 className="text-xs font-bold text-[#75777f] uppercase tracking-wider mb-4 block">Price Breakdown</h4>
            
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-[#44474e]">
                <span>${room.price} x {nights} nights</span>
                <span className="font-semibold text-[#1b1b1e]">${totalBase}</span>
              </div>
              <div className="flex justify-between text-[#44474e]">
                <span>Occupancy Duty (12%)</span>
                <span className="font-semibold text-[#1b1b1e]">${taxes}</span>
              </div>
              <div className="flex justify-between text-[#44474e]">
                <span>Eco & Resort Fees</span>
                <span className="font-semibold text-[#1b1b1e]">${resortFees}</span>
              </div>
              <div className="flex justify-between text-[#44474e]">
                <span>Room Service</span>
                <span className="font-semibold text-[#1b1b1e]">${roomServiceTotal}</span>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] flex justify-between items-center text-base">
                <span className="font-bold text-[#031635]">Grand Total Due</span>
                <span className="font-black text-2xl text-[#031635]">${finalTotalAmount}</span>
              </div>
            </div>

            {/* CTA complete checkout button with loaders */}
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full mt-8 py-4 bg-[#031635] text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 select-none uppercase tracking-widest ${
                isSubmitting ? 'opacity-85 cursor-not-allowed' : 'hover:bg-[#1a2b4b] active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing secure lock...</span>
                </>
              ) : (
                <>
                  <span>
                    {paymentMethod === 'BAKONG'
                      ? bakongConfirmed ? 'Complete Bakong Booking' : 'Confirm Bakong Payment'
                      : paymentMethod === 'ONLINE' ? 'Confirm & Pay' : 'Reserve & Confirm'}
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="mt-6 flex items-center gap-2 justify-center text-[11px] text-[#4a9e8f] font-semibold border-t border-[#E2E8F0]/80 pt-4">
              {paymentMethod === 'BAKONG' ? <ReceiptText className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{paymentMethod === 'BAKONG' ? 'Bakong KHQR payment reference required' : 'TLS 1.3 256-bit Secure Reservation'}</span>
            </div>
          </div>

        </div>

      </form>

      {/* Cancellation Banner descriptor */}
      <footer className="mt-8 p-6 bg-[#f5f3f6] rounded-xl border border-dashed border-[#c5c6cf] text-left">
        <div className="flex items-start gap-4">
          <Info className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="text-xs font-bold text-[#031635] uppercase tracking-wider mb-1">Flexible Cancellation Policy</h5>
            <p className="text-xs text-[#75777f] leading-relaxed">
              Enjoy complete peace of mind. Free cancellations are fully honored up to 48 hours prior to the standard check-in coordinate. Any failure to arrive without warning will trigger a standard 1-night baseline charge.
            </p>
          </div>
        </div>
      </footer>

    </section>
  );
}
