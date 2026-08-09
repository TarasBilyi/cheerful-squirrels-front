// components/About/About.tsx

import Image from "next/image";
import styles from "./About.module.css";
import Container from "@/components/Container/Container";

export default function About() {
  return (
    <section className={styles.about}>
      <Container>
        <div className={styles.wrapper}>
          <div className={styles.textCard}>
            <h2 className={styles.title}>About us</h2>
            <p className={styles.text}>
              Harmoniq is a mindful publishing platform dedicated to mental
              health and well-being. We bring together writers, thinkers, and
              readers who believe that open, thoughtful stories can heal,
              inspire, and connect. Whether you're here to share your journey or
              learn from others — this is your space to slow down, reflect, and
              grow.
            </p>
          </div>

          <div className={styles.imageLotus}>
            <Image
              src="/images/about/lotus_mob_2x.webp"
              alt="Lotus flower in soft light"
              fill
              sizes="361px"
              className={styles.imgMobile}
              loading="lazy"
            />
            <Image
              src="/images/about/lotus_tab_2x.webp"
              alt="Lotus flower in soft light"
              fill
              sizes="249px"
              className={styles.imgTablet}
              loading="lazy"
            />
            <Image
              src="/images/about/lotus_desk_2x.webp"
              alt="Lotus flower in soft light"
              fill
              sizes="704px"
              className={styles.imgDesktop}
              loading="lazy"
            />
          </div>
          <div className={styles.imageFriends}>
            <Image
              src="/images/about/friends_mob_2x.webp"
              alt="Friends watching the sunset together"
              fill
              sizes="361px"
              className={styles.imgMobile}
              loading="lazy"
            />
            <Image
              src="/images/about/friends_tab_2x.webp"
              alt="Friends watching the sunset together"
              fill
              sizes="704px"
              className={styles.imgTablet}
              loading="lazy"
            />
            <Image
              src="/images/about/friends_desk_2x.webp"
              alt="Friends watching the sunset together"
              fill
              sizes="808px"
              className={styles.imgDesktop}
              loading="lazy"
            />
          </div>

          <div className={styles.imageMeditation}>
            <Image
              src="/images/about/meditation_desk_2x.webp"
              alt="Person meditating at sunrise"
              fill
              sizes="392px"
              className={styles.imgDesktop}
              loading="lazy"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
