import type { Metadata } from 'next';
import RegisterForm from '@/components/RegisterForm/RegisterForm';
import Container from '@/components/Container/Container';
import RequireGuest from '@/components/RequireGuest/RequireGuest';

export const metadata: Metadata = {
  title: 'Sign up',
  description: 'Create a free Harmoniq account to read and publish articles.',
  robots: {
    index: false,
    follow: true,
  },
};

const RegisterPage = () => {
  return (
    <RequireGuest>
      <Container>
        <RegisterForm />
      </Container>
    </RequireGuest>
  );
};

export default RegisterPage;
