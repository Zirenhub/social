import LoaderPlaceholder from "../ui/LoaderPlaceholder";

type DeleteConfirmationModalProps = {
  contentType: string;
  isPending: boolean;
  onCancel: () => void;
  onDelete: () => void;
};

export default function DeleteConfirmationModal({
  contentType,
  isPending,
  onCancel,
  onDelete,
}: DeleteConfirmationModalProps) {
  return (
    <>
      <p className="mb-6 text-[var(--color-dark-500)]/70 dark:text-white/70">
        This action cannot be undone. The {contentType} will be permanently removed from our servers.
      </p>
      {isPending ? (
        <LoaderPlaceholder className="justify-end" />
      ) : (
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onCancel}
            className="cursor-pointer px-4 py-2 text-sm font-medium transition-colors rounded-lg text-[var(--color-dark-500)]/80 dark:text-white/80 hover:bg-[var(--color-dark-500)]/5 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="cursor-pointer px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-[var(--color-magenta-500)] hover:bg-[var(--color-magenta-500)]/90"
          >
            Delete
          </button>
        </div>
      )}
    </>
  );
}
