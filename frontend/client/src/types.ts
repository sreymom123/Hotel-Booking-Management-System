export interface Room {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  location: string;
  capacity: string;
  bedType: string;
  size: string;
  rating: number;
  amenities: string[];
  available: boolean;
  tag?: string;
  statusText?: string;
}

export interface Booking {
  id: string;
  room: Room;
  checkIn: string;
  checkOut: string;
  days: number;
  guests: string;
  totalPrice: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  paymentMethod: 'ONLINE' | 'PROPERTY';
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  specialRequests?: string;
}

export interface RecommendedStay {
  id: string;
  name: string;
  image: string;
  location: string;
  rating: number;
  price: number;
  nightsText: string;
}
