'use client';

import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { AxiosError } from 'axios';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik, FormikHelpers, useField } from 'formik';
import css from './AddArticleForm.module.css';
import toast from 'react-hot-toast';
import { createArticle } from '@/services/article';
import { updateArticle } from '@/lib/api/articlesApi';
import { getCurrentUser } from '@/lib/api/clientApi';
import { useFormDraft, useFormDraftValue, clearFormDraft } from '@/hooks/useFormDraft';
import { useAuthStore } from '@/lib/store/authStore';
import type { Article } from '@/types/article';
import Image from 'next/image';

const DRAFT_KEY = 'draft:add-article';

interface ArticleFormValues {
  title: string;
  desc: string;
  article: string;
}

const EMPTY_VALUES: ArticleFormValues = { title: '', desc: '', article: '' };

// The shared `ApiError` type expects `{ error: string }`; the backend now
// sends both `message` and `error` for the same text, read both defensively.
type SubmitError = AxiosError<{ message?: string; error?: string }>;

const DraftAutosave = ({ values, enabled }: { values: ArticleFormValues; enabled: boolean }) => {
  useFormDraft({ key: DRAFT_KEY, values, enabled });
  return null;
};

// Plain-textarea auto-resize only fires on user input, so a textarea
// pre-filled programmatically (e.g. an article's existing text when
// editing) stays clamped to its CSS min-height until the user types a
// character. Resizing on every value change (not just onInput) makes it
// expand to fit the full text as soon as it's loaded.
interface ArticleTextAreaProps {
  className: string;
  placeholder: string;
}

const ArticleTextArea = ({ className, placeholder }: ArticleTextAreaProps) => {
  const [field] = useField('article');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  useEffect(() => {
    resize();
  }, [field.value]);

  return (
    <textarea
      {...field}
      ref={textareaRef}
      id="article"
      className={className}
      placeholder={placeholder}
      onInput={resize}
    />
  );
};

interface AddArticleFormProps {
  article?: Article;
}

export default function AddArticleForm({ article }: AddArticleFormProps) {
  const isEditMode = Boolean(article);

  const queryClient = useQueryClient();
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(article?.img ?? null);

  const draft = useFormDraftValue<ArticleFormValues>(DRAFT_KEY);
  const initialValues: ArticleFormValues = isEditMode
    ? { title: article!.title, desc: article!.desc, article: article!.article }
    : draft ?? EMPTY_VALUES;

  useEffect(() => {
    if (draft && !isEditMode) {
      toast('Restored your unsaved draft', { icon: '📝', id: DRAFT_KEY });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;

    if (previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setImage(selected);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : article?.img ?? null);
  };

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const ArticleFormSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, 'Minimum 3 characters')
      .max(48, 'Maximum 48 characters')
      .required('Title is required'),
    desc: Yup.string()
      .min(10, 'Minimum 10 characters')
      .max(200, 'Maximum 200 characters')
      .required('Description is required'),
    article: Yup.string()
      .min(100, 'Minimum 100 characters')
      .max(4000, 'Maximum 4000 characters')
      .required('Article body is required'),
  });

  async function handleSubmit(
    values: ArticleFormValues,
    { setSubmitting }: FormikHelpers<ArticleFormValues>
  ) {
    try {
      if (isEditMode) {
        const updated = await updateArticle(article!._id, {
          ...values,
          photo: image ?? undefined,
        });
        queryClient.invalidateQueries({ queryKey: ['articles'] });
        toast.success('Article updated');
        router.push(`/articles/${updated._id}`);
        return;
      }

      if (!image) {
        toast.error('Please add a photo');
        return;
      }
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('desc', values.desc);
      formData.append('article', values.article);
      formData.append('photo', image);

      const newArticle = await createArticle(formData);
      queryClient.invalidateQueries({ queryKey: ['articles'] });

      // Re-fetch the current user so the "articles" count in My Profile
      // reflects the new article immediately, without needing a page
      // refresh. Falls back to a local increment if the refetch fails.
      try {
        const freshUser = await getCurrentUser();
        setUser(freshUser);
      } catch {
        if (user) {
          setUser({ ...user, articlesAmount: (user.articlesAmount ?? 0) + 1 });
        }
      }

      clearFormDraft(DRAFT_KEY);
      toast.success('Article published successfully!');
      router.push(`/articles/${newArticle._id}`);
    } catch (error) {
      const axiosError = error as SubmitError;
      toast.error(
        axiosError.response?.data?.message ??
          axiosError.response?.data?.error ??
          'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={css.createArticleSection}>
      <h1 className={css.header}>{isEditMode ? 'Edit article' : 'Create an article'}</h1>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={handleSubmit}
        validationSchema={ArticleFormSchema}
      >
        {({ isSubmitting, values }) => (
          <Form className={css.articleForm}>
            <DraftAutosave values={values} enabled={!isEditMode} />

            <label htmlFor="image" className={css.visuallyHidden}>
              {isEditMode ? 'Change photo' : 'Add a photo'}
            </label>
            <button
              type="button"
              className={css.imgAdd}
              onClick={() => fileInputRef.current?.click()}
              aria-label={isEditMode ? 'Change photo' : 'Add a photo'}
            >
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Selected photo preview"
                  fill
                  unoptimized={previewUrl.startsWith('blob:')}
                  className={css.imgPreview}
                />
              ) : (
                <svg width={64} height={58} aria-hidden className={css.imgIcon}>
                  <use href="/icons/sprite.svg#photo" />
                </svg>
              )}
            </button>
            <input
              ref={fileInputRef}
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className={css.fileInput}
              onChange={handleImageChange}
            />
            <ErrorMessage name="image" component="span" className={css.error} />

            <div className={css.titleFieldContainer}>
              <label htmlFor="title">Title</label>
              <Field
                className={css.articleField}
                id="title"
                type="text"
                name="title"
                placeholder="Enter the title"
              />
              <ErrorMessage name="title" component="span" className={css.error} />
            </div>

            <div className={css.descFieldContainer}>
              <label htmlFor="desc">Description</label>
              <Field
                className={css.articleField}
                id="desc"
                type="text"
                name="desc"
                placeholder="Enter a short one-sentence description"
              />
              <ErrorMessage name="desc" component="span" className={css.error} />
            </div>

            <div className={css.articleFieldContainer}>
              <ArticleTextArea
                className={`${css.articleField} ${css.articleTextArea}`}
                placeholder="Enter a text"
              />
              <ErrorMessage name="article" component="span" className={css.error} />
            </div>

            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting && <span className={css.spinner} aria-hidden />}
              {isSubmitting
                ? isEditMode
                  ? 'Saving…'
                  : 'Publishing…'
                : isEditMode
                  ? 'Save changes'
                  : 'Publish Article'}
            </button>
          </Form>
        )}
      </Formik>
    </section>
  );
}
