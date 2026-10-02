export type City = {
  id: string
  name: string
  description: string
  image: string
  projects: number
}

export type Project = {
  id: string
  name: string
  city: string
  type: string
  price: string
  image: string
  beds: number
  baths: number
  area: number
  status: 'متاح' | 'قريباً' | 'بيع سريع'
}

export const cities: City[] = [
  {
    id: 'new-cairo',
    name: 'القاهرة الجديدة',
    description: 'قلب الرفاهية في الشرق، كمبوندات راقية وخدمات متكاملة.',
    image: '/images/city-new-cairo.png',
    projects: 48,
  },
  {
    id: 'shorouk',
    name: 'مدينة الشروق',
    description: 'مساحات خضراء واسعة وهدوء عائلي على أعلى مستوى.',
    image: '/images/city-shorouk.png',
    projects: 32,
  },
  {
    id: 'future-city',
    name: 'العاصمة الإدارية',
    description: 'مدينة المستقبل الذكية وأبراج سكنية بإطلالات ساحرة.',
    image: '/images/city-future-city.png',
    projects: 27,
  },
]

export const projects: Project[] = [
  {
    id: 'p1',
    name: 'فيلا لاجونا الفاخرة',
    city: 'القاهرة الجديدة',
    type: 'فيلا مستقلة',
    price: '18,500,000 ج.م',
    image: '/images/project-1.png',
    beds: 5,
    baths: 6,
    area: 620,
    status: 'متاح',
  },
  {
    id: 'p2',
    name: 'ريزيدنس النخبة',
    city: 'مدينة الشروق',
    type: 'شقة بحديقة',
    price: '6,900,000 ج.م',
    image: '/images/project-2.png',
    beds: 3,
    baths: 3,
    area: 210,
    status: 'بيع سريع',
  },
  {
    id: 'p3',
    name: 'بنتهاوس سكاي لاين',
    city: 'العاصمة الإدارية',
    type: 'بنتهاوس دوبلكس',
    price: '12,750,000 ج.م',
    image: '/images/project-3.png',
    beds: 4,
    baths: 4,
    area: 340,
    status: 'متاح',
  },
  {
    id: 'p4',
    name: 'تاون هاوس الجاردنز',
    city: 'القاهرة الجديدة',
    type: 'تاون هاوس',
    price: '9,300,000 ج.م',
    image: '/images/project-4.png',
    beds: 4,
    baths: 4,
    area: 280,
    status: 'قريباً',
  },
]

export const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/cities', label: 'المدن' },
  { href: '/about', label: 'عن الشركة' },
  { href: '/contact', label: 'تواصل معنا' }
]