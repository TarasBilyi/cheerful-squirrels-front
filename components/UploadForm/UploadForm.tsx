'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import css from './UploadForm.module.css';

const UploadForm = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : null);
  };

  return (
    <form
      className={css.card}
      onSubmit={event => {
        event.preventDefault();

        if (!file) {
          return;
        }

        router.push('/');
      }}
    >
      <button type="button" className={css.closeButton} onClick={() => router.back()}>
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

      <button type="submit" className={css.submitButton} disabled={!file}>
        Save
      </button>
    </form>
  );
};

export default UploadForm;
