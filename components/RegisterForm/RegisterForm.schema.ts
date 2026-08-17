import * as Yup from 'yup';
import { EMAIL_REGEX } from '@/lib/utils/validation';

export const RegisterSchema = Yup.object({
  name: Yup.string()
    .transform(value => value?.trim())
    .min(2, 'Name must be at least 2 characters')
    .max(32, 'Name must be at most 32 characters')
    .required('Name is required'),
  email: Yup.string()
    .matches(EMAIL_REGEX, 'Enter a valid email')
    .max(64, 'Email must be at most 64 characters')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(64, 'Password must be at most 64 characters')
    .required('Password is required'),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please repeat your password'),
});
