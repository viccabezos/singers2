import { Mail, Music } from "lucide-react";
import { getChoirSettings } from "@/shared/lib/settings";

export async function CtaSection() {
  const settings = await getChoirSettings();
  const contactEmail = settings?.contact_email || "contact@leschanteurs.example";

  return (
    <section className="bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-900 dark:to-purple-900">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Join Our Musical Journey
          </h2>
          <p className="mt-4 text-lg text-indigo-100 dark:text-indigo-200">
            Whether you want to sing with us or just stay updated on our performances
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-medium text-indigo-600 shadow-lg transition-transform hover:scale-105 hover:shadow-xl dark:bg-zinc-900 dark:text-indigo-400"
            >
              <Mail className="h-5 w-5" />
              Join the Choir
            </a>
            <a
              href="/events"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-6 py-3 text-base font-medium text-white transition-all hover:bg-white hover:text-indigo-600 dark:border-indigo-200 dark:hover:bg-indigo-200 dark:hover:text-indigo-900"
            >
              <Music className="h-5 w-5" />
              View Upcoming Events
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
