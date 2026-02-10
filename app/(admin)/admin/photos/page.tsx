import { getPhotos } from "@/shared/lib/photos";
import { AdminPageLayout } from "@/shared/ui/admin-page-layout";
import { PhotoUpload } from "./photo-upload";
import { PhotoList } from "./photo-list";

export const metadata = {
  title: "Photos | Admin",
  description: "Manage choir photos for the photo gallery",
};

export default async function PhotosPage() {
  const photos = await getPhotos();

  return (
    <AdminPageLayout
      breadcrumbs={[{ label: "Photos" }]}
      title="Photo Gallery"
      description="Upload and manage photos for the public website gallery"
    >
      <div className="space-y-8">
        <PhotoUpload />
        <PhotoList initialPhotos={photos} />
      </div>
    </AdminPageLayout>
  );
}
