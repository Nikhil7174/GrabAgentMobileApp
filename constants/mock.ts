// Simple mock data to drive the UI only
export type Restaurant = {
  id: string;
  name: string;
  rating: number;
  reviews: string;
  price: number; // 1-4
  tags: string[];
  fee: string; // e.g. "Free" or "RM2.90"
  eta: string; // e.g. "From 20 mins"
  distance: string; // e.g. "2.9 km"
  image: string; // remote image for simplicity
};

export const restaurants: Restaurant[] = [
  {
    id: 'mcd',
    name: "McDonald's®",
    rating: 4.4,
    reviews: '7K+',
    price: 2,
    tags: ['Halal', 'Fast Food'],
    fee: 'Free',
    eta: 'From 20 mins',
    distance: '2.9 km',
    image:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=60&auto=format&fit=crop',
  },
  {
    id: 'maya',
    name: 'Maya Mantras Melaka - Duyong',
    rating: 3.8,
    reviews: '154',
    price: 3,
    tags: ['Indian'],
    fee: 'RM1.30',
    eta: 'From 45 mins',
    distance: '3.5 km',
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=60&auto=format&fit=crop',
  },
  {
    id: 'dominos',
    name: "Domino's Pizza - Merdeka Permai",
    rating: 4.7,
    reviews: '3K+',
    price: 2,
    tags: ['Halal', 'Fast Food'],
    fee: 'RM2.90',
    eta: '30 mins',
    distance: '4.0 km',
    image:
      'https://images.unsplash.com/photo-1613564834361-9436948817d1?q=80&w=743&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

export const yellowPromoItems = [
  {
    id: 'honey-chicken',
    title: 'Honey\nChicken 蜜汁',
    price: '8.80',
    image:
      'https://media.istockphoto.com/id/1345624336/photo/chicken-biriyani.webp?a=1&b=1&s=612x612&w=0&k=20&c=a8j_p9BkWtsSX7WkcqeetigH8PYWXGayIGto9GiehNY=',
  },
  {
    id: 'jus-oren',
    title: 'Jus Oren',
    price: '6.00',
    image:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=60&auto=format&fit=crop',
  },
  {
    id: 'roti-john',
    title: 'Roti John\nAyam',
    price: '9.70',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=60&auto=format&fit=crop',
  },
];

export const SPILLAGE_TRIGGER = 'the package i recieved had spillage issue';

export const THINKING_SETS = {
  entry: [
    { tool: 'initiate_mediation_flow()', text: 'Detected damage report; opening mediation case' },
    { tool: 'collect_evidence()', text: 'Requesting photos to assess severity' }
  ],
  firstPhoto: [
    { tool: 'collect_photos()', text: 'Photo received; extracting spill cues' },
    { tool: 'analyze_evidence()', text: 'Low coverage of spill area; confidence 0.64' }
  ],
  secondPhoto: [
    { tool: 'collect_photos()', text: 'Additional angle received; stitching views' },
    { tool: 'analyze_evidence()', text: 'Spill and soaked packaging visible; confidence 0.86' }
  ],
  verdict: [
    { tool: 'analyze_evidence()', text: 'Aggregate signals exceed major-spill threshold' },
    { tool: 'issue_instant_refund()', text: 'Issuing immediate refund to original payment method' },
    { tool: 'log_merchant_packaging_feedback()', text: 'Sending detailed packaging feedback to merchant' }
  ],
};

export const QUESTIONNAIRE = [
  'Q1 • Was the outer seal/tamper tape intact?',
  'Q2 • Any missing items or labels soaked/wet?',
  'Q3 • About what time did you receive the order?'
];

export const MOCK_REFUND = {
  amount: 120.0,
  currency: 'INR',
  id: 'RFND-MOCK-87231',
  receipt:
    'Refund initiated: ₹120.00\nRef: RFND-MOCK-87231\nMethod: Original payment\nETA: 3–5 business days\nWe have also notified the merchant with packaging QA details.'
};
