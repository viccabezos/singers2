import { getChoirSettings } from "@/shared/lib/settings";

const DEFAULT_ABOUT_TEXT = `Les Chanteurs is a passionate community choir dedicated to bringing people together through the joy of music. Founded in the heart of our city, we celebrate the power of harmony and the beauty of collective voices.

Whether you're a seasoned singer or just starting your musical journey, our choir welcomes all who share a love for singing. We perform a diverse repertoire ranging from classical pieces to contemporary favorites, creating memorable experiences for both our members and our audiences.

Join us at our upcoming performances and discover the magic of choral music.`;

export async function AboutSection() {
  const settings = await getChoirSettings();
  const aboutText = settings?.about_text || DEFAULT_ABOUT_TEXT;
  
  // Split by double newlines to preserve paragraphs
  const paragraphs = aboutText.split('\n\n').filter(p => p.trim());

  return (
    <section className="bg-white dark:bg-zinc-900">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            About Us
          </h2>
          <div className="mt-6 space-y-4 text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
