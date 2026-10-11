export default function CategoryLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-pulse">
      {/* Category Header Skeleton */}
      <div className="h-10 bg-base-300 rounded w-1/3 mb-6"></div>

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="border border-base-200 p-4 rounded-xl space-y-4 shadow-sm"
          >
            <div className="w-full h-48 bg-base-300 rounded-lg"></div>
            <div className="h-4 bg-base-300 rounded w-3/4"></div>
            <div className="h-4 bg-base-300 rounded w-1/2"></div>
            <div className="h-10 bg-base-300 rounded-lg w-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
