import { Room, RecommendedStay, Booking } from './types';

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'grand-executive',
    name: 'Grand Executive Suite',
    price: 640,
    originalPrice: 850,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcojHbyPKEzgolNxpZ-saGMxRcjCYIiJt28fTQTUZKe1qYneUj_E9uknS1PiCdCIu3R1LJUT1tLmLpY76s_zHfy6zxIb320KbUlX7MgNZEtwkXvtkUTRPGVAJQq8sRvcNGsDxYCzawOPmYr-RynxTkMnTiQGfzKLCLYXkhkVPhL_uIoHjyMRfO_9dyz6Wa4y8tIP8KQMWVOgumeGZlxPAJuki_wMKTftZuPi-qrI0uTNF8afFSwhJqC-HSMtz6lDdUdzdhrEEYVu8',
    location: 'Main Tower, 24th Floor',
    capacity: '2 Adults, 1 Child',
    bedType: 'King Size',
    size: '850 sq ft',
    rating: 4.9,
    amenities: ['Gigabit WiFi', 'Climate Control', 'Mini Bar', 'Smart TV', 'Nespresso Machine', 'Work Desk'],
    available: true,
    tag: 'Featured Premium',
    statusText: 'Available'
  },
  {
    id: 'deluxe-twin',
    name: 'Deluxe Twin Room',
    price: 320,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKJb3HgSLZsZQHlCRjZTWQ_4RGIaaccjThN3HIDu17LjietJth_GJH3K55ABvYdjr78pDC9ElitME07D2VpeRigT0WBYscs0qOsfv96shHR9KDuuuSON0snaZY96IOu5OtJxumEePgm7klOxHayEBObmuMXrMZukhpA2WwvYrpStMl-8sglSFxIKgIwwET68Yrr2c-lrIgBYenaqLy0QBokjSVdP7-vcazkOyJGlOzmI55O047fHKgbwMPl5Sww_VgFnWBEkRk77s',
    location: 'North Wing, 14th Floor • City View',
    capacity: '2 Guests',
    bedType: 'Twin Beds',
    size: '450 sq ft',
    rating: 4.8,
    amenities: ['High-speed WiFi', 'Climate Control', 'Smart TV', 'Premium Linens', 'Work Desk'],
    available: true,
    statusText: 'Available'
  },
  {
    id: 'superior-king',
    name: 'Superior King Room',
    price: 410,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQYbrc7vQpQA0A07-cDyzUHfiMUM1_HUSjcKz79tvE_4xT5m22R18DSbT6jPJisqY8w_aaTsUv0d0hCS1CxsrA839IKEQ-2CXXbt7G1tBdQG52FOYnOLyw-jDISoomSMhKrSml7-7hWUQH62TNFF393cUIq5-nAZGi6uLP9-4ctecManMwbzx7CoNWeNnGCUwhx2H_Ld0yd44_fg_33igHs0cmM1qzJrEjlR09MfqWrGQASjQVTSK2JpN7gd9CRjNNpO8j0eEGeLg',
    location: 'Main Tower, 12th Floor • Skyline View',
    capacity: '2 Adults',
    bedType: 'King Size',
    size: '600 sq ft',
    rating: 4.5,
    amenities: ['High-speed WiFi', 'Climate Control', 'Nespresso Machine', 'Work Desk'],
    available: true,
    statusText: 'Available'
  },
  {
    id: 'standard-double',
    name: 'Standard Double Room',
    price: 280,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCelkN43xswp25ePLkReKsZE-QP07tXB-W1GbYGtgSLeABG5HSrtwghVWjAlmHta9GVU7B9b2GLp39GgL29x4O9j0puuwQbI7bFAgZm2Qtu3ylf810mbXn2xuxsH62Rah7-oGdVrSps0aORfiva7orWCQW9C8v6YXN8-u98fflkt6Xd3JlqObPWYXIly0IXxcnBJZGSHv2d-mlb-adn7qQKSsuUl-phqRw8XIF-yIPVddo7pfAlm4CwFwdRR75ZGMHdEEY5YfgdbIQ',
    location: 'East Wing, 8th Floor • Courtyard View',
    capacity: '2 Guests',
    bedType: 'Double Bed',
    size: '400 sq ft',
    rating: 4.2,
    amenities: ['High-speed WiFi', 'Coffee Maker', 'Premium Linens'],
    available: true,
    tag: 'Last 2 Left',
    statusText: 'Last 2 Left'
  }
];

export const RECOMMENDED_STAYS: RecommendedStay[] = [
  {
    id: 'rec-1',
    name: 'Azure Bay Resort',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyGSrdSXUdFN8EwjijzAP2teO8uDnBbAt7eY1W32OyiCZRAotoSywr_TkSo89W6BjT1UdanEKMlq2-TW-GKg0N_cDQfZlnQKjnF3sMRUVTU3Swu21j4w0DF22tPzPMygHgqzUmZiB4-hlgMttxCAguSWECLv3druTiroFyrtxAGNJ4W349fTk5ex9TBWqchygf6pfE1a-d50PgVRMvB7Qq5ttHIua6SPsHmbh_HXe09VGrX-ufYjVetox8euAXk3ERMBZeMmemkAU',
    location: 'Amalfi Coast, Italy',
    rating: 4.9,
    price: 1240,
    nightsText: '5 Nights'
  },
  {
    id: 'rec-2',
    name: 'Skyline Executive Hotel',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmxHoyUQCn9CgbD6gd1mMxMxyV5kHXEeTTfWy0fbXx_EOVa96lLQSziDGcyYAOw4raT5h_gLCz2qT_RQ19JxC8o5hsvSbOZA1gBs8O-tnSu7PsEdWLmuarS1LYZXOR8RwzZSlBmVTSBCmkp-_lAMc61SOTO75VgqYw1IZtkEE1Qg-kzLJnepCiJXMS41RWSouQQsuVGqRqgub5N1HdGmQLAT7Fi0wNUcFff4lLMUiGhH8j2Z-GwO3CiEOz6dtFlhYPwd23KvfBBaY',
    location: 'Shinjuku, Tokyo',
    rating: 4.7,
    price: 890,
    nightsText: '3 Nights'
  },
  {
    id: 'rec-3',
    name: 'The Heritage Manor',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsd-ZwL0i72ysY9_ymxlsAXWMgFBnJIJIB5Lw6Bfkd69L7NZh_cuAnWfTopTdzbJ23tR_FdDu12nAlMUzMrLBGG6Bss62kfCNdtKxRUMviZg3qtTQLkEDmSTaPS_EOyVjLKDrhER4kY94RK3_yej_H73lbDupo7rMfdOt-dERVaH19ZKyZghCPwqyNKuWKmFeYFx4rdhKeKY_Q5z4UIwMZU2OxSDAqJE3eT2hAzoIM8uqGWxpn-0l5IdBhcW-TsOmIHcmxuDc1RHY',
    location: 'Cotswolds, UK',
    rating: 5.0,
    price: 650,
    nightsText: '2 Nights'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'NX-882910',
    room: INITIAL_ROOMS[1] || INITIAL_ROOMS[0], // Deluxe Twin Room
    checkIn: '2026-10-12',
    checkOut: '2026-10-15',
    days: 3,
    guests: '2 Adults',
    totalPrice: 873.60,
    status: 'CONFIRMED',
    paymentMethod: 'ONLINE',
    guestInfo: {
      firstName: 'Alexander',
      lastName: 'Wright',
      email: 'alexander.wright@luxury.com',
      phone: '+1 (555) 789-1102'
    },
    specialRequests: 'A high-floor room was requested and confirmed.'
  }
];
