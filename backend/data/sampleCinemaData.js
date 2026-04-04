/**
 * Sample Cinema Data for Recommendation System Testing
 * This data structure shows all fields needed for the recommendation engine
 */

const sampleCinemas = [
  {
    id: 'qfx-jai-nepal',
    name: 'QFX Jai Nepal',
    location: 'Chabahil, Kathmandu',
    type: 'premium',
    pricing: {
      basePrice: 550,
      weekendPrice: 650,
      premiumSeatSurcharge: 100
    },
    discounts: ['monday', 'tuesday', 'wednesday'],
    membershipBenefits: {
      silver: 10,
      gold: 15,
      platinum: 20
    },
    earlyBirdDiscount: 15, // 15% off for bookings 3+ days in advance
    activePromotions: [
      {
        name: 'New Year Special',
        type: 'percentage',
        value: 20,
        startDate: '2024-01-01',
        endDate: '2024-01-31'
      }
    ],
    foodOffers: [
      {
        active: true,
        type: 'free_item',
        item: 'Popcorn',
        value: 150,
        description: 'Free medium popcorn with every ticket'
      },
      {
        active: true,
        type: 'combo_discount',
        name: 'Combo Deal',
        discount: 100,
        description: 'Rs. 100 off on combo meals'
      }
    ],
    features: ['IMAX', 'Dolby Atmos', 'Recliner Seats', 'Premium Parking', 'VIP Lounge'],
    rating: 4.5,
    totalReviews: 1250
  },
  {
    id: 'fcube-labim',
    name: 'FCube Labim Mall',
    location: 'Lalitpur, Pulchowk',
    type: 'modern',
    pricing: {
      basePrice: 450,
      weekendPrice: 550,
      premiumSeatSurcharge: 80
    },
    discounts: ['tuesday', 'thursday', 'saturday'],
    membershipBenefits: {
      silver: 12,
      gold: 18,
      platinum: 25
    },
    earlyBirdDiscount: 10,
    activePromotions: [
      {
        name: 'Student Special',
        type: 'fixed',
        value: 100,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        requiresStudent: true
      },
      {
        name: 'BOGO Friday',
        type: 'bogo',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        applicableDays: ['friday']
      }
    ],
    foodOffers: [
      {
        active: true,
        type: 'percentage_off',
        percentage: 25,
        description: '25% off all food & beverages'
      }
    ],
    features: ['4DX', 'Dolby Atmos', 'Online Food Order', 'Premium Parking'],
    rating: 4.3,
    totalReviews: 890
  },
  {
    id: 'big-movies-civil',
    name: 'Big Movies Civil Mall',
    location: 'Sundhara, Kathmandu',
    type: 'standard',
    pricing: {
      basePrice: 350,
      weekendPrice: 400,
      premiumSeatSurcharge: 50
    },
    discounts: ['monday', 'wednesday', 'friday'],
    membershipBenefits: {
      silver: 8,
      gold: 12,
      platinum: 15
    },
    earlyBirdDiscount: 12,
    activePromotions: [
      {
        name: 'Family Pack',
        type: 'percentage',
        value: 30,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        minTickets: 4
      }
    ],
    foodOffers: [
      {
        active: true,
        type: 'free_item',
        item: 'Soft Drink',
        value: 80,
        description: 'Free soft drink with every ticket'
      }
    ],
    features: ['Standard Seating', 'Surround Sound'],
    rating: 4.0,
    totalReviews: 650
  },
  {
    id: 'qfx-civil-mall',
    name: 'QFX Civil Mall',
    location: 'Sundhara, Kathmandu',
    type: 'premium',
    pricing: {
      basePrice: 600,
      weekendPrice: 700,
      premiumSeatSurcharge: 120
    },
    discounts: ['tuesday', 'thursday'],
    membershipBenefits: {
      silver: 10,
      gold: 15,
      platinum: 22
    },
    earlyBirdDiscount: 18,
    activePromotions: [],
    foodOffers: [
      {
        active: true,
        type: 'combo_discount',
        name: 'Premium Combo',
        discount: 150,
        description: 'Rs. 150 off on premium combos'
      }
    ],
    features: ['IMAX', 'Dolby Atmos', 'Recliner Seats', 'VIP Lounge', 'Online Food Order'],
    rating: 4.6,
    totalReviews: 1450
  },
  {
    id: 'inox-city-centre',
    name: 'INOX City Centre',
    location: 'Kamalpokhari, Kathmandu',
    type: 'luxury',
    pricing: {
      basePrice: 750,
      weekendPrice: 900,
      premiumSeatSurcharge: 150
    },
    discounts: ['monday'],
    membershipBenefits: {
      silver: 8,
      gold: 12,
      platinum: 18
    },
    earlyBirdDiscount: 20,
    activePromotions: [
      {
        name: 'Luxury Experience',
        type: 'percentage',
        value: 15,
        startDate: '2024-01-01',
        endDate: '2024-03-31'
      }
    ],
    foodOffers: [
      {
        active: true,
        type: 'free_item',
        item: 'Gourmet Snack Box',
        value: 300,
        description: 'Complimentary gourmet snack box'
      }
    ],
    features: ['IMAX', 'Dolby Atmos', '4DX', 'Recliner Seats', 'VIP Lounge', 'Premium Parking', 'Butler Service'],
    rating: 4.8,
    totalReviews: 980
  }
];

