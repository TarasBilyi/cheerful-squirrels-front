'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import css from '../Header.module.css';

const HIDE_THRESHOLD = 80;

interface HeaderScrollProps {
  children: React.ReactNode;
}

const HeaderScroll = ({ children }: HeaderScrollProps) => {
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, 'change', latest => {
    const isScrollingDown = latest > lastScrollY.current;

    setIsScrolled(latest > 8);
    setIsHidden(latest > HIDE_THRESHOLD && isScrollingDown);

    lastScrollY.current = latest;
  });

  return (
    <motion.header
      className={`${css.header} ${isScrolled ? css.headerScrolled : ''}`}
      animate={{ y: isHidden ? '-100%' : '0%' }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.header>
  );
};

export default HeaderScroll;
