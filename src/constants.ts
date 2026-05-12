import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Classic White Formal",
    price: 1450,
    category: "Formal",
    image: "https://images.unsplash.com/flagged/photo-1577996693134-e50d294a665f?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "A crisp, high-thread-count white cotton shirt. Essential for every professional wardrobe."
  },
  {
    id: 2,
    name: "Sky Blue Executive",
    price: 1550,
    category: "Formal",
    image: "https://images.unsplash.com/photo-1625585445301-676203ae67fc?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Sophisticated sky blue formal shirt with a premium finish and comfortable fit."
  },
  {
    id: 3,
    name: "Midnight Black Party",
    price: 1850,
    category: "Party Wear",
    image: "https://images.unsplash.com/photo-1641380848962-807139c82b92?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Elegant slim-fit black shirt crafted for evening events and celebrations."
  },
  {
    id: 4,
    name: "Casual Indigo Denim",
    price: 1650,
    category: "Casual",
    image: "https://plus.unsplash.com/premium_photo-1727942991384-b761a3343c00?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Classic indigo denim shirt, pre-washed for extra softness and a rugged look."
  },
  {
    id: 5,
    name: "Burgundy Evening Wear",
    price: 1950,
    category: "Party Wear",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80&cb=20240412_5",
    description: "Rich burgundy shirt with a subtle sheen, perfect for making a statement at parties."
  },
  {
    id: 6,
    name: "Olive Green Casual",
    price: 1350,
    category: "Casual",
    image: "https://plus.unsplash.com/premium_photo-1683121648753-66f3803fe13c?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Versatile olive green cotton shirt, ideal for relaxed weekend outings."
  },
  {
    id: 8,
    name: "Charcoal Grey Casual",
    price: 1400,
    category: "Casual",
    image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80&cb=20240412_7",
    description: "Modern charcoal grey shirt in a breathable fabric for all-day comfort."
  },
  {
    id: 7,
    name: "Navy Blue Pinstripe",
    price: 1750,
    category: "Formal",
    image: "https://plus.unsplash.com/premium_photo-1682431729468-7962d57bc0bf?q=80&w=881&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Professional navy blue shirt with subtle pinstripes for a sharp corporate look."
  }
];

export const CATEGORIES = ["All", "Formal", "Casual", "Party Wear"];
