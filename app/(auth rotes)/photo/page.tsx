import type { Metadata } from 'next';
import UploadForm from '@/components/UploadForm/UploadForm';
import Container from '@/components/Container/Container';
import RequireGuest from '@/components/RequireGuest/RequireGuest';

export const metadata: Metadata = {
  title: 'Add a profile photo',
  description: 'Add a profile photo to finish setting up your Harmoniq account.',
  robots: {
    index: false,
    follow: true,
  },
};

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
