'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import css from './ProfilePage.module.css';

const ProfileTabs = () => {
  const pathname = usePathname();
  const isSaved = pathname === '/profile/saved';
  const isSubscriptions = pathname === '/profile/subscriptions';
  const isMyArticles = !isSaved && !isSubscriptions;

  return (
    <div className={css.tabs}>
      <Link href="/profile" className={isMyArticles ? css.tabActive : css.tab}>
        My Articles
      </Link>
      <Link href="/profile/saved" className={isSaved ? css.tabActive : css.tab}>
        Saved Articles
      </Link>
      <Link
        href="/profile/subscriptions"
        className={isSubscriptions ? css.tabActive : css.tab}
      >
        Subscriptions
      </Link>
    </div>
  );
};

export default ProfileTabs;
