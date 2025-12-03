
import { Product, Category, TeamMember } from './types';

export const PRODUCTS: Product[] = [
  // 沉香系列
  {
    id: '1',
    name: '越南芽庄白奇楠沉香',
    price: 3680,
    category: Category.AGARWOOD,
    description: '顶级芽庄白棋，油脂丰腴，初闻凉意袭人，继而乳香甘甜，穿透力极强。',
    benefits: '行气、纳肾、平喘',
    imageUrl: 'https://picsum.photos/id/110/600/600'
  },
  {
    id: '101',
    name: '加里曼丹沉香手串',
    price: 1888,
    category: Category.AGARWOOD,
    description: '纹理清晰如画，药香浓郁，带有淡淡的草本清香，层次丰富。',
    benefits: '安神、定气、缓解压力',
    imageUrl: 'https://picsum.photos/id/112/600/600'
  },
  
  // 檀香系列
  {
    id: '2',
    name: '迈索尔老山檀手持',
    price: 1288,
    category: Category.SANDALWOOD,
    description: '六十年以上树龄老料，肉质红润，香韵醇正霸道，带有独特的奶香。',
    benefits: '安神、静心、助眠',
    imageUrl: 'https://picsum.photos/id/1060/600/600'
  },
  {
    id: '201',
    name: '东加檀香雕刻摆件',
    price: 980,
    category: Category.SANDALWOOD,
    description: '手工雕刻祥云纹样，色泽淡雅，香气柔和绵长，适合案头清供。',
    benefits: '调和、理气、悦心',
    imageUrl: 'https://picsum.photos/id/113/600/600'
  },

  // 玉石系列
  {
    id: '3',
    name: '和田玉籽料·平安扣',
    price: 5600,
    category: Category.JADE,
    description: '羊脂级白玉，温润如酥，油性极佳。平安扣形制，寓意圆满顺遂。',
    benefits: '滋养、润德、辟邪',
    imageUrl: 'https://picsum.photos/id/114/600/600'
  },
  {
    id: '301',
    name: '南红玛瑙多宝串',
    price: 880,
    category: Category.JADE,
    description: '川料南红，满色满肉，搭配青金石与蜜蜡，色彩明艳动人。',
    benefits: '养血、安神、转运',
    imageUrl: 'https://picsum.photos/id/115/600/600'
  },

  // 香具系列
  {
    id: '4',
    name: '宋风汝窑天青香炉',
    price: 1280,
    category: Category.BURNER,
    description: '雨过天青云破处，这般颜色做将来。开片自然，古朴典雅。',
    benefits: '赏心、悦目、修身',
    imageUrl: 'https://picsum.photos/id/116/600/600'
  },
  {
    id: '401',
    name: '纯铜仿古博山炉',
    price: 680,
    category: Category.BURNER,
    description: '精铜铸造，层峦叠嶂，燃香时烟雾缭绕如仙山，意境深远。',
    benefits: '观烟、悟道、静心',
    imageUrl: 'https://picsum.photos/id/117/600/600'
  },

  // 茶器系列
  {
    id: '5',
    name: '建盏·曜变天目盏',
    price: 2200,
    category: Category.TEA_WARE,
    description: '入窑一色，出窑万彩。斑纹如星空深邃，茶汤入盏，金圈闪耀。',
    benefits: '软水、保温、聚香',
    imageUrl: 'https://picsum.photos/id/118/600/600'
  },
  {
    id: '501',
    name: '紫砂西施壶',
    price: 880,
    category: Category.TEA_WARE,
    description: '原矿底槽清，泥料纯正，做工精良，出水流畅，养壶首选。',
    benefits: '透气、养味、存茶',
    imageUrl: 'https://picsum.photos/id/119/600/600'
  },

  // 雅玩系列
  {
    id: '6',
    name: '陈化崖柏养生珠',
    price: 458,
    category: Category.ACCESSORY,
    description: '太行山陈化崖柏，纹理如云如水，薄荷凉香，醒脑提神。',
    benefits: '提神、醒脑、通窍',
    imageUrl: 'https://picsum.photos/id/1080/600/600'
  },
  {
    id: '601',
    name: '手工刺绣艾草香囊',
    price: 58,
    category: Category.ACCESSORY,
    description: '苏绣工艺，内填三年陈艾绒与多种天然香料，随身佩戴，香气袭人。',
    benefits: '驱蚊、避秽、扶阳',
    imageUrl: 'https://picsum.photos/id/360/600/600'
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 't1',
    name: '林 汐',
    title: '首席香道师',
    bio: '潜心研习古法制香二十余载，致力于复原失传的宫廷香方，以香载道。',
    imageUrl: 'https://picsum.photos/id/338/400/500'
  },
  {
    id: 't2',
    name: '莫 远',
    title: '文玩鉴定师',
    bio: '行遍深山老林，只为寻找那一抹最纯粹的木纹与色泽。',
    imageUrl: 'https://picsum.photos/id/91/400/500'
  },
  {
    id: 't3',
    name: '苏 染',
    title: '美学主理人',
    bio: '将东方禅意融入现代设计，让传统器物回归当代生活日常。',
    imageUrl: 'https://picsum.photos/id/64/400/500'
  }
];

export const NAV_LINKS = [
  { name: 'About', href: '#about', label: '关于·寻隐' },
  { name: 'Our Handmade', href: '#handmade', label: '手作·雅集' },
  { name: 'Design', href: '#design', label: '设计·守艺' },
  { name: 'Social media', href: '#social', label: '雅趣·联络' },
];