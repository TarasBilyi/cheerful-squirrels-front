import styles from './page.module.css';
import About from '@/components/About/About';
import Hero from '@/components/Hero/Hero';
import PopularArticles from '@/components/PopularArticles/PopularArticles';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <PopularArticles />
    </>
  );
}
