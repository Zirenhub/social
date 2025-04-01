import { createPost } from '@/app/api/posts/actions';
import { setFormErrors } from '@/helpers/setFormErrors';
import { PostContent, PostContentZ } from '@/types/post';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type Props = {
  onSuccess?: () => void;
};

export const useCreatePost = ({ onSuccess }: Props) => {
  const formMethods = useForm<PostContentZ>({
    resolver: zodResolver(PostContent),
    defaultValues: { content: '' },
    reValidateMode: 'onSubmit',
  });

  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
    clearErrors,
  } = formMethods;

  const content = watch('content');

  const onSubmit: SubmitHandler<PostContentZ> = async (formData) => {
    const result = await createPost({
      content: formData.content,
    });
    if (result.success) {
      formMethods.resetField('content', { keepDirty: true, defaultValue: '' });
      if (onSuccess) onSuccess();
    } else {
      // Display the general error message
      toast.error(result.error.message);
      // If there are field-specific errors, update the form
      setFormErrors(formMethods, result.error);
    }
  };

  // Character count is directly derived from the content
  const charCount = content.length;

  useEffect(() => {
    if (errors.content && charCount > 0) {
      clearErrors('content');
    }
  }, [content, errors, clearErrors, charCount]);

  const submit = handleSubmit(onSubmit);

  return {
    submit,
    formErrors: errors,
    register,
    isSubmitting: formMethods.formState.isSubmitting,
    charCount,
  };
};
