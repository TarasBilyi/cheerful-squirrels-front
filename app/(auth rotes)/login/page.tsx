import type { Metadata } from 'next';
import LoginForm from '@/components/LoginForm/LoginForm';
import Container from '@/components/Container/Container';
import RequireGuest from '@/components/RequireGuest/RequireGuest';

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Log in to your Harmoniq account.',
  robots: {
    index: false,
    follow: true,
  },
};

const LoginPage = () => {
  return (
    <RequireGuest>
      <Container>
        <LoginForm />
      </Container>
    </RequireGuest>
  );
};

export default LoginPage;
