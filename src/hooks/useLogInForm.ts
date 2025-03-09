import { logIn } from '@/app/api/auth/actions';
import { setFormErrors } from '@/helpers/setFormErrors';
import { LogInZ, LogInContent } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation'; // Import useRouter
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export const useLogInForm = () => {
  const router = useRouter();

  const formMethods = useForm<LogInZ>({
    resolver: zodResolver(LogInContent),
  });

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods;

  const onSubmit: SubmitHandler<LogInZ> = async (formData) => {
    const result = await logIn(formData);
    if (result.success) {
      router.replace('/home');
    } else {
      // Display the general error message
      toast.error(result.error.message);
      // If there are field-specific errors, update the form
      setFormErrors(formMethods, result.error);
    }
  };

  const submit = handleSubmit(onSubmit);

  return {
    submit,
    formErrors: errors,
    register,
    isSubmitting: formMethods.formState.isSubmitting,
  };
};
