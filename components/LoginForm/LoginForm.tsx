'use client';
import css from './LoginForm.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, LoginRequest } from '@/lib/api/clientApi';
import { ApiError } from '@/lib/api/api';
import { useAuthStore } from '@/lib/store/authStore';
import Link from 'next/link';
import { Formik, Form, Field, FormikHelpers, ErrorMessage } from 'formik';
import { LoginSchema } from './LoginForm.schema';
import toast from 'react-hot-toast';

const initialValues: LoginRequest = {
  email: '',
  password: '',
};

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const setUser = useAuthStore(state => state.setUser);

  const handleSubmit = async (values: LoginRequest, actions: FormikHelpers<LoginRequest>) => {
    try {
      const res = await login(values);

      if (res) {
        setUser(res);
        router.push('/profile');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error(
        (error as ApiError).response?.data?.error ??
          (error as ApiError).message ??
          'Oops... some error'
      );
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div className={css.mainContent}>
      <Formik initialValues={initialValues} validationSchema={LoginSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
        <Form className={css.form}>
          <legend className={css.formTitle}>Login</legend>

          <div className={`${css.formGroup} ${css.formEmail}`}>
            <label htmlFor="email">Enter your email address</label>
            <Field
              id="email"
              type="email"
              name="email"
              className={css.input}
              placeholder="email@gmail.com"
            />
            <ErrorMessage name="email" component="span" className={css.error} />
          </div>

          <div className={`${css.formGroup} ${css.formPassword}`}>
            <label htmlFor="password">Enter a password</label>

            <Field
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              className={css.input}
            />
            <ErrorMessage name="password" component="span" className={css.error} />

            <button
              className={css.eyeButton}
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
            >
              <svg width="24" height="24">
                <use href={`/icons/sprite.svg#${showPassword ? 'eye' : 'eye-crossed'}`} />
              </svg>
            </button>
          </div>

          <div className={css.loginBtn}>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting && <span className={css.spinner} aria-hidden />}
              {isSubmitting ? 'Logging in…' : 'Login'}
            </button>
          </div>

          <div className={css.haveAccount}>
            <p>
              Don’t have an account?{' '}
              <Link href="/register" prefetch={false}>
                Register
              </Link>
            </p>
          </div>
        </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;