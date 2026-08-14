'use client';

import { useEffect, useRef, useState, type ChangeEvent, type SubmitEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { register, updateAvatar } from '@/lib/api/clientApi';
import { ApiError } from '@/app/api/api';
import { useRegisterDraftStore } from '@/lib/store/registerDraftStore';
import { useAuthStore } from '@/lib/store/authStore';
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
    if (!draft || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      let user = await register(draft);

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
      router.push('/profile');
    } catch (error) {
      const status = (error as ApiError).response?.status;

      if (status === 400) {
        toast.error('Please use another email');
        router.push('/register');
      } else {
        toast.error((error as ApiError).response?.data?.error ?? 'Registration failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      return;
    }

    submitRegistration();
  };

  const handleClose = () => {
    submitRegistration();
  };

  return (
    <div className={css.wrapper}>
      <form className={css.card} onSubmit={handleSubmit}>
        <button
          type="button"
          className={css.closeButton}
          onClick={handleClose}
          disabled={isSubmitting}
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

        <button type="submit" className={css.submitButton} disabled={!file || isSubmitting}>
          Save
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
