import { DashboardTab, UserProfile } from '../types';
import { 
  History,
  LayoutDashboard, 
  Bed, 
  CalendarDays, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronDown
} from 'lucide-react';

interface SidebarProps {
  currentTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  currentUser: UserProfile;
  allProfiles: UserProfile[];
  onProfileSwitch: () => void;
  onLogout: () => void;
}

export default function Sidebar({ 
  currentTab, 
  onTabChange, 
  currentUser, 
  onProfileSwitch, 
  onLogout 
}: SidebarProps) {
  
  const navItems = [
    { id: 'dashboard' as DashboardTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'rooms' as DashboardTab, label: 'Rooms', icon: Bed },
    { id: 'bookings' as DashboardTab, label: 'Bookings', icon: CalendarDays },
    { id: 'reports' as DashboardTab, label: 'Reports', icon: BarChart3 },
  ];

  const utilityItems = [
    { id: 'settings' as DashboardTab, label: 'Settings', icon: Settings },
    { id: 'support' as DashboardTab, label: 'Support', icon: HelpCircle },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-sidebar-bg flex flex-col border-r border-[#1e293b] z-50 text-slate-300 select-none">
      {/* Brand Header */}
      <div className="px-6 py-8 flex flex-col">
        <h1 className="text-xl font-bold text-white tracking-tight leading-none">Grand Horizon</h1>
        <p className="text-xs text-slate-400 mt-1.5 font-medium tracking-wider uppercase">Management Portal</p>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              id={`nav-${item.id}`}
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer active:scale-95 ${
                isActive 
                  ? 'bg-primary-container text-[#b6c6ee] font-semibold shadow-sm border border-[#2e3b5e]/30' 
                  : 'hover:bg-[#1e293b] hover:text-white text-slate-400'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#b6c6ee]' : 'text-slate-400 group-hover:text-white'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Navigation Utilities */}
      <div className="p-4 border-t border-[#1e293b] space-y-1">
        {utilityItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              id={`nav-util-${item.id}`}
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer active:scale-95 ${
                isActive 
                  ? 'bg-primary-container text-[#b6c6ee] font-semibold border border-[#2e3b5e]/30' 
                  : 'hover:bg-[#1e293b] hover:text-white text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5 text-slate-400" />
              <span>{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all text-rose-400 hover:bg-rose-950/25 hover:text-rose-300 cursor-pointer active:scale-95"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>

        {/* Dynamic Admin Switcher */}
        <div 
          onClick={onProfileSwitch}
          className="flex items-center gap-3 px-3 py-3 mt-4 border-t border-[#1e293b] hover:bg-[#1e293b]/70 rounded-lg cursor-pointer transition-colors group"
          title="Click to toggle Admin Profile"
        >
          <img 
            alt="Admin User Profile" 
            className="w-9 h-9 rounded-full object-cover border border-[#2e3b5e] group-hover:border-[#4e5e81] transition-colors"
            src={currentUser.avatar}
            referrerPolicy="no-referrer"
          />
          <div className="overflow-hidden flex-1 text-left select-none">
            <p className="text-xs font-semibold text-white truncate leading-tight flex items-center gap-1.5">
              {currentUser.name}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 self-center" />
            </p>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest leading-none mt-0.5">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
