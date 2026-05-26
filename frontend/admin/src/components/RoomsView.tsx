import React, { useState } from 'react';
import { Room, RoomType, RoomStatus } from '../types';
import { motion } from 'motion/react';
import { 
  Building,
  Diamond, 
  Gem,
  Crown,
  Bed,
  Layers,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  User,
  Sparkles,
  Wrench,
  X,
  History
} from 'lucide-react';

interface RoomsViewProps {
  rooms: Room[];
  onAddRoom: (room: Room) => void;
  onDeleteRoom: (id: string) => void;
  onModifyStatus: (id: string, status: RoomStatus) => void;
}

export default function RoomsView({ 
  rooms, 
  onAddRoom, 
  onDeleteRoom, 
  onModifyStatus 
}: RoomsViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoomId, setNewRoomId] = useState('');
  const [newRoomType, setNewRoomType] = useState<RoomType>('Standard');
  const [newRoomPrice, setNewRoomPrice] = useState('150');
  const [newRoomStatus, setNewRoomStatus] = useState<RoomStatus>('Available');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 5;

  // Compute live statistics based on state
  const totalRoomsCount = 110 + rooms.length;
  const occupiedCount = 80 + rooms.filter(r => r.status === 'Occupied').length;
  const maintenanceCount = rooms.filter(r => r.status === 'Maintenance').length;
  
  const sumPrices = rooms.reduce((sum, r) => sum + r.price, 0);
  const avgRevenue = (sumPrices / (rooms.length || 1)).toFixed(2);

  const handleCreateRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomId.trim()) return;

    if (rooms.some(r => r.id === newRoomId)) {
      alert(`Room ${newRoomId} already exists! Please use a unique number.`);
      return;
    }

    onAddRoom({
      id: newRoomId.trim(),
      type: newRoomType,
      price: parseFloat(newRoomPrice) || 0,
      status: newRoomStatus
    });

    // Reset Form
    setNewRoomId('');
    setNewRoomType('Standard');
    setNewRoomPrice('150');
    setNewRoomStatus('Available');
    setShowAddModal(false);
  };

  const getStatusStyle = (status: RoomStatus) => {
    switch (status) {
      case 'Available':
        return 'bg-status-available/10 text-status-available border border-status-available/20';
      case 'Occupied':
        return 'bg-status-occupied/10 text-status-occupied border border-status-occupied/20';
      case 'Cleaning':
        return 'bg-status-cleaning/10 text-status-cleaning border border-status-cleaning/20';
      case 'Maintenance':
        return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
      default:
        return 'bg-slate-100 text-slate-500';
    }
  };

  const getRoomIcon = (type: RoomType) => {
    switch (type) {
      case 'Suite':
        return <Gem className="w-4 h-4 text-[#006b5e]" />;
      case 'Executive':
        return <Crown className="w-4 h-4 text-amber-600" />;
      case 'Deluxe':
        return <Crown className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bed className="w-4 h-4 text-slate-500" />;
    }
  };

  const cycleStatus = (roomId: string, currentStatus: RoomStatus) => {
    const statuses: RoomStatus[] = ['Available', 'Occupied', 'Cleaning', 'Maintenance'];
    const nextIdx = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    onModifyStatus(roomId, statuses[nextIdx]);
  };

  // Filter & Pagination logic
  const filteredRooms = rooms.filter(room => 
    room.id.includes(searchQuery) ||
    room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const idxLast = currentPage * roomsPerPage;
  const idxFirst = idxLast - roomsPerPage;
  const currentRooms = filteredRooms.slice(idxFirst, idxLast);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage) || 1;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-10 font-sans"
    >
      {/* Top action layout */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-on-surface">Room Management</h2>
          <p className="text-sm text-on-surface-variant mt-1 leading-none">Manage and update hotel inventory in real-time.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary-container text-white px-5 py-3 rounded-lg flex items-center gap-2 text-xs font-semibold tracking-wider uppercase shadow-sm transition-all hover:bg-slate-800 hover:shadow active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Room
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        {/* Search inside table block header */}
        <div className="p-4 bg-surface-container-low/30 border-b border-outline-variant flex items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full max-w-xs bg-white border border-outline-variant rounded-lg px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-primary-container focus:border-primary-container"
          />
        </div>

        <table className="w-full text-left border-collapse">
          <thead className="bg-[#efedf0] border-b border-outline-variant">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Room Number</th>
              <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Price per Night</th>
              <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Availability Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            {currentRooms.length > 0 ? (
              currentRooms.map((room) => (
                <tr key={room.id} className="hover:bg-surface-container-low/20 transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-on-surface">{room.id}</td>
                  <td className="px-6 py-4 text-xs">
                    <div className="flex items-center gap-2 text-on-surface">
                      {getRoomIcon(room.type)}
                      <span>{room.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-on-surface">${room.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => cycleStatus(room.id, room.status)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:brightness-95 transition-all select-none ${getStatusStyle(room.status)}`}
                      title="Click to cycle status"
                    >
                      {room.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => cycleStatus(room.id, room.status)}
                        className="p-1 text-on-surface-variant hover:text-[#006b5e] cursor-pointer rounded" 
                        title="Change status"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => {
                          if(confirm(`Are you sure you want to delete room ${room.id}?`)) {
                            onDeleteRoom(room.id);
                          }
                        }}
                        className="p-1 text-on-surface-variant hover:text-error cursor-pointer rounded" 
                        title="Delete Room"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-xs text-on-surface-variant">
                  No rooms match your search query.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Table Footer / pagination */}
        <div className="px-6 py-4 bg-[#efedf0]/40 flex justify-between items-center border-t border-outline-variant">
          <p className="text-xs text-on-surface-variant">
            Showing {idxFirst + 1} to {Math.min(idxLast, filteredRooms.length)} of {filteredRooms.length} rooms
          </p>
          <div className="flex items-center gap-2 select-none">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 border border-outline-variant rounded bg-white text-on-surface disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 bg-primary-container text-white rounded text-xs font-semibold">
              {currentPage}
            </span>
            <span className="text-xs text-on-surface-variant font-medium px-1">
              of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 border border-outline-variant rounded bg-white text-on-surface disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bento Stats Area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">Total Rooms</p>
          <h3 className="text-2xl font-bold text-on-surface mt-2">{totalRoomsCount}</h3>
          <p className="text-status-available text-xs mt-2 font-semibold flex items-center gap-1">↑ 4% from last month</p>
        </div>

        <div className="p-6 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">Occupied</p>
          <h3 className="text-2xl font-bold text-on-surface mt-2">{occupiedCount}</h3>
          <div className="w-full bg-surface-container-high h-2 rounded-full mt-4">
            <div 
              className="bg-[#006b5e] h-2 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(100, (occupiedCount / totalRoomsCount) * 100)}%` }} 
            />
          </div>
        </div>

        <div className="p-6 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">Maintenance</p>
          <h3 className="text-2xl font-bold text-on-surface mt-2">{maintenanceCount}</h3>
          <p className="text-on-surface-variant text-xs mt-2">Scheduled today: {maintenanceCount}</p>
        </div>

        <div className="p-6 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] bg-status-available pointer-events-none" />
          <p className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">Avg. Price</p>
          <h3 className="text-2xl font-bold text-on-surface mt-2">${avgRevenue}</h3>
          <p className="text-status-available text-xs mt-2 font-semibold">★ Optimized rates</p>
        </div>
      </div>

      {/* Visual Inventory grid quick glance */}
      <div>
        <h3 className="text-base font-semibold text-on-surface mb-2">Visual Inventory Overview</h3>
        <p className="text-xs text-on-surface-variant mb-4 leading-none">Click any room node to live cycle through different statuses:</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
          {rooms.map((room) => {
            let statusIcon = <CheckCircle className="w-5 h-5 text-status-available" />;
            let borderClass = "border-status-available/30 hover:border-status-available";
            
            if (room.status === 'Occupied') {
              statusIcon = <User className="w-5 h-5 text-status-occupied" />;
              borderClass = "border-status-occupied/30 hover:border-status-occupied";
            } else if (room.status === 'Cleaning') {
              statusIcon = <Sparkles className="w-5 h-5 text-status-cleaning" />;
              borderClass = "border-status-cleaning/30 hover:border-status-cleaning";
            } else if (room.status === 'Maintenance') {
              statusIcon = <Wrench className="w-5 h-5 text-rose-500" />;
              borderClass = "border-rose-500/30 hover:border-rose-500";
            }

            return (
              <div 
                key={room.id}
                onClick={() => cycleStatus(room.id, room.status)}
                className={`p-4 bg-surface-container-lowest border ${borderClass} rounded-xl text-center cursor-pointer transition-all active:scale-95 select-none hover:shadow-sm`}
                title={`Room ${room.id} is ${room.status}. Click to cycle.`}
              >
                <span className="block font-mono text-xs font-bold text-on-surface mb-2 leading-none">
                  {room.id}
                </span>
                <div className="flex justify-center mt-1">
                  {statusIcon}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insert Modal / Collapsible Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 bg-primary-container/40 backdrop-blur-sm z-[100] flex items-center justify-center p-8">
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-outline-variant"
          >
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50">
              <h3 className="text-base font-semibold text-on-surface">Add New Room</h3>
              <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:text-on-surface cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateRoomSubmit}>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Room Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 104"
                    value={newRoomId}
                    onChange={(e) => setNewRoomId(e.target.value)}
                    className="w-full bg-white border border-outline-variant rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary-container focus:border-primary-container"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-medium">Room Type</label>
                  <select
                    value={newRoomType}
                    onChange={(e) => setNewRoomType(e.target.value as RoomType)}
                    className="w-full bg-white border border-outline-variant rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary-container text-on-surface"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Price per Night ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="150"
                    value={newRoomPrice}
                    onChange={(e) => setNewRoomPrice(e.target.value)}
                    className="w-full bg-white border border-outline-variant rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary-container focus:border-primary-container font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</label>
                  <select
                    value={newRoomStatus}
                    onChange={(e) => setNewRoomStatus(e.target.value as RoomStatus)}
                    className="w-full bg-white border border-outline-variant rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary-container text-on-surface"
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="p-6 bg-surface-container-low/40 border-t border-outline-variant flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold tracking-wider text-on-surface-variant hover:text-on-surface uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-primary-container text-white rounded-lg text-xs font-semibold tracking-wider uppercase shadow-sm cursor-pointer hover:bg-slate-800"
                >
                  Save Room
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
