import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { createPost } from "@/app/api/posts/actions";
import { setFormErrors } from "@/helpers/setFormErrors";
import { CACHE_TAGS, HOME_PAGE_POSTS_FILTERS, PROFILE_PAGE_POSTS_FILTERS } from "@/types/constants";
import { MAX_POST_CHARS, PostContent, PostContentZ } from "@/types/post";

type Props = {
  onSuccess?: () => void;
};

export const useCreatePost = ({ onSuccess }: Props) => {
  const queryClient = useQueryClient();
  const formMethods = useForm<PostContentZ>({
    resolver: zodResolver(PostContent),
    defaultValues: { content: "" },
    reValidateMode: "onSubmit",
  });

  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
    clearErrors,
  } = formMethods;

  const content = watch("content");

  const onSubmit: SubmitHandler<PostContentZ> = async (formData) => {
    const result = await createPost({
      content: formData.content,
    });
    if (result.success) {
      await queryClient.invalidateQueries({
        queryKey: [CACHE_TAGS.POSTS, PROFILE_PAGE_POSTS_FILTERS[0]],
      });
      await queryClient.invalidateQueries({
        queryKey: [CACHE_TAGS.POSTS, HOME_PAGE_POSTS_FILTERS[0]],
      });
      if (onSuccess) onSuccess();
      formMethods.resetField("content", { keepDirty: true, defaultValue: "" });
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
      clearErrors("content");
    }
  }, [content, errors, clearErrors, charCount]);

  const submit = handleSubmit(onSubmit);

  return {
    submit,
    formErrors: errors,
    register,
    isSubmitting: formMethods.formState.isSubmitting,
    charProps: { charCount, maxChars: MAX_POST_CHARS },
  };
};
