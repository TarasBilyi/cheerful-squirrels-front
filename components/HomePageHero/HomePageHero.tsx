import { Link } from "react-router-dom";
import Container from "../Container/Container";
import css from "./Hero.module.css";
import "./HomePageHero.css";

export default function Hero() {
  return (
    <section className={css.section}>
      <Container className={css.container}>
        <div className={css.content}>
          <h1 className={css.title}>
            Discover <span>authors</span>
          </h1>

          <div className={css.buttons}>
            <Link
              to="/articles"
              className={`${css.button} ${css.articlesButton}`}
            >
              Go to Articles
            </Link>

            <Link
              to="/register"
              className={`${css.button} ${css.registerButton}`}
            >
              Register
            </Link>
          </div>
        </div>

        <img
          className={css.foto}
          src="/foto/sec1-1x.png"
          srcSet="/foto/sec1-1x.png 1x, /foto/sec1-2x.png 2x"
          alt="girl and mountains"
          width={806}
          height={562}
        />
      </Container>
    </section>
  );
}