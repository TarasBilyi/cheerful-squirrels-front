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
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';

const DRAFT_KEY = 'draft:add-article';
const ARTICLE_MAX_LENGTH = 4000;

interface ArticleFormValues {
  title: string;
  desc: string;
  article: string;
}

const EMPTY_VALUES: ArticleFormValues = { title: '', desc: '', article: '' };

type SubmitError = AxiosError<{ message?: string; error?: string }>;

const LINE_TAGS = new Set(['P', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']);
const PASSTHROUGH_TAGS = new Set(['BLOCKQUOTE', 'UL', 'OL', 'DIV']);

const stripHtml = (html: string): string => {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return html.replace(/<[^>]*>/g, '');
  }

  const doc = new DOMParser().parseFromString(html, 'text/html');

  doc.querySelectorAll('br').forEach(br => {
    const isTrailingBreak = br.classList.contains('ProseMirror-trailingBreak');
    br.replaceWith(doc.createTextNode(isTrailingBreak ? '' : '\n'));
  });

  const lines: string[] = [];
  const walk = (node: ParentNode) => {
    node.childNodes.forEach(child => {
      if (child.nodeType !== Node.ELEMENT_NODE) return;
      const element = child as Element;

      if (LINE_TAGS.has(element.tagName)) {
        lines.push(element.textContent ?? '');
      } else if (PASSTHROUGH_TAGS.has(element.tagName)) {
        walk(element);
      } else {
        walk(element);
      }
    });
  };
  walk(doc.body);

  return lines.length > 0 ? lines.join('\n') : (doc.body.textContent ?? '');
};

const toEditorHtml = (text: string) => {
  if (/<[a-z][\s\S]*>/i.test(text)) {
    return text;
  }

  const escapeHtml = (line: string) =>
    line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return text
    .split(/\n|\/n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => `<p>${escapeHtml(line)}</p>`)
    .join('');
};

const DraftAutosave = ({ values, enabled }: { values: ArticleFormValues; enabled: boolean }) => {
  useFormDraft({ key: DRAFT_KEY, values, enabled });
  return null;
};
interface ArticleTextAreaProps {
  placeholder: string;
  flickerToken: number;
  editorKey: string;
}

const ArticleRichText = ({ placeholder, flickerToken, editorKey }: ArticleTextAreaProps) => {
  const [field, , helpers] = useField('article');

  const length = stripHtml(field.value).length;
  const isOverLimit = length > ARTICLE_MAX_LENGTH;

  return (
    <>
      <div className={css.textareaWrapper}>
        <RichTextEditor
          key={editorKey}
          value={field.value}
          onChange={html => helpers.setValue(html)}
          onBlur={() => helpers.setTouched(true)}
          placeholder={placeholder}
          counter={
            <span
              className={`${css.charCounter} ${isOverLimit ? css.charCounterOver : ''}`}
              aria-live="polite"
            >
              {length}/{ARTICLE_MAX_LENGTH}
            </span>
          }
        />
      </div>
      <ErrorMessage key={flickerToken} name="article" component="span" className={css.flicker} />
    </>
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
  const [flickerToken, setFlickerToken] = useState(0);

  const [isLocked, setIsLocked] = useState(false);
  const isSubmittingRef = useRef(false);

  const draft = useFormDraftValue<ArticleFormValues>(DRAFT_KEY);
  const initialValues: ArticleFormValues = isEditMode
    ? { title: article!.title, desc: article!.desc, article: toEditorHtml(article!.article) }
    : (draft ?? EMPTY_VALUES);

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
    setPreviewUrl(selected ? URL.createObjectURL(selected) : (article?.img ?? null));
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
      .transform(value => value?.trim())
      .min(3, 'Minimum 3 characters')
      .max(48, 'Maximum 48 characters')
      .required('Title is required'),
    desc: Yup.string()
      .transform(value => value?.trim())
      .min(10, 'Minimum 10 characters')
      .max(200, 'Maximum 200 characters')
      .required('Description is required'),
    article: Yup.string()
      .transform(value => stripHtml(value ?? ''))
      .test(
        'not-blank',
        'Article body is required',
        value => typeof value === 'string' && /\S/.test(value)
      )
      .min(100, 'Minimum 100 characters')
      .max(ARTICLE_MAX_LENGTH, `Maximum ${ARTICLE_MAX_LENGTH} characters`)
      .required('Article body is required'),
  });

  async function handleSubmit(
    values: ArticleFormValues,
    { setSubmitting }: FormikHelpers<ArticleFormValues>
  ) {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsLocked(true);

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
        setIsLocked(false);
        return;
      }
      const formData = new FormData();
      formData.append('title', values.title.trim());
      formData.append('desc', values.desc.trim());
      formData.append('article', values.article.trim());
      formData.append('photo', image);

      const newArticle = await createArticle(formData);
      queryClient.invalidateQueries({ queryKey: ['articles'] });

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
      setIsLocked(false);
    } finally {
      isSubmittingRef.current = false;
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
            <ErrorMessage
              key={flickerToken}
              name="image"
              component="span"
              className={css.flicker}
            />

            <div className={css.titleFieldContainer}>
              <label htmlFor="title">Title</label>
              <Field
                className={css.articleField}
                id="title"
                type="text"
                name="title"
                placeholder="Enter the title"
              />
              <ErrorMessage
                key={flickerToken}
                name="title"
                component="span"
                className={css.flicker}
              />
            </div>

            <div className={css.descFieldContainer}>
              <label htmlFor="desc">Description</label>
              <Field
                className={css.articleField}
                id="desc"
                type="text"
                name="desc"
                placeholder="Enter a short description"
              />
              <ErrorMessage
                key={flickerToken}
                name="desc"
                component="span"
                className={css.flicker}
              />
            </div>

            <div className={css.articleFieldContainer}>
              <ArticleRichText
                placeholder="Enter a text"
                flickerToken={flickerToken}
                editorKey={isEditMode ? `edit-${article!._id}` : draft ? 'draft' : 'empty'}
              />
            </div>

            <button
              type="submit"
              className={css.submitButton}
              disabled={isLocked || isSubmitting}
              aria-busy={isLocked || isSubmitting}
              onClick={() => setFlickerToken(token => token + 1)}
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
