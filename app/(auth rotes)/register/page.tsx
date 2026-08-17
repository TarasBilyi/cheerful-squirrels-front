import RegisterForm from '@/components/RegisterForm/RegisterForm';
import Container from '@/components/Container/Container';
import RequireGuest from '@/components/RequireGuest/RequireGuest';

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