// Sample user contexts for testing
const sampleUserContexts = {
  regularUser: {
    userId: 'user123',
    isStudent: false,
    gender: 'male',
    membership: null,
    favoriteCinemas: [],
    bookingHistory: [],
    preferences: {
      cinemaType: 'standard',
      priceRange: 'affordable'
    }
  },
  studentUser: {
    userId: 'student456',
    isStudent: true,
    gender: 'female',
    membership: 'silver',
    favoriteCinemas: ['fcube-labim'],
    bookingHistory: [
      { cinemaId: 'fcube-labim', date: '2024-01-01' },
      { cinemaId: 'fcube-labim', date: '2024-01-15' }
    ],
    preferences: {
      cinemaType: 'modern',
      priceRange: 'budget'
    }
  },
  premiumUser: {
    userId: 'premium789',
    isStudent: false,
    gender: 'male',
    membership: 'platinum',
    favoriteCinemas: ['qfx-jai-nepal', 'inox-city-centre'],
    bookingHistory: [
      { cinemaId: 'qfx-jai-nepal', date: '2024-01-05' },
      { cinemaId: 'qfx-jai-nepal', date: '2024-01-12' },
      { cinemaId: 'qfx-jai-nepal', date: '2024-01-20' },
      { cinemaId: 'inox-city-centre', date: '2024-01-25' },
      { cinemaId: 'qfx-jai-nepal', date: '2024-02-01' },
      { cinemaId: 'qfx-jai-nepal', date: '2024-02-10' }
    ],
    preferences: {
      cinemaType: 'premium',
      priceRange: 'luxury'
    }
  },
  familyUser: {
    userId: 'family321',
    isStudent: false,
    gender: 'female',
    membership: 'gold',
    favoriteCinemas: ['big-movies-civil'],
    bookingHistory: [
      { cinemaId: 'big-movies-civil', date: '2024-01-08', seats: 4 },
      { cinemaId: 'big-movies-civil', date: '2024-01-22', seats: 5 }
    ],
    preferences: {
      cinemaType: 'standard',
      priceRange: 'budget',
      prefersFamilyDeals: true
    }
  }
};

// Sample booking contexts
const sampleBookingContexts = {
  singleTicket: {
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    time: '18:00',
    seats: 1,
    movie: 'Avengers: Endgame'
  },
  coupleTickets: {
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    time: '20:00',
    seats: 2,
    movie: 'Inception'
  },
  familyTickets: {
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now (Saturday)
    time: '15:00',
    seats: 4,
    movie: 'The Lion King'
  },
  groupTickets: {
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
    time: '21:00',
    seats: 6,
    movie: 'Spider-Man: No Way Home'
  }
};

export default {
  sampleCinemas,
  sampleUserContexts,
  sampleBookingContexts
};
