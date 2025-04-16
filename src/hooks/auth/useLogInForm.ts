import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { login } from "@/app/api/auth/actions";
import { setFormErrors } from "@/helpers/setFormErrors";
import { LogInContent, LogInZ } from "@/types/auth";

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

    const result = await login(formData);

    if (result.success) {
      // add to signup
      await getSession();
      router.refresh();
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
