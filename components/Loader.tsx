export function Loader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
          <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-16 h-6 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
              <div className="w-12 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}