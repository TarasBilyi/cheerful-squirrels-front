import * as Yup from 'yup';

export const UserProfileSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(32, 'Name must be at most 32 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Enter a valid email')
    .max(64, 'Email must be at most 64 characters')
    .required('Email is required'),
});
