import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NewArticle } from '@/types/article';

type ArticleDraftStore = {
  draft: NewArticle;
  setDraft: (article: NewArticle) => void;
  clearDraft: () => void;
};

const initialDraft: NewArticle = {
  title: '',
  article: '',
  img: '',
};

export const useArticleDraftStore = create<ArticleDraftStore>()(
  persist(
    set => ({
      draft: initialDraft,
      setDraft: article => set(() => ({ draft: article })),
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),
    {
      name: 'article-draft',
      partialize: state => ({ draft: state.draft }),
    }
  )
);
