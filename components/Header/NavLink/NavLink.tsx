'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import css from './NavLink.module.css';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  tabIndex?: number;
  className?: string;
}

const NavLink = ({ href, children, onClick, tabIndex, className }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      prefetch={false}
      onClick={onClick}
      tabIndex={tabIndex}
      aria-current={isActive ? 'page' : undefined}
      className={`${css.navLink} ${isActive ? css.navLinkActive : ''} ${className ?? ''}`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
