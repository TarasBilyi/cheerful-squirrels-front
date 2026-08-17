import UploadForm from '@/components/UploadForm/UploadForm';
import Container from '@/components/Container/Container';
import RequireGuest from '@/components/RequireGuest/RequireGuest';

const UploadPhoto = () => {
  return (
    <RequireGuest>
      <Container>
        <UploadForm />
      </Container>
    </RequireGuest>
  );
};

export default UploadPhoto;
