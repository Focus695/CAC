
import { Product, Category, TeamMember } from './types';

export const PRODUCTS: Product[] = [
  // Meditation Beads Collection
  {
    id: '1',
    name: 'Sandalwood Meditation Beads',
    price: 128,
    category: Category.MEDITATION_BEADS,
    description: 'Hand-strung sandalwood beads sourced from sustainable forests. Each bead carries the warm, grounding aroma of aged sandalwood, perfect for meditation and mindfulness practice.',
    benefits: 'Calming, grounding, promotes focus',
    imageUrl: 'https://picsum.photos/id/110/600/600'
  },
  {
    id: '101',
    name: 'Rosewood Mala Bracelet',
    price: 85,
    category: Category.MEDITATION_BEADS,
    description: 'Elegant rosewood mala bracelet featuring 108 hand-polished beads. Traditional craftsmanship meets modern design for everyday mindfulness.',
    benefits: 'Reduces stress, enhances meditation',
    imageUrl: 'https://picsum.photos/id/112/600/600'
  },
  {
    id: '102',
    name: 'Bodhi Seed Prayer Beads',
    price: 95,
    category: Category.MEDITATION_BEADS,
    description: 'Sacred bodhi seed beads hand-selected and strung with intention. Each seed carries unique natural patterns, making your mala truly one-of-a-kind.',
    benefits: 'Spiritual connection, inner peace',
    imageUrl: 'https://picsum.photos/id/1060/600/600'
  },
  
  // Incense Collection
  {
    id: '2',
    name: 'Lavender Incense Sticks',
    price: 32,
    category: Category.INCENSE,
    description: 'Pure lavender incense made with organic lavender flowers and natural binders. Each stick burns for 45 minutes, releasing a soothing herbal aroma.',
    benefits: 'Relaxation, stress relief, better sleep',
    imageUrl: 'https://picsum.photos/id/1053/600/600'
  },
  {
    id: '201',
    name: 'Sandalwood & Rose Incense',
    price: 38,
    category: Category.INCENSE,
    description: 'A harmonious blend of sandalwood and rose petals creates an uplifting yet grounding atmosphere. Handcrafted using traditional rolling methods.',
    benefits: 'Heart-opening, meditative, aromatic',
    imageUrl: 'https://picsum.photos/id/113/600/600'
  },
  {
    id: '202',
    name: 'Palo Santo Incense Bundle',
    price: 45,
    category: Category.INCENSE,
    description: 'Sustainably harvested Palo Santo wood incense. Known as "holy wood," it carries sacred cleansing properties used for centuries in spiritual ceremonies.',
    benefits: 'Cleansing, uplifting, spiritual',
    imageUrl: 'https://picsum.photos/id/114/600/600'
  },

  // Candles Collection
  {
    id: '3',
    name: 'Botanical Soy Candle - Cedarwood',
    price: 48,
    category: Category.CANDLES,
    description: 'Hand-poured soy candle infused with pure cedarwood essential oil and dried botanicals. Burns clean for 40+ hours, creating a warm, woodsy ambiance.',
    benefits: 'Grounding, purifying, natural',
    imageUrl: 'https://picsum.photos/id/115/600/600'
  },
  {
    id: '301',
    name: 'Meditation Candle - Jasmine',
    price: 52,
    category: Category.CANDLES,
    description: 'Elegant jasmine-scented candle crafted with organic beeswax and coconut oil. Each candle is adorned with dried jasmine flowers.',
    benefits: 'Uplifting, calming, sensual',
    imageUrl: 'https://picsum.photos/id/116/600/600'
  },
  {
    id: '302',
    name: 'Herbal Garden Candle Set',
    price: 78,
    category: Category.CANDLES,
    description: 'Set of three mini candles featuring rosemary, thyme, and sage. Perfect for creating a botanical sanctuary in any space.',
    benefits: 'Refreshing, herbaceous, clarifying',
    imageUrl: 'https://picsum.photos/id/117/600/600'
  },

  // Wooden Combs Collection
  {
    id: '4',
    name: 'Peach Wood Meditation Comb',
    price: 35,
    category: Category.COMBS,
    description: 'Hand-carved peach wood comb with wide teeth. Each stroke promotes scalp circulation and brings a mindful moment to your daily routine.',
    benefits: 'Scalp health, hair strength, relaxation',
    imageUrl: 'https://picsum.photos/id/118/600/600'
  },
  {
    id: '401',
    name: 'Sandalwood Travel Comb',
    price: 28,
    category: Category.COMBS,
    description: 'Compact sandalwood comb with natural antibacterial properties. Portable design with protective sleeve for on-the-go mindfulness.',
    benefits: 'Anti-static, portable, aromatic',
    imageUrl: 'https://picsum.photos/id/119/600/600'
  },
  {
    id: '402',
    name: 'Rosewood Wide-Tooth Comb',
    price: 42,
    category: Category.COMBS,
    description: 'Luxurious rosewood comb with smooth, polished teeth. Perfect for detangling while distributing natural oils through hair.',
    benefits: 'Gentle detangling, shine enhancement',
    imageUrl: 'https://picsum.photos/id/1080/600/600'
  },

  // Gift Sets
  {
    id: '5',
    name: 'Mindful Morning Gift Set',
    price: 125,
    category: Category.GIFT_SETS,
    description: 'Curated collection including meditation beads, incense, and a wooden comb. Beautifully packaged in sustainable materials.',
    benefits: 'Complete mindfulness ritual',
    imageUrl: 'https://picsum.photos/id/360/600/600'
  },
  {
    id: '501',
    name: 'Relaxation Ritual Set',
    price: 98,
    category: Category.GIFT_SETS,
    description: 'Perfect evening ritual featuring a botanical candle and lavender incense sticks. Comes with a handwritten card.',
    benefits: 'Evening relaxation, better sleep',
    imageUrl: 'https://picsum.photos/id/1035/600/600'
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 't1',
    name: 'Elena Chen',
    title: 'Master Incense Maker',
    bio: 'With over 20 years mastering ancient incense-making techniques, Elena crafts each stick using heritage methods and pure botanicals.',
    imageUrl: 'https://picsum.photos/id/338/400/500'
  },
  {
    id: 't2',
    name: 'Marcus Liu',
    title: 'Meditation Bead Artisan',
    bio: 'Travels to remote mountains sourcing the finest sandalwood and sacred woods, hand-stringing each bead with mindful intention.',
    imageUrl: 'https://picsum.photos/id/91/400/500'
  },
  {
    id: 't3',
    name: 'Sophia Wang',
    title: 'Candle & Comb Crafter',
    bio: 'Blends traditional woodworking and botanical candle-making, infusing modern life with timeless Eastern aesthetics.',
    imageUrl: 'https://picsum.photos/id/64/400/500'
  }
];

export const NAV_LINKS = [
  { name: 'About', href: '#about', label: 'Our Story' },
  { name: 'Collection', href: '#handmade', label: 'Handcrafted' },
  { name: 'Artisans', href: '#design', label: 'Our Makers' },
  { name: 'Connect', href: '#social', label: 'Get in Touch' },
];