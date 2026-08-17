import LoginForm from '@/components/LoginForm/LoginForm';
import Container from '@/components/Container/Container';
import RequireGuest from '@/components/RequireGuest/RequireGuest';

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
