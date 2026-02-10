function PhotoSkeleton() {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800">
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-zinc-100/60 dark:via-zinc-700/60 to-transparent" />
    </div>
  );
}

export function PhotoGallery() {
  return (
    <section className="bg-white dark:bg-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Our Moments
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Capturing the joy of singing together
          </p>
        </div>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
          <PhotoSkeleton />
          <PhotoSkeleton />
          <PhotoSkeleton />
          <PhotoSkeleton />
          <PhotoSkeleton />
          <PhotoSkeleton />
        </div>
      </div>
    </section>
  );
}
