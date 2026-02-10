import { getChoirSettings } from "@/shared/lib/settings";
import { SettingsForm } from "./settings-form";
import { AdminPageLayout } from "@/shared/ui/admin-page-layout";

export const metadata = {
  title: "Settings | Admin",
  description: "Manage choir settings and configuration",
};

export default async function SettingsPage() {
  const settings = await getChoirSettings();

  return (
    <AdminPageLayout
      breadcrumbs={[{ label: "Settings" }]}
      title="Settings"
      description="Manage your choir's website settings and information"
    >
      <SettingsForm initialSettings={settings} />
    </AdminPageLayout>
  );
}
