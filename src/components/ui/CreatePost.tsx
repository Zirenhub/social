"use client";

import { ArrowRight } from "lucide-react";

import { useCreatePost } from "@/hooks/post/useCreatePost";
import LoaderPlaceholder from "./LoaderPlaceholder";
import Textarea from "./Textarea";

type Props = {
  onSuccess?: () => void;
};

export default function CreatePost({ onSuccess }: Props) {
  const { submit, formErrors, register, isSubmitting, charProps } = useCreatePost({ onSuccess });

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 h-full">
      <Textarea register={register} name={"content"} charProps={charProps} />

      <div className="flex items-center justify-between">
        {formErrors?.content && <p className="text-[var(--color-magenta-500)] text-sm">{formErrors.content.message}</p>}

        <button
          type="submit"
          disabled={isSubmitting || charProps.charCount > charProps.maxChars}
          className="primary-button px-2 py-1 flex ml-auto"
        >
          {isSubmitting ? (
            <LoaderPlaceholder text="Posting..." />
          ) : (
            <>
              <span>Post</span>
              <ArrowRight />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
