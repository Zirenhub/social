import { signUp } from '@/app/api/auth/actions';
import { SignUpZ, SignUpContent } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { setFormErrors } from '@/helpers/setFormErrors';

// maybe add a check so user is not born in the future?

export const useSignUpForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const hasErrorsRef = useRef<boolean>(false);

  const formMethods = useForm<SignUpZ>({
    resolver: zodResolver(SignUpContent),
    defaultValues: {
      day: new Date().getDate(),
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
    },
  });

  const { handleSubmit, register, watch } = formMethods;

  const onSubmit: SubmitHandler<SignUpZ> = async (formData) => {
    hasErrorsRef.current = false;
    setIsSubmitting(true);

    const result = await signUp(formData);

    if (result.success) {
      router.replace('/home');
    } else {
      setIsSubmitting(false);
      // Display the general error message
      toast.error(result.error.message);
      // If there are field-specific errors, update the form
      setFormErrors(formMethods, result.error);
      hasErrorsRef.current = true;
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
    formMethods,
    isSubmitting,
    hasErrors: hasErrorsRef.current,
  };
};
