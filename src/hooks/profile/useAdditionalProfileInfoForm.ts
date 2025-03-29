import { updateProfile } from '@/app/api/profile/actions';
import { setFormErrors } from '@/helpers/setFormErrors';
import {
  AdditinalProfileInfoContent,
  AdditinalProfileInfoZ,
} from '@/types/profile';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export const useAdditionalProfileInfoForm = () => {
  const hasErrorsRef = useRef<boolean>(false);

  const formMethods = useForm<AdditinalProfileInfoZ>({
    resolver: zodResolver(AdditinalProfileInfoContent),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = formMethods;

  const onSubmit: SubmitHandler<AdditinalProfileInfoZ> = async (formData) => {
    hasErrorsRef.current = false;
    if (!formData.avatarImageFile && !formData.bio) {
      toast.info('No changes were made');
      return;
    }
    const result = await updateProfile(formData);

    if (result.success) {
      toast.success('Profile updated successfully');
    } else {
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
    register,
    formMethods,
    watch,
    hasErrors: hasErrorsRef.current || Object.values(errors).length > 0,
  };
};
