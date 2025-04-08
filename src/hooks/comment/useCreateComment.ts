import { createComment } from '@/app/api/comments/actions';
import { setFormErrors } from '@/helpers/setFormErrors';
import {
  CommentContent,
  CommentContentZ,
  MAX_COMMENT_CHARS,
} from '@/types/comment';
import { CACHE_TAGS } from '@/types/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type Props = {
  postId: string;
};

export const useCreateComment = ({ postId }: Props) => {
  const queryClient = useQueryClient();
  const formMethods = useForm<CommentContentZ>({
    resolver: zodResolver(CommentContent),
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

  const onSubmit: SubmitHandler<CommentContentZ> = async (formData) => {
    const result = await createComment({
      content: formData.content,
      postId,
    });
    if (result.success) {
      await queryClient.invalidateQueries({
        queryKey: [CACHE_TAGS.COMMENTS(postId)],
      });
      formMethods.resetField('content', { keepDirty: true, defaultValue: '' });
    } else {
      // Display the general error message
      toast.error(result.error.message);
      // If there are field-specific errors, update the form
      setFormErrors(formMethods, result.error);
    }
  };

  // Character count is directly derived from the content
  const charCount = content.length;
  // Calculate percentage for progress bar

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
    charProps: { charCount, maxChars: MAX_COMMENT_CHARS },
  };
};
