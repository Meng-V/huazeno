export const site = {
  name: 'Huazeno',
  legalName: 'Hebei Huazeno Plastic Packaging Co., Ltd.',
  tagline: 'Manufacturer of plastic woven bags and related products',
  description:
    'Hebei Huazeno Plastic Packaging Co., Ltd. manufactures flour bags, bran bags and woven fabric rolls in Daming County, Hebei — 700 staff, 1,300 looms, 500 million woven units a year.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://huazeno.com',
  email: 'admin@huazeno.com',
  phones: ['188-0310-7378', '188-0310-6736'],
  address: 'North side of the west section of Yangping Road, Daming County, Handan, Hebei, China',
  founded: '2002',
};

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const nav: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'Company Profile', href: '/about' },
      { label: 'Qualifications & Honours', href: '/about/honours' },
      { label: 'Corporate Culture', href: '/about/culture' },
      { label: 'Factory Tour', href: '/about/factory' },
      { label: 'Sales Network', href: '/about/network' },
    ],
  },
  {
    label: 'Products',
    href: '/products',
    children: [
      { label: 'Flour Bags', href: '/products/flour-bags' },
      { label: 'Bran Bags', href: '/products/bran-bags' },
      { label: 'Fabric Rolls', href: '/products/fabric-rolls' },
    ],
  },
  { label: 'News', href: '/news' },
  { label: 'Exhibitions', href: '/exhibitions' },
  { label: 'Contact', href: '/contact' },
];
