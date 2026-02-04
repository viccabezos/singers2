import { PublicHeader } from "@/widgets/public-header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <PublicHeader />
      <div className="pt-0">{children}</div>
    </div>
  );
}
