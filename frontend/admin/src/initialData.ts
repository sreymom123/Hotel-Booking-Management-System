import { Room, Booking, UserProfile } from './types';

export const INITIAL_ROOMS: Room[] = [
  { id: '101', type: 'Suite', price: 450.00, status: 'Available' },
  { id: '102', type: 'Suite', price: 450.00, status: 'Available' },
  { id: '103', type: 'Suite', price: 450.00, status: 'Available' },
  { id: '204', type: 'Deluxe', price: 280.00, status: 'Occupied' },
  { id: '305', type: 'Standard', price: 150.00, status: 'Cleaning' },
  { id: '401', type: 'Deluxe', price: 300.00, status: 'Available' },
  { id: '105', type: 'Standard', price: 150.00, status: 'Occupied' },
  { id: '106', type: 'Executive', price: 600.00, status: 'Available' },
  { id: '201', type: 'Standard', price: 150.00, status: 'Maintenance' },
  { id: '202', type: 'Deluxe', price: 280.00, status: 'Occupied' },
  { id: '205', type: 'Standard', price: 150.00, status: 'Occupied' },
  { id: '301', type: 'Suite', price: 450.00, status: 'Cleaning' },
  { id: '402', type: 'Deluxe', price: 280.00, status: 'Occupied' },
  { id: '901', type: 'Executive', price: 750.00, status: 'Maintenance' },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'GH-99210',
    guestName: 'Eleanor Mitchell',
    guestInitials: 'EM',
    roomType: 'Deluxe King (Suite 402)',
    roomNumberOrSuite: '402',
    checkInDate: 'Oct 14',
    checkOutDate: 'Oct 19',
    amount: 1250.00,
    status: 'Confirmed'
  },
  {
    id: 'GH-99215',
    guestName: 'Julian Waters',
    guestInitials: 'JW',
    roomType: 'Ocean View Single (Room 205)',
    roomNumberOrSuite: '205',
    checkInDate: 'Oct 12',
    checkOutDate: 'Oct 16',
    amount: 890.00,
    status: 'Checked-in'
  },
  {
    id: 'GH-99222',
    guestName: 'Sarah Hughes',
    guestInitials: 'SH',
    roomType: 'Penthouse (Suite 901)',
    roomNumberOrSuite: '901',
    checkInDate: 'Oct 20',
    checkOutDate: 'Oct 25',
    amount: 4500.00,
    status: 'Pending'
  },
  {
    id: 'GH-99228',
    guestName: 'Robert Blake',
    guestInitials: 'RB',
    roomType: 'Standard Double (Room 112)',
    roomNumberOrSuite: '112',
    checkInDate: 'Oct 15',
    checkOutDate: 'Oct 17',
    amount: 420.00,
    status: 'Confirmed'
  },
  {
    id: 'BK-9021',
    guestName: 'Julianne Moore',
    guestInitials: 'JM',
    roomType: 'Deluxe (Room 402)',
    roomNumberOrSuite: '402',
    checkInDate: 'Jun 14',
    checkOutDate: 'Jun 19',
    amount: 1400.00,
    status: 'Confirmed'
  },
  {
    id: 'BK-9025',
    guestName: 'Robert King',
    guestInitials: 'RK',
    roomType: 'Standard (Room 105)',
    roomNumberOrSuite: '105',
    checkInDate: 'Jun 15',
    checkOutDate: 'Jun 18',
    amount: 450.00,
    status: 'Checked-in'
  },
  {
    id: 'BK-9102',
    guestName: 'Amelia Smith',
    guestInitials: 'AS',
    roomType: 'Executive Suite 21',
    roomNumberOrSuite: 'Suite 21',
    checkInDate: 'Jun 16',
    checkOutDate: 'Jun 22',
    amount: 3600.00,
    status: 'Pending'
  },
  {
    id: 'BK-9140',
    guestName: 'David Tench',
    guestInitials: 'DT',
    roomType: 'Deluxe (Room 308)',
    roomNumberOrSuite: '308',
    checkInDate: 'Jun 16',
    checkOutDate: 'Jun 20',
    amount: 1120.00,
    status: 'Confirmed'
  }
];

export const PROFILES: UserProfile[] = [
  {
    name: 'Hotel Administrator',
    email: 'admin@grandhorizon.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCn2ZcO8B3RrSWSnsHrngGSb2bX1Nk9LIdSPYRJrjBqDoTsI39IKYTnm0GocBpk658_r_UzIbYRmPu4cO40t_1sM2GOAmrz9jn6elTRgIlV1TNXwl2Khs-PaO-3k9oqF6-Y7xPd9ETk-pY2KhfoE1Ey4fZB3-awcn4-FB8O_2gPXYBxx4JnzzyLf4xmLLM-1Poq9HWHX4u0OjeJOSRkZ1b7jEM2JnOcTKZ8UxlgERYj-ZJBuHdfkhkJHgU7nXDN78yFhe4WezxQnjc',
    role: 'Admin'
  }
];
