export default function ContainerPlaceholder() {
  return (
    <div className="animate-pulse space-y-3 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  );
}
