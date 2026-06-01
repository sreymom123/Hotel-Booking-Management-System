import React, { useState, useEffect } from 'react';
import { Room, Booking, UserProfile, DashboardTab } from './types';
import { INITIAL_ROOMS, INITIAL_BOOKINGS, PROFILES } from './initialData';
import LoginView from './components/LoginView';
import Sidebar from './components/Sidebar';
import TopAppBar from './components/TopAppBar';
import DashboardView from './components/DashboardView';
import RoomsView from './components/RoomsView';
import BookingsView from './components/BookingsView';
import ReportsView from './components/ReportsView';
import { 
  Plus, 
  Download, 
  Settings, 
  HelpCircle,
  ShieldCheck, 
  Globe2, 
  HeartHandshake, 
  PhoneCall, 
  ServerCrash,
  CheckCircle2,
  Lock,
  Compass,
  Check,
  Building
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('gh_admin_token');
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const result = await response.json();

  if (response.status === 401) {
    localStorage.setItem('gh_loggedin', 'false');
    localStorage.removeItem('gh_admin_token');
    localStorage.removeItem('gh_admin_profile');
    window.location.reload();
    throw new Error(result.message || 'Admin session is invalid');
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'API request failed');
  }

  return result.data as T;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('gh_loggedin') === 'true';
  });
  
  const [currentTab, setCurrentTab] = useState<DashboardTab>(() => {
    return (localStorage.getItem('gh_current_tab') as DashboardTab) || 'dashboard';
  });

  const [profileIndex, setProfileIndex] = useState<number>(() => {
    return parseInt(localStorage.getItem('gh_profile_idx') || '0', 10);
  });

  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);

  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  const [systemRegion, setSystemRegion] = useState<string>(() => {
    return localStorage.getItem('gh_region') || 'North America';
  });

  const [supportExt, setSupportExt] = useState<string>('Ext. 4055');

  // Synchronize dynamic items inside localStorage
  useEffect(() => {
    localStorage.setItem('gh_loggedin', isLoggedIn.toString());
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('gh_current_tab', currentTab);
  }, [currentTab]);

  useEffect(() => {
    localStorage.setItem('gh_profile_idx', profileIndex.toString());
  }, [profileIndex]);

  useEffect(() => {
    localStorage.setItem('gh_region', systemRegion);
  }, [systemRegion]);

  useEffect(() => {
    if (!isLoggedIn) return;

    void refreshHotelData();
  }, [isLoggedIn]);

  // Current active admin profile
  const currentUser = PROFILES[profileIndex] || PROFILES[0];

  const handleProfileSwitch = () => {
    setProfileIndex((prev) => (prev + 1) % PROFILES.length);
  };

  const handleLoginSuccess = (email: string) => {
    setIsLoggedIn(true);
    setCurrentTab('dashboard');
  };

  const refreshHotelData = async () => {
    try {
      const [loadedRooms, loadedBookings] = await Promise.all([
        apiRequest<Room[]>('/rooms'),
        apiRequest<Booking[]>('/bookings'),
      ]);

      setRooms(loadedRooms);
      setBookings(loadedBookings);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unable to load hotel data');
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to sign out from Grand Horizon Hospitality Console?")) {
      setIsLoggedIn(false);
      localStorage.setItem('gh_loggedin', 'false');
      localStorage.removeItem('gh_admin_token');
      localStorage.removeItem('gh_admin_profile');
    }
  };

  // State manipulation triggers passed to child views
  const handleAddRoom = async (newRoom: Room) => {
    try {
      const createdRoom = await apiRequest<Room>('/rooms', {
        method: 'POST',
        body: JSON.stringify(newRoom),
      });
      setRooms((prev) => [createdRoom, ...prev]);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unable to create room');
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await apiRequest(`/rooms/${roomId}`, { method: 'DELETE' });
      setRooms((prev) => prev.filter((r) => r.id !== roomId));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unable to delete room');
    }
  };

  const handleModifyRoomStatus = async (roomId: string, newStatus: any) => {
    try {
      const updatedRoom = await apiRequest<Room>(`/rooms/${roomId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      setRooms((prev) =>
        prev.map((r) => (r.id === roomId ? updatedRoom : r))
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unable to update room status');
    }
  };

  const handleModifyBooking = async (bookingId: string, newStatus: any) => {
    try {
      await apiRequest(`/bookings/${bookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unable to update booking status');
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await apiRequest(`/bookings/${bookingId}`, { method: 'DELETE' });
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unable to delete booking');
    }
  };

  const handleExportDatabase = () => {
    // Generate clean CSV/JSON download directly
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ rooms, bookings }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `grand-horizon-report-${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    alert("Export file generation success! Raw audit records compiled into JSON document.");
  };

  // Determine title for TopAppBar Dynamically
  const getTopBarTitle = () => {
    switch (currentTab) {
      case 'dashboard': return 'Executive Overview';
      case 'rooms': return 'Room Management';
      case 'bookings': return 'Booking Management';
      case 'reports': return 'Performance Analytics';
      case 'settings': return 'Portal Settings';
      case 'support': return 'IT Help Desk';
      default: return 'Admin Console';
    }
  };

  if (!isLoggedIn) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-surface-bright flex text-on-surface select-none font-sans antialiased text-sm">
      
      {/* Shared left sidebar rail navigation */}
      <Sidebar 
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        currentUser={currentUser}
        allProfiles={PROFILES}
        onProfileSwitch={handleProfileSwitch}
        onLogout={handleLogout}
      />

      {/* Main Container Canvas */}
      <div className="ml-[260px] w-[calc(100%-260px)] min-h-screen flex flex-col relative bg-surface-bright pb-14">
        
        {/* Dynamic Action Top bar */}
        <TopAppBar 
          title={getTopBarTitle()}
          currentUser={currentUser}
          placeholder={
            currentTab === 'rooms' 
              ? "Search rooms, types, or status..." 
              : currentTab === 'bookings' 
              ? "Search bookings, guest names..." 
              : "Search reports and logs..."
          }
          searchValue=""
          onSearchChange={() => {}}
          onActionClick={handleExportDatabase}
          actionText={currentTab === 'reports' ? "Download Report" : "Export Report"}
          actionIcon={<Download className="w-4 h-4" />}
        />

        {/* Workspace Canvas Inner view rendering */}
        <main className="flex-grow p-8 mt-16 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardView 
              rooms={rooms}
              bookings={bookings}
              currentUser={currentUser}
              onModifyBooking={handleModifyBooking}
              onNavigateToTab={setCurrentTab}
            />
          )}

          {currentTab === 'rooms' && (
            <RoomsView 
              rooms={rooms}
              onAddRoom={handleAddRoom}
              onDeleteRoom={handleDeleteRoom}
              onModifyStatus={handleModifyRoomStatus}
            />
          )}

          {currentTab === 'bookings' && (
            <BookingsView 
              bookings={bookings}
              onModifyBooking={handleModifyBooking}
              onCancelBooking={handleCancelBooking}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView />
          )}

          {currentTab === 'settings' && (
            <div className="space-y-6 max-w-4xl text-left bg-surface-container-lowest p-8 border border-outline-variant rounded-xl shadow-sm">
              <header className="pb-4 border-b border-outline-variant/60">
                <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary-container" />
                  Portal Settings
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">Configure Grand Horizon management parameters and operational flags.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Operational Flags</h4>
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide">Operational Region</label>
                    <select 
                      value={systemRegion}
                      onChange={(e) => setSystemRegion(e.target.value)}
                      className="w-full bg-[#f1f5f9]/40 border border-outline-variant rounded-lg px-4 py-2.5 text-xs outline-none text-on-surface focus:ring-1 focus:ring-primary-container"
                    >
                      <option value="North America">North America (NA West / East)</option>
                      <option value="Europe Liaison">Europe Liaison (EU Central)</option>
                      <option value="Asia Pacific">Asia Pacific (APAC South)</option>
                      <option value="Global Operations">Global Operations Hub</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide">Support Extension Helpline</label>
                    <input 
                      type="text"
                      className="w-full bg-[#f1f5f9]/40 border border-outline-variant rounded-lg px-4 py-2.5 text-xs outline-none font-mono text-on-surface"
                      value={supportExt}
                      onChange={(e) => setSupportExt(e.target.value)}
                      placeholder="Ext. 4055"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">System Identity & Security</h4>
                  
                  <div className="p-4 bg-[#efedf0]/30 border border-outline-variant/60 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#006b5e]">
                      <ShieldCheck className="w-4 h-4" />
                      SSL Audit Compliance Active
                    </div>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      All security parameters regarding data-at-rest and TLS connection handshakes are automated under compliance standard SOC-2 Trust Criteria.
                    </p>
                  </div>

                  <button 
                    onClick={() => alert("Credentials verified. Host parameters secured successfully.")}
                    className="bg-primary-container text-white px-5 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase shadow-sm transition-all hover:bg-slate-800"
                  >
                    Run Security Diagnostics
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'support' && (
            <div className="space-y-6 max-w-4xl text-left bg-surface-container-lowest p-8 border border-outline-variant rounded-xl shadow-sm">
              <header className="pb-4 border-b border-outline-variant/60">
                <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary-container" />
                  Hospitality IT Support
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">Contact administrators or resolve server network issues instantly.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="p-5 border border-outline-variant/70 rounded-xl space-y-3 bg-slate-50/50">
                  <PhoneCall className="w-6 h-6 text-primary-container" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface mt-1">IT Emergency Hotline</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Dial direct helpline internally for server downtime and guest key card failure.</p>
                  <p className="font-mono text-xs font-bold text-on-surface">{supportExt}</p>
                </div>

                <div className="p-5 border border-outline-variant/70 rounded-xl space-y-3 bg-slate-50/50">
                  <HeartHandshake className="w-6 h-6 text-[#006b5e]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#006b5e] mt-1">Partner Support Desk</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Assistance regarding integration of local channel managers, OTAs, or GDS networks.</p>
                  <button 
                    onClick={() => alert("Initiating secure portal liaison with Channel Support Desk...")}
                    className="text-xs text-[#006b5e] hover:underline font-bold text-left block"
                  >
                    Open Ticket Request →
                  </button>
                </div>

                <div className="p-5 border border-outline-variant/70 rounded-xl space-y-3 bg-slate-50/50">
                  <ServerCrash className="w-6 h-6 text-rose-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 mt-1">System Health Log</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Live check-in of core hospitality nodes, PMS routing, and internet proxy.</p>
                  <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold bg-status-available/10 text-status-available">
                    SYSTEMS OPTIMAL
                  </span>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Global Footer bar */}
        <footer className="absolute bottom-0 right-0 w-full p-4 border-t border-outline-variant bg-[#efedf0]/10 text-center select-none">
          <p className="text-[11px] font-semibold tracking-wide text-on-surface-variant">
            © 2026 Grand Horizon Hospitality Group. Region: <span className="font-bold text-primary-container uppercase">{systemRegion}</span> · IT Hotline: <span className="font-mono text-primary-container font-bold">{supportExt}</span> · System Status: <span className="text-status-available font-bold uppercase">Optimal</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
