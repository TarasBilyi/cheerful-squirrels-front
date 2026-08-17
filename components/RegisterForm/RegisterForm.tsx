'use client';

import { useEffect, useRef, useState } from 'react';
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

const DraftAutosave = ({ values }: { values: RegisterFormValues }) => {
  const setDraft = useRegisterDraftStore(state => state.setDraft);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setDraft({ name: values.name, email: values.email, password: values.password });
    }, 400);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [values.name, values.email, values.password, setDraft]);

  return null;
};

const RegisterForm = () => {
  const router = useRouter();
  const draft = useRegisterDraftStore(state => state.draft);
  const setDraft = useRegisterDraftStore(state => state.setDraft);

  const initialValues: RegisterFormValues = {
    name: draft?.name ?? '',
    email: draft?.email ?? '',
    password: draft?.password ?? '',
    repeatPassword: '',
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRepeatPasswordVisible, setIsRepeatPasswordVisible] = useState(false);

  const handleSubmit = (values: RegisterFormValues) => {
    setDraft({ name: values.name, email: values.email, password: values.password });
    router.push('/photo');
  };

  return (
    <div className={css.wrapper}>
      <div className={css.card}>
        <h1 className={css.title}>Register</h1>
        <p className={css.description}>Join our community of mindfulness and wellbeing!</p>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, values }) => (
            <Form className={css.form} noValidate>
              <DraftAutosave values={values} />

              <div className={css.fields}>
                <div className={css.formGroup}>
                  <label htmlFor="name" className={css.label}>
                    Enter your name
                  </label>
                  <div
                    className={`${css.inputWrapper} ${
                      errors.name && touched.name ? css.inputWrapperInvalid : ''
                    }`}
                  >
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
                  <div
                    className={`${css.inputWrapper} ${
                      errors.email && touched.email ? css.inputWrapperInvalid : ''
                    }`}
                  >
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
                  <div
                    className={`${css.inputWrapper} ${
                      errors.password && touched.password ? css.inputWrapperInvalid : ''
                    }`}
                  >
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
                  <div
                    className={`${css.inputWrapper} ${
                      errors.repeatPassword && touched.repeatPassword ? css.inputWrapperInvalid : ''
                    }`}
                  >
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

              <button
                type="submit"
                className={css.submitButton}
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting && <span className={css.spinner} aria-hidden />}
                {isSubmitting ? 'Creating account…' : 'Create account'}
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
    </div>
  );
};

export default RegisterForm;
