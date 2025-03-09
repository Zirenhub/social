import { signUp } from '@/app/api/auth/actions';
import { SignUpZ, SignUpContent } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { setFormErrors } from '@/helpers/setFormErrors';

// maybe add a check so user is not born in the future?

export const useSignUpForm = () => {
  const router = useRouter();

  const formMethods = useForm<SignUpZ>({
    resolver: zodResolver(SignUpContent),
    defaultValues: {
      day: new Date().getDate(),
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
    },
  });

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    watch,
  } = formMethods;

  const onSubmit: SubmitHandler<SignUpZ> = async (formData) => {
    if (!isSubmitting) {
      const result = await signUp(formData);
      if (result.success) {
        router.replace('/home');
      } else {
        // Display the general error message
        toast.error(result.error.message);
        // If there are field-specific errors, update the form
        setFormErrors(formMethods, result.error);
      }
    }
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
    register,
    getDayOptions,
    formErrors: errors,
    isSubmitting,
  };
};
