'use client';
import { SignUpZ, SignUpContent } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

// maybe add a check so user is not born in the future?

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

  const watchMonth = watch('month');
  const watchYear = watch('year');

  const getDayOptions = useCallback(() => {
    const daysInMonth = new Date(watchYear, watchMonth + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [watchMonth, watchYear]);

  useEffect(() => {
    if (Number(formMethods.getValues('day')) > getDayOptions().length) {
      formMethods.setValue('day', getDayOptions().length);
    }
  }, [watchMonth, watchYear, formMethods, getDayOptions]);

  const submit = handleSubmit(onSubmit);

  return {
    submit,
    formErrors: errors,
    register,
    getDayOptions,
    formMethods,
  };
};
