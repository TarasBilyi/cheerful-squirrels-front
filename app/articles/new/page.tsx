
import { Metadata } from "next";
import css from '@/components/Container/Container.module.css'
import AddArticleForm from "@/components/AddArticleForm/AddArticleForm";

export const metadata: Metadata = {
  title: `Harmoniq - Create Article`,
  description: "Write a new public article on Harmoniq",
  openGraph: {
    title: `Harmoniq`,
    description: "Create new article",
    url: `https://harmoniq.com/articles/create`,
    siteName: 'Harmoniq',
    images: [{
        url: 'https://ac.goit.global/fullstack/react/og-meta.jpg',
        width: 1200,
        height: 630,
        alt: "Harmoniq",
      },],
      type: 'website',
  },
}

const CreateArticle = async () => {
    
    return (
        <main>
            <div className={css.container}>
                <AddArticleForm />
            </div>
        </main>
    );
}

export default CreateArticle;