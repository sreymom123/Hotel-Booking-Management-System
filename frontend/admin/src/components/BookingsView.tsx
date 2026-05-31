import React, { useState } from 'react';
import { Booking, BookingStatus } from '../types';
import { motion } from 'motion/react';
import { 
  Filter,
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Edit, 
  Trash,
  CheckCircle,
  Clock,
  LogOut,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  UserX,
  X
} from 'lucide-react';

interface BookingsViewProps {
  bookings: Booking[];
  onModifyBooking: (id: string, newStatus: BookingStatus) => void;
  onCancelBooking: (id: string) => void;
}

export default function BookingsView({ 
  bookings, 
  onModifyBooking,
  onCancelBooking
}: BookingsViewProps) {
  // Filter variables
  const [statusFilter, setStatusFilter] = useState('All Bookings');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 4;

  const handleUpdateStatus = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowStatusModal(true);
  };

  const saveSelectedBookingStatus = (status: BookingStatus) => {
    if (selectedBooking) {
      onModifyBooking(selectedBooking.id, status);
      setShowStatusModal(false);
      setSelectedBooking(null);
    }
  };

  // Live filter computed data
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.roomType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Bookings' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const lastIdx = currentPage * bookingsPerPage;
  const firstIdx = lastIdx - bookingsPerPage;
  const currentBookings = filteredBookings.slice(firstIdx, lastIdx);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage) || 1;

  // Render bullet classes for booking statuses
  const getBulletClass = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed': return 'bg-status-available text-status-available';
      case 'Checked-in': return 'bg-status-occupied text-status-occupied';
      case 'Pending': return 'bg-status-cleaning text-status-cleaning';
      default: return 'bg-slate-400 text-slate-500';
    }
  };

  const getBadgeClass = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed': return 'bg-status-available/10 text-status-available';
      case 'Checked-in': return 'bg-status-occupied/10 text-status-occupied';
      case 'Pending': return 'bg-status-cleaning/10 text-status-cleaning';
      case 'Checked-out': return 'bg-slate-100 text-slate-600';
      case 'No Show': return 'bg-rose-100 text-rose-600';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-10 font-sans"
    >
      {/* Header and top Filter Block */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-on-surface">Booking Management</h2>
          <p className="text-sm text-on-surface-variant mt-1 leading-none">Oversee and manage current guest reservations and check-in statuses.</p>
        </div>

        {/* Filters cluster */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant shadow-sm w-full lg:w-auto">
          <div className="flex flex-col gap-1 px-3 w-full sm:w-auto">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Filter by Status</span>
            <select 
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border-none bg-surface-container-low rounded px-4 py-[5px] text-xs font-semibold focus:ring-1 focus:ring-primary-container text-on-surface outline-none cursor-pointer min-w-[140px]"
            >
              <option value="All Bookings">All Bookings</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Checked-in">Checked-in</option>
              <option value="Pending">Pending</option>
              <option value="Checked-out">Checked-out</option>
              <option value="No Show">No Show</option>
            </select>
          </div>
          
          <div className="hidden sm:block w-px h-10 bg-outline-variant" />

          <div className="flex flex-col gap-1 px-3 w-full sm:w-auto self-start sm:self-auto">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Date Range</span>
            <div className="flex items-center gap-2 mt-0.5 select-none">
              <Calendar className="w-4 h-4 text-on-surface-variant" />
              <span className="text-xs font-semibold text-on-surface">Oct 12 - Oct 19, 2023</span>
            </div>
          </div>

          <button 
            onClick={() => alert("Current filters are up-to-date!")}
            className="w-full sm:w-auto bg-primary-container text-white px-5 py-2 rounded-lg text-xs font-bold tracking-wide uppercase transition-all hover:bg-slate-800 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
          <span className="text-xs font-semibold text-on-surface-variant">Total Occupancy</span>
          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl font-bold text-on-surface">84%</span>
            <span className="text-status-available text-[11px] font-bold bg-status-available/10 px-2.5 py-1 rounded-full">+2.4%</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
          <span className="text-xs font-semibold text-on-surface-variant">Arrivals Today</span>
          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl font-bold text-on-surface">12</span>
            <span className="text-on-surface-variant text-[11px] font-bold uppercase tracking-wider bg-surface-container-low px-2.5 py-1 rounded-full">Scheduled</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
          <span className="text-xs font-semibold text-on-surface-variant">Pending Confirmations</span>
          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl font-bold text-rose-600">08</span>
            <span className="text-rose-600 text-[11px] font-bold bg-rose-500/10 px-2.5 py-1 rounded-full uppercase tracking-wide">Requires Action</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
          <span className="text-xs font-semibold text-on-surface-variant">Weekly Revenue</span>
          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl font-bold text-on-surface">$24,500</span>
            <span className="text-status-available text-[11px] font-bold bg-status-available/10 px-2.5 py-1 rounded-full uppercase tracking-wide">On Track</span>
          </div>
        </div>
      </div>

      {/* Main reservation index Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
        {/* Search Input bar */}
        <div className="p-4 bg-surface-container-low/30 border-b border-outline-variant flex items-center justify-between">
          <input
            type="text"
            placeholder="Search guest registrations..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full max-w-xs bg-white border border-outline-variant rounded-lg px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-primary-container focus:border-primary-container"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#efedf0] border-b border-outline-variant">
              <tr>
                <th className="px-6 py-4 font-semibold text-on-surface-variant uppercase tracking-wider text-[11px]">Guest Name</th>
                <th className="px-6 py-4 font-semibold text-on-surface-variant uppercase tracking-wider text-[11px]">Room Type</th>
                <th className="px-6 py-4 font-semibold text-on-surface-variant uppercase tracking-wider text-[11px]">Dates</th>
                <th className="px-6 py-4 font-semibold text-on-surface-variant uppercase tracking-wider text-[11px]">Amount</th>
                <th className="px-6 py-4 font-semibold text-on-surface-variant uppercase tracking-wider text-[11px]">Status</th>
                <th className="px-6 py-4 font-semibold text-on-surface-variant uppercase tracking-wider text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60">
              {currentBookings.length > 0 ? (
                currentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-surface-container-low/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-[#081b3a] font-bold text-sm select-none">
                          {booking.guestInitials}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-xs text-on-surface leading-tight">{booking.guestName}</span>
                          <span className="text-[10px] text-on-surface-variant mt-0.5 uppercase tracking-wide font-medium">Ref: #{booking.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-on-surface leading-tight block">{booking.roomType}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 select-none">
                        <span className="text-[10px] font-bold text-on-surface uppercase">{booking.checkInDate}</span>
                        <ArrowRight className="w-3 h-3 text-outline" />
                        <span className="text-[10px] font-bold text-on-surface uppercase">{booking.checkOutDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-semibold text-on-surface">${booking.amount.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full font-semibold text-[10px] uppercase tracking-wider ${getBadgeClass(booking.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getBulletClass(booking.status)}`} />
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleUpdateStatus(booking)}
                          className="p-1.5 text-on-surface-variant hover:text-primary-container rounded transition-colors cursor-pointer"
                          title="Update Booking Status"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if(confirm(`Cancel reservation for ${booking.guestName}?`)) {
                              onCancelBooking(booking.id);
                            }
                          }}
                          className="p-1.5 text-on-surface-variant hover:text-error rounded transition-colors cursor-pointer"
                          title="Cancel Reservation"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-xs text-on-surface-variant">
                    No active bookings found matching search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="px-6 py-4 bg-[#efedf0]/40 flex justify-between items-center border-t border-outline-variant">
          <span className="text-xs text-on-surface-variant">
            Showing {firstIdx + 1} to {Math.min(lastIdx, filteredBookings.length)} of {filteredBookings.length} registrations
          </span>
          <div className="flex gap-1 select-none">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-outline-variant rounded bg-white text-on-surface disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3.5 py-1 border border-primary-container bg-primary-container text-white rounded text-xs font-semibold">
              {currentPage}
            </span>
            <span className="text-xs text-on-surface-variant font-medium px-1 self-center">
              of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-outline-variant rounded bg-white text-on-surface disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Contextual Modal for updating states (image 4 spec) */}
      {showStatusModal && selectedBooking && (
        <div className="fixed inset-0 bg-primary-container/40 backdrop-blur-sm z-[100] flex items-center justify-center p-8">
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-outline-variant"
          >
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50">
              <h3 className="text-base font-semibold text-on-surface">Update Status</h3>
              <button onClick={() => setShowStatusModal(false)} className="text-on-surface-variant hover:text-on-surface cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Update the reservation status for <span className="font-semibold text-on-surface">{selectedBooking.guestName}</span>.
              </p>
              
              <div className="grid grid-cols-2 gap-4 select-none">
                {/* Confirmed block */}
                <button 
                  onClick={() => saveSelectedBookingStatus('Confirmed')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedBooking.status === 'Confirmed'
                      ? 'border-[#006b5e] bg-[#006b5e]/5 text-[#006b5e]'
                      : 'border-outline-variant hover:border-[#006b5e]/60 text-on-surface-variant'
                  }`}
                >
                  <CheckCircle className="w-8 h-8 mb-2" />
                  <span className="text-xs font-semibold">Confirmed</span>
                </button>

                {/* Checked-in block */}
                <button 
                  onClick={() => saveSelectedBookingStatus('Checked-in')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedBooking.status === 'Checked-in'
                      ? 'border-[#081b3a] bg-[#081b3a]/5 text-[#081b3a]'
                      : 'border-outline-variant hover:border-[#081b3a]/60 text-on-surface-variant'
                  }`}
                >
                  <UserCheck className="w-8 h-8 mb-2" />
                  <span className="text-xs font-semibold">Checked-in</span>
                </button>

                {/* Checked-out block */}
                <button 
                  onClick={() => saveSelectedBookingStatus('Checked-out')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedBooking.status === 'Checked-out'
                      ? 'border-[#75859c] bg-[#75859c]/5 text-[#75859c]'
                      : 'border-outline-variant hover:border-[#75859c]/60 text-on-surface-variant'
                  }`}
                >
                  <LogOut className="w-8 h-8 mb-2" />
                  <span className="text-xs font-semibold">Checked-out</span>
                </button>

                {/* No Show block */}
                <button 
                  onClick={() => saveSelectedBookingStatus('No Show')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedBooking.status === 'No Show'
                      ? 'border-rose-500 bg-rose-50 text-rose-500'
                      : 'border-outline-variant hover:border-rose-500/60 text-on-surface-variant'
                  }`}
                >
                  <UserX className="w-8 h-8 mb-2" />
                  <span className="text-xs font-semibold">No Show</span>
                </button>
              </div>
            </div>

            <div className="p-6 bg-surface-container-low/40 border-t border-outline-variant flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 text-xs font-semibold tracking-wider text-on-surface-variant hover:text-on-surface uppercase cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
