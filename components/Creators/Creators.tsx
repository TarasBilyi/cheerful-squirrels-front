import Link from "next/link"
import Container from "../Container/Container"
import styles from "./Creators.module.css"

const Creators = () => {
return (
    <section className={styles.creators}>
        <Container>
            <div className={styles.head}>
            <h2 className={styles.title}>Top Creators</h2>
                <Link href="/authors" className={styles.linkToCreators}>
                    <span className={styles.textLink}>Go to all Creators</span>
                    <svg width="15" height="15" aria-hidden>
                        <use href="/icons/sprite.svg#top-right" />
                    </svg>
                </Link>
            </div>
            <ul>
                
            </ul>
        </Container>
    </section>
)
}
export default Creators