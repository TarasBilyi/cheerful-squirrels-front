'use client';

import { useEffect, useRef, useState, type ChangeEvent, type SubmitEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { register, updateAvatar } from '@/lib/api/clientApi';
import { ApiError } from '@/app/api/api';
import { useRegisterDraftStore } from '@/lib/store/registerDraftStore';
import { useAuthStore } from '@/lib/store/authStore';
import { RegisterDraftSchema } from '@/components/RegisterForm/RegisterForm.schema';
import css from './UploadForm.module.css';

const UploadForm = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const draft = useRegisterDraftStore(state => state.draft);
  const clearDraft = useRegisterDraftStore(state => state.clearDraft);
  const setUser = useAuthStore(state => state.setUser);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!draft || !RegisterDraftSchema.isValidSync(draft)) {
      toast.error('Please fill in the registration form first');
      router.replace('/register');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(selected);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : null);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const submitRegistration = async () => {
    if (!draft || isSubmitting || !RegisterDraftSchema.isValidSync(draft)) {
      return;
    }

    setIsSubmitting(true);

    try {
      let user = await register({
        name: draft.name,
        email: draft.email,
        password: draft.password,
      });

      if (file) {
        try {
          const { avatarUrl } = await updateAvatar(file);
          user = { ...user, avatarUrl };
        } catch {
          toast.error('Registered, but avatar upload failed. You can add it later.');
        }
      }

      setUser(user);
      clearDraft();
      toast.success('Registration successful!');
      router.push('/profile');
    } catch (error) {
      const err = error as ApiError;
      const status = err.response?.status;
      const message = err.response?.data?.error;

      if (status === 400 || status === 409) {
        toast.error(message || 'This email is already registered');
        router.push('/register');
      } else {
        toast.error(message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitRegistration();
  };

  const handleSkip = () => {
    submitRegistration();
  };

  return (
    <div className={css.wrapper}>
      <form className={css.card} onSubmit={handleSubmit}>
        <button
          type="button"
          className={css.closeButton}
          onClick={handleSkip}
          disabled={isSubmitting}
          aria-label="Skip photo and register"
        >
          <svg width={24} height={24}>
            <use href="/icons/sprite.svg#close" />
          </svg>
        </button>

        <h1 className={css.title}>Upload your photo</h1>

        <button
          type="button"
          className={css.avatarButton}
          onClick={() => fileInputRef.current?.click()}
          disabled={isSubmitting}
        >
          {previewUrl ? (
            <div className={css.avatarPreviewWrapper}>
              <Image
                src={previewUrl}
                alt="Selected avatar"
                fill
                unoptimized
                className={css.avatarPreview}
              />
              <span className={css.avatarOverlay} aria-hidden>
                <svg width={24} height={24}>
                  <use href="/icons/sprite.svg#edit" />
                </svg>
              </span>
            </div>
          ) : (
            <svg width={64} height={58}>
              <use href="/icons/sprite.svg#photo" />
            </svg>
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className={css.fileInput}
          onChange={handleFileChange}
        />

        <button
          type="submit"
          className={css.submitButton}
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting && <span className={css.spinner} aria-hidden />}
          {isSubmitting ? 'Saving…' : file ? 'Save photo and register' : 'Continue without photo'}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
