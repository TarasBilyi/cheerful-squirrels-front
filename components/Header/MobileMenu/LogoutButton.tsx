'use client';
import css from './MobileMenu.module.css';

// TODO: import { useRouter } from "next/navigation";
// TODO: import { useAuthStore } from "@/store/authStore";
// TODO: import { logout } from "@/api/auth";

interface LogoutButtonProps {
  className?: string;
  onAfterLogout?: () => void;
}

const LogoutButton = ({ className, onAfterLogout }: LogoutButtonProps) => {
  const handleLogout = async () => {
    // await logout();
    // clearIsAuthenticated();
    // router.push("/sign-in");
    onAfterLogout?.();
  };

  return (
    <button type="button" onClick={handleLogout} className={className} aria-label="Log out">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M15 17l5-5-5-5M20 12H9M12 19H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default LogoutButton;
