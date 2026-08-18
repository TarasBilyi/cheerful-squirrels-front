import * as Yup from 'yup';
import { EMAIL_REGEX } from '@/lib/utils/validation';

export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .matches(EMAIL_REGEX, 'Invalid email address')
    .max(64, 'Email too long')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password too short')
    .max(64, 'Password too long')
    .required('Password is required'),
});
