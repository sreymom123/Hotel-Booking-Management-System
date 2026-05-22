import React from 'react';
import { 
  Building2, 
  Settings, 
  ShieldCheck, 
  Bell, 
  Search, 
  HelpCircle,
  Menu,
  X
} from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onSearchChange?: (term: string) => void;
  searchTerm?: string;
  onToggleAdmin?: () => void;
  isAdminLoggedIn: boolean;
}

export default function Header({
  currentView,
  onNavigate,
  onSearchChange,
  searchTerm = '',
  onToggleAdmin,
  isAdminLoggedIn
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'rooms', label: 'Room Listing' },
    { id: 'bookings', label: 'My Bookings' },
    { id: 'support', label: 'Support' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#1a2b4b] border-b border-white/10 shadow-lg text-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-[72px] flex items-center justify-between">
        
        {/* Brand & Desktop Navigation */}
        <div className="flex items-center gap-8 md:gap-10">
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 bg-[#031635] text-[#9ef2e1] rounded-lg flex items-center justify-center border border-white/10 transition-transform group-hover:scale-105">
              <Building2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-white/90">
              Nexus Hospitality
            </h1>
          </div>

          {/* Desktop Navigation Link Cluster */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative py-1 font-medium transition-all text-sm uppercase tracking-wider select-none ${
                  currentView === item.id 
                    ? 'text-[#9ef2e1]' 
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {item.label}
                {currentView === item.id && (
                  <span className="absolute bottom-[-10px] left-0 right-0 h-0.5 bg-[#9ef2e1]" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Global Search and Actions */}
        <div className="flex-grow max-w-xs md:max-w-md mx-4 lg:mx-8 hidden md:block">
          {onSearchChange && (
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-white/50" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search destinations, rooms..."
                className="w-full bg-white/10 border border-white/20 rounded-full py-1.5 pl-10 pr-4 text-white text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#9ef2e1]/30 focus:border-transparent transition-all"
              />
            </div>
          )}
        </div>

        {/* Support, Settings, Admin, User actions */}
        <div className="flex items-center gap-4 lg:gap-6">
          
          {/* Support Link */}
          <button 
            onClick={() => onNavigate('support')}
            className={`hidden xl:flex items-center gap-2 text-white/80 hover:text-white transition-all text-sm font-medium select-none ${
              currentView === 'support' ? 'text-[#9ef2e1]' : ''
            }`}
          >
            <HelpCircle className="w-5 h-5" />
            <span>Support</span>
          </button>

          {/* Settings / Admin Switcher */}
          <button 
            onClick={onToggleAdmin}
            className={`flex items-center gap-1.5 transition-all text-sm font-medium ${
              isAdminLoggedIn 
                ? 'text-[#9ef2e1] hover:text-[#9ef2e1]/80 bg-white/10 rounded-lg px-3 py-1 border border-[#9ef2e1]/30' 
                : 'text-white/80 hover:text-white'
            }`}
            title="Access Admin Workspace login"
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="hidden md:inline">{isAdminLoggedIn ? 'Staff Portal' : 'Admin'}</span>
          </button>

          <div className="h-6 w-px bg-white/20 hidden sm:block"></div>

          {/* Notifications */}
          <button className="relative p-1 text-white/80 hover:text-white transition-all rounded-full hover:bg-white/5">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
          </button>

          {/* User Profile avatar info */}
          <div 
            onClick={() => onNavigate('bookings')}
            className="flex items-center gap-2.5 pl-1 cursor-pointer select-none group"
            title="Alexander Wright"
          >
            <div className="w-9 h-9 rounded-full border-2 border-white/20 overflow-hidden group-hover:border-white/40 transition-colors">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtv4QO0Z-9Q_D8g_WnF8A5U_I-z9v5P_H-K_M-lJ4z7q0tG-z6kX_l_X=s120" 
                alt="Alexander Profile" 
                className="w-full h-full object-cover referral-no-referrer"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="hidden xl:inline text-sm font-medium text-white/90 group-hover:text-white">
              Alexander Wright
            </span>
          </div>

          {/* Hamburger Menu on Mobile */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1 text-white/80 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-[72px] left-0 right-0 bg-[#1a2b4b] border-b border-white/10 py-4 px-6 space-y-3 shadow-xl flex flex-col z-50">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2 px-3 rounded-lg text-sm font-semibold select-none ${
                currentView === item.id 
                  ? 'bg-white/10 text-[#9ef2e1]' 
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={() => {
                onNavigate('support');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-white/80 hover:bg-white/5 flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" /> Support Contact Area
            </button>
            <button
              onClick={() => {
                if (onToggleAdmin) onToggleAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-white/80 hover:bg-white/5 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> staff login Area
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
