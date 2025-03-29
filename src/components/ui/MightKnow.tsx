export default function MightKnow() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="mb-4 container-title">People you might know</h3>

      <div className="space-y-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-cyan-500)]/10"></div>
              <div className="flex-1">
                <div className="font-medium text-sm">User Name</div>
                <div className="text-xs text-gray-500">@username</div>
              </div>
              <button className="cursor-pointer text-xs px-3 py-1 rounded-full bg-[var(--color-cyan-500)]/10 text-[var(--color-cyan-500)] hover:bg-[var(--color-cyan-500)] hover:text-white transition-colors">
                Follow
              </button>
            </div>
          ))}
      </div>

      <div className="mt-4">
        <button className="cursor-pointer w-full py-2 text-sm font-medium text-[var(--color-cyan-500)] hover:text-[var(--color-blue-500)] transition-colors">
          Show more
        </button>
      </div>
    </div>
  );
}
