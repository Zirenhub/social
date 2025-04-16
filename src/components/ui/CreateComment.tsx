"use client";

import { Send } from "lucide-react";

import { useCreateComment } from "@/hooks/comment/useCreateComment";
import { GetProfileType } from "@/types/profile";
import Avatar from "./Avatar";
import LoaderPlaceholder from "./LoaderPlaceholder";
import Textarea from "./Textarea";

type Props = {
  post: {
    id: string;
    profile: {
      username: string;
    };
  };
  profile: GetProfileType;
};

export default function CreateComment({ post, profile }: Props) {
  const { submit, formErrors, register, isSubmitting, charProps } = useCreateComment({ postId: post.id });

  return (
    <form
      onSubmit={submit}
      className="flex flex-col bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 text-xs md:text-sm md:rounded-lg md:shadow-sm"
    >
      <p className="leading-none text-gray-400 text-sm">
        Replying to <span className="text-[var(--color-cyan-500)]">@{post.profile.username}</span>
      </p>
      <div className="flex justify-between w-full gap-3 mt-2">
        <Avatar profile={profile} className="h-7 w-7" />
        <Textarea
          register={register}
          className="inset-shadow-xs shadow-none ring-0 inset-ring-0"
          name={"content"}
          charProps={charProps}
          placeholder="What do you have to say about this?"
        />
      </div>

      <div className="flex items-center justify-between mt-2">
        {formErrors?.content && <p className="text-[var(--color-magenta-500)] text-sm">{formErrors.content.message}</p>}

        <button
          type="submit"
          disabled={isSubmitting || charProps.charCount > charProps.maxChars || charProps.charCount <= 0}
          className="primary-button py-2 px-2 ml-auto"
        >
          {isSubmitting ? (
            <LoaderPlaceholder text="Commenting..." />
          ) : (
            <div className="flex items-center gap-2 disabled:bg-gray-300">
              <Send size={18} />
              <span>Comment</span>
            </div>
          )}
        </button>
      </div>
    </form>
  );
}
