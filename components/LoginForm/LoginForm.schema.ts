import * as Yup from 'yup';

export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .max(50, 'Email too long')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password too short')
    .max(64, 'Password too long')
    .required('Password is required'),
});
