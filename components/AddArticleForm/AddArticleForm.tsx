'use client';

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { ErrorMessage, Field, 
        Form, 
        Formik, 
        FormikHelpers} from 'formik';
import css from './AddArticleForm.module.css';
import { useState } from "react";
import toast from "react-hot-toast";
import { createArticle } from "@/services/article";

export default function AddArticleForm() {
    const queryClient = useQueryClient();
    const router = useRouter();

    const [image, setImage] = useState<File | null>(null);

    interface ArticleFormValues {
        title: string;
        article: string;
    }

    const NewArticleSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, "Minimum 3 characters")
        .max(48, "Maximum 48 characters")
        .required("Title is required"),
    article: Yup.string()
        .min(100, "Minimum 100 characters")
        .max(4000, "Maximum 4000 characters")
        .required("Article body is required"),
    });

    async function handleSubmit (values: { title: string; article: string}, { setSubmitting }: FormikHelpers<ArticleFormValues>) {
        try {
            if (!image) {
                toast.error('Please add a photo');
                return;
            }
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('article', values.article);
            if (image) formData.append('photo', image);


            const newArticle = await createArticle(formData);
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            toast.success('Article published successfully!');
            router.push(`/articles/${newArticle._id}`);
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className={css.createArticleSection}>
            <h1 className={css.header}>Create an article</h1>
            <Formik 
                initialValues={{
                    title: '',
                    article: '',
                }}
                onSubmit={handleSubmit}
                validationSchema={NewArticleSchema}
            >
                <Form className={css.articleForm}>
                    <div className={css.imgAdd}>
                        <label htmlFor="image">Add a photo</label>
                        <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                        />
                    </div>
                    <ErrorMessage name="image" component="span" className={css.error} />

                    <div className={css.titleFieldContainer}>
                        <label htmlFor="title">Title</label>
                        <Field className={css.articleField}
                        id="title"
                        type="text"
                        name="title"
                        placeholder="Enter the title" />
                        <ErrorMessage name="title" component="span" className={css.error} />
                    </div>

                    <div className={css.articleFieldContainer}>
                        <Field className={`${css.articleField} ${css.articleTextArea}`}
                        as="textarea"
                        id="article"
                        name="article"
                        placeholder="Enter a text"
                        onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
                            e.currentTarget.style.height = "auto";
                            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                        }} />
                        <ErrorMessage name="article" component="span" className={css.error} />
                    </div>

                    <button type="submit" className={css.submitButton} disabled={false}>
                        Publish Article
                    </button>
                </Form>

            </Formik>
        </section>
    )
}