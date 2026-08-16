import Link from "next/link"
import Container from "../Container/Container"
import styles from "./Creators.module.css"

const Creators = () => {
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
                
            </ul>
        </Container>
    </section>
)
}
export default Creators