
export enum Category {
  MEDITATION_BEADS = 'Meditation Beads',
  INCENSE = 'Incense',
  CANDLES = 'Candles',
  COMBS = 'Wooden Combs',
  GIFT_SETS = 'Gift Sets',
  ACCESSORIES = 'Accessories'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  description: string;
  imageUrl: string;
  benefits: string; // TCM benefits
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
}
