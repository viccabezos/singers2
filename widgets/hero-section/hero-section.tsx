import { getChoirSettings } from "@/shared/lib/settings";

export async function HeroSection() {
  const settings = await getChoirSettings();
  const tagline = settings?.tagline || "Voices united in harmony, hearts connected through song";

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/30 dark:via-zinc-900 dark:to-purple-950/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl lg:text-6xl">
            Les Chanteurs
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl lg:text-2xl">
            {tagline}
          </p>
        </div>
      </div>
    </section>
  );
}
