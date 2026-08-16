import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/Container/Container';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <Container>
        <div className="wrapper">
          <div className="content">
            <h1 className="title">
              Find your <span>harmony</span> in community
            </h1>

            <div className="buttons">
              <Link href="/articles" className="articlesButton">
                Go to Articles
              </Link>

              <Link href="/register" className="registerButton">
                Register
              </Link>
            </div>
          </div>

          <div className="imageWrapper">
            <Image
              src="./heroFoto1x.png"
              alt="Girl and mountains"
              width={806}
              height={562}
              className="image"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  );
}