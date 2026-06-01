import React, { useState, useEffect } from 'react';
import { roomService } from '../../services/roomService';

interface Room {
  id: number;
  room_number: string;
  room_type: string;
  name: string;
  floor_number: number;
  location: string | null;
  capacity: number;
  price: number;
  description: string | null;
  image_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ room_type?: string; status?: string }>({});

  useEffect(() => {
    fetchRooms();
  }, [filters]);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await roomService.getRooms(filters);
      if (response.success) {
        setRooms(response.data);
      } else {
        setError(response.message || 'Failed to fetch rooms');
      }
    } catch (err) {
      setError('An error occurred while fetching rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  if (loading) return <div>Loading rooms...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Room Management</h1>
      <div className="filters">
        <label>
          Room Type:
          <select name="room_type" onChange={handleFilterChange}>
            <option value="">All Types</option>
            <option value="Suite">Suite</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Standard">Standard</option>
            <option value="Executive">Executive</option>
          </select>
        </label>
        <label>
          Status:
          <select name="status" onChange={handleFilterChange}>
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </label>
      </div>
      <div className="room-list">
        {rooms.map(room => (
          <div key={room.id} className="room-card">
            <h2>{room.name}</h2>
            <p><strong>Room Number:</strong> {room.room_number}</p>
            <p><strong>Type:</strong> {room.room_type}</p>
            <p><strong>Status:</strong> {room.status}</p>
            <p><strong>Floor:</strong> {room.floor_number}</p>
            <p><strong>Capacity:</strong> {room.capacity} guests</p>
            <p><strong>Price:</strong> ${room.price}/night</p>
            {room.description && <p><strong>Description:</strong> {room.description}</p>}
            {room.location && <p><strong>Location:</strong> {room.location}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;