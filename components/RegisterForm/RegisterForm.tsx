'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useRouter } from 'next/navigation';
import { RegisterSchema } from './RegisterForm.schema';
import { useRegisterDraftStore } from '@/lib/store/registerDraftStore';
import css from './RegisterForm.module.css';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
}

const initialValues: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
  repeatPassword: '',
};

const RegisterForm = () => {
  const router = useRouter();
  const setDraft = useRegisterDraftStore(state => state.setDraft);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRepeatPasswordVisible, setIsRepeatPasswordVisible] = useState(false);

  const handleSubmit = (values: RegisterFormValues) => {
    setDraft({ name: values.name, email: values.email, password: values.password });
    router.push('/photo');
  };

  return (
    <div className={css.card}>
      <h1 className={css.title}>Register</h1>
      <p className={css.description}>Join our community of mindfulness and wellbeing!</p>

      <Formik
        initialValues={initialValues}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={css.form} noValidate>
            <div className={css.fields}>
              <div className={css.formGroup}>
                <label htmlFor="name" className={css.label}>
                  Enter your name
                </label>
                <div className={css.inputWrapper}>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Name"
                    className={css.input}
                  />
                </div>
                <ErrorMessage name="name" component="span" className={css.error} />
              </div>

              <div className={css.formGroup}>
                <label htmlFor="email" className={css.label}>
                  Enter your email address
                </label>
                <div className={css.inputWrapper}>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@gmail.com"
                    className={css.input}
                  />
                </div>
                <ErrorMessage name="email" component="span" className={css.error} />
              </div>

              <div className={css.formGroup}>
                <label htmlFor="password" className={css.label}>
                  Create a strong password
                </label>
                <div className={css.inputWrapper}>
                  <Field
                    id="password"
                    name="password"
                    type={isPasswordVisible ? 'text' : 'password'}
                    className={css.input}
                  />
                  <button
                    type="button"
                    className={css.toggleVisibility}
                    onClick={() => setIsPasswordVisible(prev => !prev)}
                    aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                  >
                    <svg width={24} height={24}>
                      <use
                        href={`/icons/sprite.svg#${isPasswordVisible ? 'eye' : 'eye-crossed'}`}
                      />
                    </svg>
                  </button>
                </div>
                <ErrorMessage name="password" component="span" className={css.error} />
              </div>

              <div className={css.formGroup}>
                <label htmlFor="repeatPassword" className={css.label}>
                  Repeat your password
                </label>
                <div className={css.inputWrapper}>
                  <Field
                    id="repeatPassword"
                    name="repeatPassword"
                    type={isRepeatPasswordVisible ? 'text' : 'password'}
                    className={css.input}
                  />
                  <button
                    type="button"
                    className={css.toggleVisibility}
                    onClick={() => setIsRepeatPasswordVisible(prev => !prev)}
                    aria-label={isRepeatPasswordVisible ? 'Hide password' : 'Show password'}
                  >
                    <svg width={24} height={24}>
                      <use
                        href={`/icons/sprite.svg#${isRepeatPasswordVisible ? 'eye' : 'eye-crossed'}`}
                      />
                    </svg>
                  </button>
                </div>
                <ErrorMessage name="repeatPassword" component="span" className={css.error} />
              </div>
            </div>

            <button type="submit" className={css.submitButton} disabled={isSubmitting}>
              Create account
            </button>
          </Form>
        )}
      </Formik>

      <p className={css.prompt}>
        Already have an account?{' '}
        <Link href="/login" className={css.loginLink}>
          Log in
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
