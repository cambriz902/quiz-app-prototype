type SkeletonLoaderProps = {
  width?: string;
  height?: string;
};

export default function SkeletonLoader({ width = "w-full", height = "h-6" }: SkeletonLoaderProps) {
  return (
    <div className={`${width} ${height} bg-gray-300 animate-pulse rounded-md`} />
  );
}