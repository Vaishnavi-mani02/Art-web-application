
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Cosmic Dreamscape',
    description: 'A vibrant acrylic painting on a 24x36 inch canvas, depicting a swirling nebula in deep blues, purples, and pinks. Stars are highlighted with metallic silver paint.',
    price: 36000.00,
    category: 'Painting',
    imageUrl: 'https://picsum.photos/seed/cosmic/800/600',
    isSoldOut: false,
    reviews: [
      { id: 'r1', author: 'Jane Doe', rating: 5, comment: 'Absolutely breathtaking! The colors are even more vibrant in person.', createdAt: '2023-10-15' },
      { id: 'r2', author: 'John Smith', rating: 4, comment: 'A stunning piece, though it took a while to ship.', createdAt: '2023-10-20' },
    ],
  },
  {
    id: '2',
    name: 'Whispering Woods',
    description: 'An intricate pencil sketch of an ancient, mystical forest. The detail in the bark and leaves creates a sense of profound tranquility. 18x24 inch on archival paper.',
    price: 17600.00,
    category: 'Sketch',
    imageUrl: 'https://picsum.photos/seed/woods/800/600',
    isSoldOut: false,
    reviews: [
      { id: 'r3', author: 'Emily White', rating: 5, comment: 'The detail is incredible. It feels like you could step right into the forest.', createdAt: '2023-11-01' },
    ],
  },
  {
    id: '3',
    name: 'Ocean\'s Heart',
    description: 'A handmade ceramic vase glazed in deep ocean blues and greens, with a unique heart-shaped opening. Perfect for holding a single, precious flower. Approx. 8 inches tall.',
    price: 6800.00,
    category: 'Craft',
    imageUrl: 'https://picsum.photos/seed/ocean/800/600',
    isSoldOut: true,
    reviews: [],
  },
  {
    id: '4',
    name: 'City of Glass',
    description: 'An abstract painting using mixed media and resin to create a multi-layered, reflective cityscape. Dominated by cool blues and sharp, geometric lines. 30x30 inch canvas.',
    price: 52000.00,
    category: 'Painting',
    imageUrl: 'https://picsum.photos/seed/city/800/600',
    isSoldOut: false,
    reviews: [
      { id: 'r4', author: 'Mark Johnson', rating: 5, comment: 'A modern masterpiece. The centerpiece of my living room.', createdAt: '2023-09-05' },
    ],
  },
  {
    id: '5',
    name: 'Ephemeral Portrait',
    description: 'A delicate charcoal sketch capturing a fleeting expression. The use of light and shadow gives the subject an ethereal, ghost-like quality. 16x20 inch.',
    price: 14400.00,
    category: 'Sketch',
    imageUrl: 'https://picsum.photos/seed/portrait/800/600',
    isSoldOut: false,
    reviews: [],
  },
  {
    id: '6',
    name: 'Sunstone Amulet',
    description: 'A wire-wrapped sunstone pendant on a sterling silver chain. The stone is known for its properties of leadership and joy. A one-of-a-kind wearable art piece.',
    price: 9600.00,
    category: 'Craft',
    imageUrl: 'https://picsum.photos/seed/sunstone/800/600',
    isSoldOut: false,
    reviews: [
      { id: 'r5', author: 'Sarah Lee', rating: 5, comment: 'Beautifully crafted and has such a wonderful energy!', createdAt: '2023-11-10' },
    ],
  },
  {
    id: '7',
    name: 'Stellar Keychain',
    description: 'A miniature hand-painted nebula encased in a durable resin keychain. Each piece is unique and features a tiny, glowing star in the center.',
    price: 2000.00,
    category: 'Keychain',
    imageUrl: 'https://picsum.photos/seed/keychain/800/600',
    isSoldOut: false,
    reviews: [
      { id: 'r6', author: 'Alice Cooper', rating: 5, comment: 'So cute and well-made! I love carrying a piece of the galaxy with me.', createdAt: '2023-12-01' },
    ],
  },
];

export const SHIPPING_COST = 1200.00;
export const COLLECTOR_DISCOUNT_PERCENTAGE = 10;
