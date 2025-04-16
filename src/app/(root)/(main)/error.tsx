"use client";

// Error boundaries must be Client Components
import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // route to home if not found
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] w-full flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="bg-red-500 p-4">
          <AlertTriangle className="h-12 w-12 text-white mx-auto" />
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Something went wrong!</h2>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
            <p className="text-red-700 dark:text-red-300 text-sm font-medium break-words">{error.message}</p>
            {error.digest && <p className="text-red-500 dark:text-red-400 text-xs mt-2">Error ID: {error.digest}</p>}
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We apologize for the inconvenience. You can try to recover by refreshing the page.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md transition-colors"
            >
              Return to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
