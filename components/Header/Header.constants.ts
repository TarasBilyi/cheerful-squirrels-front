export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/articles', label: 'Articles' },
  { href: '/authors', label: 'Creators' },
];
