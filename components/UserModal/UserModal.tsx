'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik';
import toast from 'react-hot-toast';
import { UserProfileSchema } from './UserModal.schema';
import { useAuthStore } from '@/lib/store/authStore';
import { useModalStore } from '@/lib/store/useModalStore';
import { updateAvatar, updateUserProfile } from '@/lib/api/clientApi';
import type { ApiError } from '@/lib/api/api';
import type { User } from '@/types/user';
import Modal, { useModalClose } from '@/components/Modal/Modal';
import css from './UserModal.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';

const resolveAvatarUrl = (avatarUrl?: string): string | null => {
  if (!avatarUrl) return null;
  if (/^https?:\/\//i.test(avatarUrl)) return avatarUrl;
  return `${API_BASE_URL}${avatarUrl.startsWith('/') ? '' : '/'}${avatarUrl}`;
};

interface UserProfileValues {
  name: string;
  email: string;
}

const UserModalContent = () => {
  const close = useModalClose();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const serverAvatarUrl = resolveAvatarUrl(user?.avatarUrl);
  const avatarSrc = previewUrl ?? serverAvatarUrl;

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

  const initialValues: UserProfileValues = {
    name: user?.name ?? '',
    email: user?.email ?? '',
  };

  const handleSubmit = async (
    values: UserProfileValues,
    actions: FormikHelpers<UserProfileValues>
  ) => {
    try {
      let avatarUrl: string | undefined;

      // Avatar first, then name/email — the profile-update response
      // returns the full user record, so persisting the avatar beforehand
      // means that response already reflects the new avatarUrl too.
      if (file) {
        const result = await updateAvatar(file);
        avatarUrl = result.avatarUrl;
      }

      const payload: Partial<UserProfileValues> = {};
      if (values.name !== user?.name) payload.name = values.name;
      if (values.email !== user?.email) payload.email = values.email;

      let updatedUser: User;
      if (Object.keys(payload).length > 0) {
        updatedUser = await updateUserProfile(payload);
      } else if (avatarUrl) {
        updatedUser = { ...(user as User), avatarUrl };
      } else {
        updatedUser = user as User;
      }

      setUser(updatedUser);
      close();
    } catch (error) {
      const status = (error as ApiError).response?.status;
      const message =
        (error as ApiError).response?.data?.error ?? (error as ApiError).message;

      if (status === 409) {
        // Email conflict is specific to that field — surface it inline
        // instead of a generic toast.
        actions.setFieldError('email', message ?? 'Email already in use');
      } else {
        toast.error(message ?? 'Failed to update profile. Please try again.');
      }
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={UserProfileSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className={css.form} noValidate>
          <button
            type="button"
            className={css.closeButton}
            onClick={close}
            disabled={isSubmitting}
            aria-label="Close"
          >
            <svg width={24} height={24} aria-hidden>
              <use href="/icons/sprite.svg#close" />
            </svg>
          </button>

          <h2 className={css.title}>Edit profile</h2>

          <button
            type="button"
            className={css.avatarButton}
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitting}
            aria-label="Change avatar"
          >
            {avatarSrc ? (
              <div className={css.avatarPreviewWrapper}>
                {previewUrl ? (
                  <Image
                    src={avatarSrc}
                    alt="Avatar preview"
                    fill
                    unoptimized
                    className={css.avatarPreview}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element -- домен аватара динамічний (бек)
                  <img src={avatarSrc} alt="Avatar preview" className={css.avatarPreview} />
                )}
                <span className={css.avatarOverlay} aria-hidden>
                  <svg width={24} height={24}>
                    <use href="/icons/sprite.svg#edit" />
                  </svg>
                </span>
              </div>
            ) : (
              <svg width={64} height={58} aria-hidden>
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
            disabled={isSubmitting}
          />

          <div className={css.fields}>
            <div className={css.formGroup}>
              <label htmlFor="user-modal-name" className={css.label}>
                Name
              </label>
              <div
                className={`${css.inputWrapper} ${
                  errors.name && touched.name ? css.inputWrapperInvalid : ''
                }`}
              >
                <Field id="user-modal-name" name="name" type="text" className={css.input} />
              </div>
              <ErrorMessage name="name" component="span" className={css.error} />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="user-modal-email" className={css.label}>
                Email
              </label>
              <div
                className={`${css.inputWrapper} ${
                  errors.email && touched.email ? css.inputWrapperInvalid : ''
                }`}
              >
                <Field id="user-modal-email" name="email" type="email" className={css.input} />
              </div>
              <ErrorMessage name="email" component="span" className={css.error} />
            </div>
          </div>

          <button
            type="submit"
            className={css.submitButton}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting && <span className={css.spinner} aria-hidden />}
            {isSubmitting ? 'Saving…' : 'Save'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

const UserModal = () => {
  const closeModal = useModalStore(state => state.closeModal);

  return (
    <Modal onClose={closeModal} contentClassName={css.modalContent}>
      <UserModalContent />
    </Modal>
  );
};

export default UserModal;
