import { logIn } from '@/app/api/auth/actions';
import { setFormErrors } from '@/helpers/setFormErrors';
import { LogInZ, LogInContent } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export const useLogInForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const hasErrorsRef = useRef<boolean>(false);

  const formMethods = useForm<LogInZ>({
    resolver: zodResolver(LogInContent),
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = formMethods;

  const onSubmit: SubmitHandler<LogInZ> = async (formData) => {
    hasErrorsRef.current = false;
    setIsSubmitting(true);

    const result = await logIn(formData);
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

  const submit = handleSubmit(onSubmit);

  return {
    submit,
    formMethods,
    register,
    hasErrors: hasErrorsRef.current || Object.keys(errors).length,
    isSubmitting,
  };
};
