import { getAdminAnnouncement } from "@/lib/adminApi";
import EditAnnouncementForm from "./EditAnnouncementForm";
import { notFound } from "next/navigation";

export const instant = false;

export default async function EditAnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let data = null;

  try {
    data = await getAdminAnnouncement(parseInt(id));
  } catch (err: any) {
    if (err.status === 404) {
      notFound();
    }
  }

  if (!data) {
    return <div className="card text-center" style={{ color: 'red' }}>Error loading announcement.</div>;
  }

  return (
    <div>
      <h1 className="mb-md">Edit Announcement</h1>
      <div className="card" style={{ maxWidth: '600px' }}>
        <EditAnnouncementForm initialData={data} />
      </div>
    </div>
  );
}
