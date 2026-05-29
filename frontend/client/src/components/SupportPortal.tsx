import React, { useState } from 'react';
import { 
  CalendarDays, 
  Award, 
  SlidersHorizontal, 
  Wallet, 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Loader2, 
  Building 
} from 'lucide-react';

export default function SupportPortal() {
  // Support state
  const [ticketTopic, setTicketTopic] = useState('Booking Modification');
  const [fullName, setFullName] = useState('John Doe');
  const [emailAddress, setEmailAddress] = useState('john@example.com');
  const [messageText, setMessageText] = useState('How can we assist you today?');
  
  // Submit animation
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setMessageText('');
      }, 3500);
    }, 1800);
  };

  const handleCategoryAlert = (cat: string) => {
    alert(`Loading comprehensive ${cat} FAQ documents and guides...`);
  };

  return (
    <div className="text-[#1b1b1e]">
      
      {/* Hero Welcome banner */}
      <section className="relative bg-[#1a2b4b] text-white py-16 md:py-20 overflow-hidden text-center">
        <div className="max-w-5xl mx-auto px-6 relative z-10 space-y-6">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            How can we help you today?
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Access our comprehensive knowledge base or reach out directly to our dedicated hospitality administration office for personalized workspace support.
          </p>
          
          {/* Categories grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4 text-[#1b1b1e]">
            
            <div 
              onClick={() => handleCategoryAlert('Booking')}
              className="bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-xl p-6 transition-all duration-200 cursor-pointer group text-center"
            >
              <div className="w-12 h-12 bg-[#9ef2e1]/20 text-[#9ef2e1] rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <CalendarDays className="w-6 h-6" />
              </div>
              <h3 className="text-white font-bold text-sm">Booking</h3>
              <p className="text-white/60 text-xs mt-1 leading-relaxed">Reservations, shifts, cancellations, and availability</p>
            </div>

            <div 
              onClick={() => handleCategoryAlert('Loyalty')}
              className="bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-xl p-6 transition-all duration-200 cursor-pointer group text-center"
            >
              <div className="w-12 h-12 bg-[#d8e2ff]/20 text-[#d8e2ff] rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-white font-bold text-sm">Loyalty</h3>
              <p className="text-white/60 text-xs mt-1 leading-relaxed">Nexus Rewards, status accounts, and tier limits</p>
            </div>

            <div 
              onClick={() => handleCategoryAlert('Technical')}
              className="bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-xl p-6 transition-all duration-200 cursor-pointer group text-center"
            >
              <div className="w-12 h-12 bg-[#d3e4fe]/20 text-[#d3e4fe] rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h3 className="text-white font-bold text-sm">Technical</h3>
              <p className="text-white/60 text-xs mt-1 leading-relaxed">Portal configuration, codes, and Bluetooth keys</p>
            </div>

            <div 
              onClick={() => handleCategoryAlert('Billing')}
              className="bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-xl p-6 transition-all duration-200 cursor-pointer group text-center"
            >
              <div className="w-12 h-12 bg-[#9ef2e1]/20 text-[#9ef2e1] rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-white font-bold text-sm">Billing</h3>
              <p className="text-white/60 text-xs mt-1 leading-relaxed">Invoice printing, transactions, and corporate refunds</p>
            </div>

          </div>
        </div>

        {/* Parallax background blobs */}
        <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-[#4a9e8f]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -top-24 -right-16 w-80 h-80 bg-[#d8e2ff]/5 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Contact details section */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-16">
        <div className="flex flex-col lg:flex-row gap-12 text-left">
          
          {/* Left panel: details channels */}
          <div className="w-full lg:w-1/3 space-y-6">
            <h2 className="text-2xl font-bold text-[#031635]">Contact Administration</h2>
            <p className="text-sm text-[#75777f] leading-relaxed">
              If your request requires immediate intervention, please query any of our official executive support channels.
            </p>

            <div className="space-y-4">
              
              {/* Channel 1 */}
              <div className="bg-white border border-[#E2E8F0] p-5 rounded-xl flex gap-4 shadow-sm items-start">
                <div className="bg-[#9ef2e1]/40 text-[#0e7163] p-3 rounded-xl shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#031635]">Live Support</h4>
                  <p className="text-xs text-[#75777f] mt-1">Average wait: Under 2 mins</p>
                  <button 
                    onClick={() => alert('Launching automated secure live chat module... Directing to manager.')} 
                    className="text-xs font-black text-[#006b5e] hover:underline mt-2 flex items-center gap-1 select-none"
                  >
                    <span>Start Chat</span>
                    <span className="text-xs">→</span>
                  </button>
                </div>
              </div>

              {/* Channel 2 */}
              <div className="bg-white border border-[#E2E8F0] p-5 rounded-xl flex gap-4 shadow-sm items-start">
                <div className="bg-[#d8e2ff]/40 text-[#1a2b4b] p-3 rounded-xl shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#031635]">Phone Support</h4>
                  <p className="text-xs text-[#1b1b1e] mt-1 font-semibold">+1 (888) NEXUS-HP</p>
                  <p className="text-[10px] text-[#75777f] mt-0.5">Mon-Fri: 08:00 - 22:00 EST</p>
                </div>
              </div>

              {/* Channel 3 */}
              <div className="bg-white border border-[#E2E8F0] p-5 rounded-xl flex gap-4 shadow-sm items-start">
                <div className="bg-[#d3e4fe]/40 text-[#0f172a] p-3 rounded-xl shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#031635]">Email Inquiries</h4>
                  <p className="text-xs text-[#1b1b1e] mt-1 font-mono">concierge@nexus-hospitality.com</p>
                </div>
              </div>

              {/* Channel 4 */}
              <div className="bg-white border border-[#E2E8F0] p-5 rounded-xl flex gap-4 shadow-sm items-start">
                <div className="bg-[#e9e7eb] text-[#031635] p-3 rounded-xl shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#031635]">Global Headquarters</h4>
                  <p className="text-xs text-[#75777f] mt-1 leading-relaxed">
                    500 Madison Avenue, 22nd Floor<br />
                    New York, NY 10022
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right panel: Custom Send Message Form */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 md:p-10 shadow-sm text-left">
              <h3 className="text-2xl font-bold text-[#031635] mb-2">Send a Message</h3>
              <p className="text-sm text-[#75777f] mb-8">
                Our support officers typically analyze queries and respond within 24 business hours.
              </p>

              {status === 'success' ? (
                <div className="p-8 bg-green-50 rounded-xl border border-green-200 text-center space-y-3 animate-bounce">
                  <CheckCircle2 className="w-12 h-12 text-[#4A9E8F] mx-auto" />
                  <h4 className="font-bold text-lg text-green-900">Message Dispatched!</h4>
                  <p className="text-sm text-green-700 max-w-md mx-auto">
                    Your help ticket has been successfully locked under topic ID NH-TKT-{Math.floor(1000 + Math.random() * 9000)}. We'll email John soon!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitTicket} className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#44474e] uppercase tracking-wider block">Full Name</label>
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full border border-[#E2E8F0] focus:border-[#031635] focus:ring-1 focus:ring-[#031635] rounded-lg p-3 bg-[#f5f3f6] text-sm outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#44474e] uppercase tracking-wider block">Email Address</label>
                      <input 
                        type="email" 
                        value={emailAddress}
                        required
                        onChange={(e) => setEmailAddress(e.target.value)}
                        className="w-full border border-[#E2E8F0] focus:border-[#031635] focus:ring-1 focus:ring-[#031635] rounded-lg p-3 bg-[#f5f3f6] text-sm outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#44474e] uppercase tracking-wider block">Inquiry Subject</label>
                    <select 
                      value={ticketTopic} 
                      onChange={(e) => setTicketTopic(e.target.value)}
                      className="w-full border border-[#E2E8F0] focus:border-[#031635] focus:ring-1 focus:ring-[#031635] rounded-lg p-3 bg-[#f5f3f6] text-sm outline-none transition-all"
                    >
                      <option value="Booking Modification">Booking Modification</option>
                      <option value="Corporate Partnership">Corporate Partnership</option>
                      <option value="Membership Tier Upgrade">Membership Tier Upgrade</option>
                      <option value="Feedback & suggestions">Feedback & suggestions</option>
                      <option value="Other System query">Other System query</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#44474e] uppercase tracking-wider block">Your Message</label>
                    <textarea 
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      required
                      placeholder="Detail your request comprehensively here..."
                      rows={5}
                      className="w-full border border-[#E2E8F0] focus:border-[#031635] focus:ring-1 focus:ring-[#031635] rounded-lg p-3 bg-[#f5f3f6] text-sm outline-none transition-all resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={status === 'loading'}
                    className={`px-8 py-3 bg-[#031635] text-white font-bold text-xs uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 select-none h-12 w-full sm:w-auto ${
                      status === 'loading' ? 'opacity-80 cursor-not-allowed' : 'hover:bg-[#1a2b4b] active:scale-[0.98]'
                    }`}
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Ticket...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Message</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Visual Elegant bottom panel section */}
      <section className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-3xl shadow-lg border border-[#E2E8F0]">
        <div className="bg-[#031635] text-white p-12 md:p-20 flex flex-col justify-center text-left space-y-6">
          <span className="text-[#9ef2e1] font-bold uppercase tracking-wider text-xs block">Visit Us</span>
          <h3 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Elegance in the Heart of the City
          </h3>
          <p className="text-sm md:text-base text-white/70 leading-relaxed">
            Our administrative workspace offices are embedded deep within the historic Madison Square district in Manhattan, reflecting our commitment to timeless high-fidelity hospitality and outstanding architectural excellence.
          </p>
          <div className="flex items-center gap-4 pt-4 text-left">
            <div className="bg-white/10 rounded-full p-3 text-[#9ef2e1]">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">The Nexus Tower</p>
              <p className="text-xs text-white/60">New York City, USA</p>
            </div>
          </div>
        </div>

        <div className="h-[400px] relative bg-slate-900 group">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbhaxkJvZiNx8Pdc26-RaheQsXdQWr7dFywTevCI_xrEZ5r44Zp56c3Lxji2GXUQ9gItjbsUEBKuDLVi5xWRvAXx7e-CU9iwOv6seKrTbnPp11AXvWd6DcoumSkGs1ubYWclxDSgLyvyLqpP7--mGoCdPVEUsPu0tMBehm9t51_npniKSwe421M5ubKA8nwfgqlJ_P5j3YSdKD2VE-EEvus3EbWtH_l3uw5BeOR7tHjcpPLi03xlNieuk3wIrzkV437ldtSb0cRbc" 
            alt="Walnut office premium corporate lobby" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 referral-no-referrer"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#031635]/20" />
        </div>
      </section>
      

    </div>
  );
}
