import 'server-only';
import type { User } from '@/types/user';

interface CurrentUser {
  isAuthenticated: boolean;
  user: User | null;
}

// TODO: замінити на реальну перевірку сесії, коли буде готова авторизація.
// Наприклад:
// import { cookies } from "next/headers";
// const token = (await cookies()).get("accessToken")?.value;
// if (!token) return { isAuthenticated: false, user: null };
// const user = await fetchUserByToken(token);
// return { isAuthenticated: true, user };
export const getCurrentUser = async (): Promise<CurrentUser> => {
  return {
    isAuthenticated: true,
    user: { name: 'Taras', email: 'olex@meta.ua', avatarUrl: 'askdjaksdjnajksd' },
  };
};
