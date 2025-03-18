export default function ErrorParagraph({
  message = 'Something went wrong',
}: {
  message?: string;
}) {
  return (
    <p className="text-red-500 font-semibold text-center py-2 px-4 rounded-md bg-red-100 dark:bg-red-900 dark:text-red-300">
      {message}
    </p>
  );
}
