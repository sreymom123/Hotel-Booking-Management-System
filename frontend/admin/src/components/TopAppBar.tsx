import React from 'react';
import { UserProfile } from '../types';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  User, 
  Download, 
  LogOut,
  Sparkles
} from 'lucide-react';

interface TopAppBarProps {
  title: string;
  placeholder?: string;
  currentUser: UserProfile;
  onSearchChange?: (val: string) => void;
  searchValue?: string;
  onActionClick?: () => void;
  actionText?: string;
  actionIcon?: React.ReactNode;
}

export default function TopAppBar({
  title,
  placeholder = "Search...",
  currentUser,
  onSearchChange,
  searchValue = "",
  onActionClick,
  actionText,
  actionIcon
}: TopAppBarProps) {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-260px)] h-16 bg-surface-container-lowest border-b border-border-subtle flex items-center justify-between px-8 z-40 shadow-sm font-sans">
      {/* Search Input block */}
      <div className="flex items-center gap-4 flex-1">
        {onSearchChange && (
          <div className="relative w-full max-w-md focus-within:ring-2 focus-within:ring-primary-container/25 focus-within:border-primary-container border border-outline-variant/50 rounded-lg bg-surface-container-low transition-all">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-transparent border-none rounded-lg pl-10 pr-4 py-2 font-body-md focus:ring-0 text-sm text-on-surface outline-none"
              placeholder={placeholder}
            />
          </div>
        )}
      </div>

      {/* User Actions Profile Indicators */}
      <div className="flex items-center gap-6 select-none">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => alert("All notifications read. System online.")}
            className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-all relative cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full border border-surface-container-lowest" />
          </button>
          
          <button 
            onClick={() => alert("Need assistance? Please contact IT Support at Ext 4055.")}
            className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-all cursor-pointer"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="h-8 w-[1px] bg-border-subtle" />

        {/* Console / Action Button Section */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img 
              alt="User profile" 
              className="h-8 w-8 rounded-full object-cover ring-2 ring-secondary-container"
              src={currentUser.avatar}
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col text-left">
              <span className="font-semibold text-xs text-on-surface">{currentUser.name}</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold leading-none mt-0.5">
                {currentUser.role}
              </span>
            </div>
          </div>

          {onActionClick && actionText && (
            <button
              onClick={onActionClick}
              className="bg-primary-container text-white px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase shadow-sm transition-all hover:bg-slate-800 hover:shadow hover:brightness-110 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              {actionIcon || <Download className="w-4 h-4" />}
              {actionText}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
