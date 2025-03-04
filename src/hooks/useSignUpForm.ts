'use client';
import { SignUpZ, SignUpContent } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';

export const useSignUpForm = () => {
  const formMethods = useForm<SignUpZ>({
    resolver: zodResolver(SignUpContent),
    defaultValues: {
      day: new Date().getDate(),
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
    },
  });

  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = formMethods;

  const onSubmit: SubmitHandler<SignUpZ> = async (formData) => {
    console.log(formData);
  };

  const submit = handleSubmit(onSubmit);

  return {
    submit,
    formErrors: errors,
    register,
    watch,
  };
};
