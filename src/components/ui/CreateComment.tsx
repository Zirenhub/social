'use client';
import LoaderPlaceholder from './LoaderPlaceholder';
import { Send } from 'lucide-react';
import Textarea from './Textarea';
import { useCreateComment } from '@/hooks/comment/useCreateComment';
import Avatar from './Avatar';
import { GetProfileType } from '@/types/profile';

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
  const { submit, formErrors, register, isSubmitting, charProps } =
    useCreateComment({ postId: post.id });

  return (
    <form
      onSubmit={submit}
      className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
    >
      <p className="leading-none text-gray-400 text-sm">
        Replying to{' '}
        <span className="text-[var(--color-cyan-500)]">
          @{post.profile.username}
        </span>
      </p>
      <div className="flex justify-between w-full gap-3 mt-2">
        <Avatar profile={profile} className="h-12 w-12" />
        <Textarea
          register={register}
          className="inset-shadow-xs shadow-none ring-0 inset-ring-0"
          name={'content'}
          charProps={charProps}
          placeholder="What do you have to say about this?"
        />
      </div>

      <div className="flex items-center justify-between mt-2">
        {formErrors?.content && (
          <p className="text-[var(--color-magenta-500)] text-sm">
            {formErrors.content.message}
          </p>
        )}

        <button
          type="submit"
          disabled={
            isSubmitting || charProps.isOverLimit || charProps.charCount <= 0
          }
          className="primary-button p-3"
        >
          {isSubmitting ? (
            <LoaderPlaceholder text="Commenting..." />
          ) : (
            <div className="flex items-center gap-2 disabled:bg-gray-300">
              <span>Comment</span>
              <Send />
            </div>
          )}
        </button>
      </div>
    </form>
  );
}
