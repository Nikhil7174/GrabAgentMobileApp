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
      'https://images.unsplash.com/photo-1548365328-9f547fb0953b?w=800&q=60&auto=format&fit=crop',
  },
];

export const yellowPromoItems = [
  {
    id: 'honey-chicken',
    title: 'Honey\nChicken 蜜汁',
    price: '8.80',
    image:
      'https://images.unsplash.com/photo-1604908554049-9109f1d2ac69?w=800&q=60&auto=format&fit=crop',
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

