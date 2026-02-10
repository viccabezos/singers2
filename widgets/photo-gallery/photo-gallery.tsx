import Image from 'next/image';
import { getPhotos } from '@/shared/lib/photos';

function PhotoSkeleton() {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800">
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-zinc-100/60 dark:via-zinc-700/60 to-transparent" />
    </div>
  );
}

export async function PhotoGallery() {
  const photos = await getPhotos();
  const displayPhotos = photos.slice(0, 6); // Show up to 6 photos

  // If no photos, show skeletons as placeholder
  if (displayPhotos.length === 0) {
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
          {displayPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800"
            >
              <Image
                src={photo.image_url}
                alt={photo.caption || 'Choir photo'}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 384px"
              />
              {photo.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-sm text-white">{photo.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
