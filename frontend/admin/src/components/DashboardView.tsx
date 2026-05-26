import { Room, Booking, UserProfile } from '../types';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  CalendarDays, 
  Bed, 
  DollarSign, 
  UserCheck, 
  MoreVertical,
  Activity,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface DashboardViewProps {
  rooms: Room[];
  bookings: Booking[];
  currentUser: UserProfile;
  onModifyBooking: (id: string, newStatus: any) => void;
  onNavigateToTab: (tab: any) => void;
}

export default function DashboardView({ 
  rooms, 
  bookings, 
  currentUser,
  onModifyBooking,
  onNavigateToTab
}: DashboardViewProps) {
  
  // Dynamically calculate metrics based on live state inside App.tsx
  const totalBookingsCount = bookings.length;
  const averageOccupancy = ((rooms.filter(r => r.status === 'Occupied').length / rooms.length) * 100).toFixed(1);
  const activeBookingsPending = bookings.filter(b => b.status === 'Pending').length;
  
  // Filter recent bookings to show on Dashboard
  const recentBookings = bookings.slice(-5);

  const stats = [
    {
      title: 'Total Bookings',
      value: (1200 + totalBookingsCount).toLocaleString(),
      change: '+12.5%',
      isPositive: true,
      icon: CalendarDays,
      iconBg: 'bg-[#9cefde]/20 text-[#006b5e]'
    },
    {
      title: 'Occupancy Rate',
      value: `${averageOccupancy}%`,
      change: '+4.2%',
      isPositive: true,
      icon: Bed,
      iconBg: 'bg-[#9ff2e1]/20 text-[#0b6f62]'
    },
    {
      title: 'Revenue (June)',
      value: `$${(41000 + (bookings.reduce((sum, b) => sum + b.amount, 0) / 10)).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`,
      change: '-0.8%',
      isPositive: false,
      icon: DollarSign,
      iconBg: 'bg-amber-100 text-amber-700'
    },
    {
      title: 'Pending Check-ins',
      value: (30 + activeBookingsPending).toString(),
      change: 'Active',
      isPositive: true,
      icon: UserCheck,
      iconBg: 'bg-[#d8e2ff] text-[#081b3a]'
    }
  ];

  // Room Inventory inventory data calculation
  const standardTotal = rooms.filter(r => r.type === 'Standard').length;
  const standardAvailable = rooms.filter(r => r.type === 'Standard' && r.status === 'Available').length;
  const deluxeTotal = rooms.filter(r => r.type === 'Deluxe').length;
  const deluxeAvailable = rooms.filter(r => r.type === 'Deluxe' && r.status === 'Available').length;
  const suiteTotal = rooms.filter(r => r.type === 'Suite' || r.type === 'Executive').length;
  const suiteAvailable = rooms.filter(r => (r.type === 'Suite' || r.type === 'Executive') && r.status === 'Available').length;

  const readyCount = rooms.filter(r => r.status === 'Available').length;
  const cleaningCount = rooms.filter(r => r.status === 'Cleaning').length;
  const maintenanceCount = rooms.filter(r => r.status === 'Maintenance').length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-10 font-sans"
    >
      {/* Header section */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-on-surface">Executive Overview</h2>
          <p className="text-sm text-on-surface-variant mt-1 leading-none">Performance metrics for Grand Horizon International, June 2024</p>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx}
              className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-lg ${stat.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
                  stat.isPositive 
                    ? 'text-status-available bg-status-available/10' 
                    : 'text-error bg-error/10'
                }`}>
                  {stat.change}
                  {stat.change.includes('%') && (
                    stat.isPositive ? <TrendingUp className="w-3.5 h-3.5 ml-1" /> : <TrendingDown className="w-3.5 h-3.5 ml-1" />
                  )}
                </span>
              </div>
              <p className="text-[11px] font-semibold tracking-wider text-on-surface-variant uppercase">{stat.title}</p>
              <h3 className="text-2xl font-bold text-on-surface mt-1.5">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Main Content Area split screen */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left column: Recent Bookings */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50">
            <h4 className="text-base font-semibold text-on-surface">Recent Bookings</h4>
            <button 
              onClick={() => onNavigateToTab('bookings')}
              className="text-xs font-semibold text-[#006b5e] hover:underline uppercase tracking-wide cursor-pointer"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low/30 text-on-surface-variant text-[11px] font-semibold tracking-wider uppercase border-b border-outline-variant/60">
                <tr>
                  <th className="px-6 py-4">Guest</th>
                  <th className="px-6 py-4">Room Type</th>
                  <th className="px-6 py-4">Stay Dates</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-surface-container-low/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-container text-[#b6c6ee] flex items-center justify-center font-bold text-xs select-none">
                          {booking.guestInitials}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-on-surface leading-tight">{booking.guestName}</p>
                          <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold mt-0.5">ID: #{booking.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-body-md text-xs text-on-surface-variant">
                      {booking.roomType}
                    </td>
                    <td className="px-6 py-4 font-body-md text-xs text-on-surface-variant flex items-center gap-2 mt-2 border-none">
                      <Calendar className="w-3.5 h-3.5 text-on-surface-variant/70" />
                      {booking.checkInDate}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        booking.status === 'Confirmed' 
                          ? 'bg-status-available/10 text-status-available border border-status-available/20' 
                          : booking.status === 'Checked-in' 
                          ? 'bg-status-occupied/10 text-status-occupied border border-status-occupied/20' 
                          : 'bg-status-cleaning/10 text-status-cleaning border border-status-cleaning/20'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => {
                          const states: any[] = ['Confirmed', 'Checked-in', 'Pending', 'Checked-out'];
                          const next = states[(states.indexOf(booking.status) + 1) % states.length];
                          onModifyBooking(booking.id, next);
                        }}
                        className="p-1 hover:bg-surface-container rounded-lg text-on-surface-variant select-none cursor-pointer"
                        title="Click to cycle status"
                      >
                        <MoreVertical className="w-4 h-4 mx-auto group-hover:text-primary-container" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column: Room Inventory Status */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-semibold text-on-surface mb-1">Room Inventory</h4>
            <p className="text-xs text-on-surface-variant mb-6 leading-tight">Real-time status across categories.</p>
            
            <div className="space-y-6 flex-grow mb-6">
              {/* Standard */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-on-surface">Standard Rooms</span>
                  <span className="text-[11px] text-on-surface-variant tracking-wide">{standardAvailable}/{standardTotal || 50} Available</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-status-available h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${(standardAvailable / (standardTotal || 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Deluxe */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-on-surface">Deluxe Rooms</span>
                  <span className="text-[11px] text-on-surface-variant tracking-wide">{deluxeAvailable}/{deluxeTotal || 30} Available</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#006b5e] h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${(deluxeAvailable / (deluxeTotal || 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Suites */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-on-surface">Executive & Suites</span>
                  <span className="text-[11px] text-on-surface-variant tracking-wide">{suiteAvailable}/{suiteTotal || 12} Available</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary-container h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${(suiteAvailable / (suiteTotal || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-outline-variant/60">
            <div className="flex items-center justify-between px-2">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-4 border-status-available flex items-center justify-center text-status-available font-bold text-sm bg-status-available/5 transition-transform hover:scale-105 select-none duration-200">
                  {readyCount}
                </div>
                <span className="text-[9px] uppercase font-bold tracking-wider text-on-surface-variant mt-2">Ready</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-4 border-status-cleaning flex items-center justify-center text-status-cleaning font-bold text-sm bg-status-cleaning/5 transition-transform hover:scale-105 select-none duration-200">
                  {cleaningCount}
                </div>
                <span className="text-[9px] uppercase font-bold tracking-wider text-on-surface-variant mt-2">Cleaning</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-4 border-rose-500 flex items-center justify-center text-rose-500 font-bold text-sm bg-rose-500/5 transition-transform hover:scale-105 select-none duration-200">
                  {maintenanceCount}
                </div>
                <span className="text-[9px] uppercase font-bold tracking-wider text-on-surface-variant mt-2">Maint.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Stats Bar: Logistics Audit */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col md:flex-row items-center justify-between shadow-sm gap-6 mt-8">
        <div className="flex items-center gap-4 self-start md:self-auto">
          <div className="bg-primary-container/10 p-3 rounded-lg text-primary-container">
            <Activity className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h5 className="font-semibold text-sm text-on-surface">System Health &amp; Logistics</h5>
            <p className="text-xs text-on-surface-variant mt-1 leading-snug">All peripheral management systems are operating within optimal parameters.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto self-start md:self-auto justify-start md:justify-end">
          <div className="px-4 py-2 bg-surface-container-low rounded-lg text-xs font-semibold text-on-surface-variant border border-outline-variant/30 flex items-center gap-2 select-none">
            <span className="w-2.5 h-2.5 rounded-full bg-status-available animate-pulse" />
            PMS Connected
          </div>
          <div className="px-4 py-2 bg-surface-container-low rounded-lg text-xs font-semibold text-on-surface-variant border border-outline-variant/30 flex items-center gap-2 select-none">
            <span className="w-2.5 h-2.5 rounded-full bg-status-available animate-pulse" />
            Channel Manager Active
          </div>
        </div>
      </div>
    </motion.div>
  );
}
