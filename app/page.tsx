import styles from './page.module.css';
import About from '@/components/About/About';
import Creators from '@/components/Creators/Creators';
import PopularArticles from '@/components/PopularArticles/PopularArticles';

export default function Home() {
  return (
    <>
      <About />
      <PopularArticles />
      <Creators/>
    </>
  );
}
