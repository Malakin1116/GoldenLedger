import * as Yup from 'yup';

export const RegistrationSchema = () =>
  Yup.object({
    email: Yup.string().email('Invalid Email').required('Email is empty'),
    password: Yup.string()
      .matches(new RegExp(/^.{8,100}$/), {
        message: 'Password must be more than 8 symbols',
      })
      .required('Password is empty'),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref('password'), undefined],
      'Passwords must match',
    ),
  });
