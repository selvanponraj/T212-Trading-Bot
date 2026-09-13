interface LoadingSkeletonProps {
  rows?: number;
}

export function LoadingSkeleton({ rows = 4 }: LoadingSkeletonProps) {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-800 rounded w-1/4" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-800 rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-gray-800 rounded-xl" />
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="bg-red-900/20 border border-red-800 rounded-xl p-6 text-center">
      <p className="text-red-400 mb-3">Failed to load data: {message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 text-sm"
      >
        Retry
      </button>
    </div>
  );
}
