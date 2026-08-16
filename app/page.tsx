import styles from './page.module.css';
import About from '@/components/About/About';
import PopularArticles from '@/components/PopularArticles/PopularArticles';

export default function Home() {
  return (
    <>
      <About />
      <PopularArticles />
    </>
  );
}
