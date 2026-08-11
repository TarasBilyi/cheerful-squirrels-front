import Link from 'next/link';
import css from './CtaLink.module.css';

interface CtaLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  tabIndex?: number;
}

const CtaLink = ({ href, children, className, onClick, tabIndex }: CtaLinkProps) => {
  return (
    <Link
      href={href}
      prefetch={false}
      onClick={onClick}
      tabIndex={tabIndex}
      className={`${css.cta} ${className ?? ''}`}
    >
      {children}
    </Link>
  );
};

export default CtaLink;
