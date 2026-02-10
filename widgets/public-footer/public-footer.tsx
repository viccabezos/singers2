import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { getChoirSettings } from "@/shared/lib/settings";

export async function PublicFooter() {
  const settings = await getChoirSettings();
  const hasSocialLinks = settings?.facebook_url || settings?.instagram_url || settings?.youtube_url;

  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Les Chanteurs
            </h3>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              A passionate community choir celebrating the joy of music and harmony.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Navigate
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-zinc-600 transition-colors hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-sm text-zinc-600 transition-colors hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/playlists"
                  className="text-sm text-zinc-600 transition-colors hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
                >
                  Playlists
                </Link>
              </li>
              <li>
                <Link
                  href="/songs"
                  className="text-sm text-zinc-600 transition-colors hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
                >
                  Songs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Contact
            </h3>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              Email: {settings?.contact_email || "contact@leschanteurs.example"}
            </p>
          </div>

          {/* Social Media */}
          {hasSocialLinks && (
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Follow Us
              </h3>
              <div className="mt-4 flex gap-4">
                {settings?.facebook_url && (
                  <a
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-600 transition-colors hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {settings?.instagram_url && (
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-600 transition-colors hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {settings?.youtube_url && (
                  <a
                    href={settings.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-600 transition-colors hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
                    aria-label="YouTube"
                  >
                    <Youtube className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            © {new Date().getFullYear()} Les Chanteurs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
