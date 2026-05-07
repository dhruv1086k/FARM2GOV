// client/src/components/SkeletonCard.jsx
// Reusable skeleton loader card for loading states

export default function SkeletonCard({ className = "" }) {
  return (
    <div
      className={`bg-white/80 rounded-2xl p-6 shadow animate-pulse ${className}`}
    >
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
      <div className="h-3 bg-gray-200 rounded w-2/3 mb-3" />
      <div className="h-8 bg-gray-200 rounded-xl mt-6" />
    </div>
  );
}

/* Skeleton for stat cards */
export function SkeletonStatCard() {
  return (
    <div className="bg-white/80 rounded-2xl p-6 shadow animate-pulse">
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
      <div className="h-8 bg-gray-300 rounded w-2/3 mb-2" />
      <div className="h-2 bg-gray-200 rounded w-1/3" />
    </div>
  );
}

/* Skeleton for table rows */
export function SkeletonTableRow({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-3 px-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}
