'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import css from './ProfilePage.module.css';

const ProfileTabs = () => {
  const pathname = usePathname();
  const isSaved = pathname === '/profile/saved';

  return (
    <div className={css.tabs}>
      <Link href="/profile" className={isSaved ? css.tab : css.tabActive}>
        My Articles
      </Link>
      <Link href="/profile/saved" className={isSaved ? css.tabActive : css.tab}>
        Saved Articles
      </Link>
    </div>
  );
};

export default ProfileTabs;
