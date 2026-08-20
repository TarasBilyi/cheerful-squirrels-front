import Link from "next/link";
import Container from "../Container/Container";
import { AuthorsItem } from "../AuthorsPage/AuthorsList";
import { getAuthors } from "@/lib/api/serverApi"; 
import type { Author } from "@/types/author"; 
import styles from "./Creators.module.css";

const Creators = async () => {
  let topCreators: Author[] = [];

  try {
    const response = await getAuthors(1, 6);
    topCreators = response.authors || [];
  } catch (error) {
    console.error("Failed to fetch top creators:", error);
  }

  if (topCreators.length === 0) {
    return null;
  }

  return (
    <section className={styles.creators}>
      <Container>
        <div className={styles.header}>
          <h2 className={styles.title}>Top Creators</h2>

          <Link href="/authors" className={styles.link}>
            Go to all Creators
            <svg
              className={styles.icon}
              width="15"
              height="15"
              aria-hidden="true"
            >
              <use href="/icons/sprite.svg#top-right" />
            </svg>
          </Link>
        </div>

        <ul className={styles.list}>
          {topCreators.map((author) => (
            <AuthorsItem key={author._id} author={author}/>
          ))}
        </ul>
      </Container>
    </section>
  );
};

export default Creators;