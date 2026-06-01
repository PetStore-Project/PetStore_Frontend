export type MenuCategory = 'Appetizer' | 'Main' | 'Dessert' | 'Drink'

export interface MenuItem {
  id: string
  name: string
  price: number
  description: string
  category: MenuCategory
  rating: number
  prepTime: string
  image: string
  stockQuantity?: number
  _id?: string
}

export const menuItems: MenuItem[] = [
  {
    id: 'menu-1',
    name: 'Truffle Margherita Pizza',
    price: 14.9,
    description: 'Wood-fired pizza with San Marzano tomato, basil, mozzarella, and truffle oil.',
    category: 'Main',
    rating: 4.8,
    prepTime: '18 min',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 40,
  },
  {
    id: 'menu-2',
    name: 'Umami Sushi Set',
    price: 22.5,
    description: 'Chef-selected nigiri and maki with premium salmon, tuna, and avocado.',
    category: 'Main',
    rating: 4.9,
    prepTime: '22 min',
    image:
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 32,
  },
  {
    id: 'menu-3',
    name: 'Smoky Angus Burger',
    price: 13.4,
    description: 'Grilled Angus beef, smoked cheddar, caramelized onion, and house aioli.',
    category: 'Main',
    rating: 4.7,
    prepTime: '16 min',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 35,
  },
  {
    id: 'menu-4',
    name: 'Roasted Pumpkin Soup',
    price: 8.2,
    description: 'Silky roasted pumpkin soup with toasted seeds and chili-infused cream.',
    category: 'Appetizer',
    rating: 4.6,
    prepTime: '12 min',
    image:
      'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 45,
  },
  {
    id: 'menu-5',
    name: 'Korean Crispy Wings',
    price: 10.8,
    description: 'Double-fried chicken wings glazed with spicy gochujang and sesame.',
    category: 'Appetizer',
    rating: 4.8,
    prepTime: '14 min',
    image:
      'https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 38,
  },
  {
    id: 'menu-6',
    name: 'Citrus Caesar Salad',
    price: 9.5,
    description: 'Crisp romaine, parmesan shards, sourdough croutons, and lemon Caesar dressing.',
    category: 'Appetizer',
    rating: 4.5,
    prepTime: '10 min',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 50,
  },
  {
    id: 'menu-7',
    name: 'Chocolate Lava Cake',
    price: 7.9,
    description: 'Warm molten chocolate cake served with vanilla bean gelato.',
    category: 'Dessert',
    rating: 4.9,
    prepTime: '11 min',
    image:
      'https://images.unsplash.com/photo-1563805042249-0d3ab173bb89?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 28,
  },
  {
    id: 'menu-8',
    name: 'New York Cheesecake',
    price: 7.4,
    description: 'Classic baked cheesecake with berry compote and almond crumble.',
    category: 'Dessert',
    rating: 4.7,
    prepTime: '9 min',
    image:
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 30,
  },
  {
    id: 'menu-9',
    name: 'Sparkling Citrus Cooler',
    price: 5.2,
    description: 'Fresh orange and lime, sparkling water, and mint over crushed ice.',
    category: 'Drink',
    rating: 4.4,
    prepTime: '5 min',
    image:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 80,
  },
  {
    id: 'menu-10',
    name: 'Matcha Latte Deluxe',
    price: 6.1,
    description: 'Ceremonial-grade matcha, steamed milk, and a touch of vanilla.',
    category: 'Drink',
    rating: 4.6,
    prepTime: '6 min',
    image:
      'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 60,
  },
]
