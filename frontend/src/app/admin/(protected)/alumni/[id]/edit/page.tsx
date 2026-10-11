import { getAdminAlumniProfile } from "@/lib/adminApi";
import EditAlumniForm from "./EditAlumniForm";
import { notFound } from "next/navigation";

export const instant = false;

export default async function EditAlumniPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let data = null;

  try {
    data = await getAdminAlumniProfile(parseInt(id));
  } catch (err: any) {
    if (err.status === 404) {
      notFound();
    }
  }

  if (!data) {
    return <div className="card text-center" style={{ color: 'red' }}>Error loading profile.</div>;
  }

  return (
    <div>
      <h1 className="mb-md">Edit Alumni</h1>
      <div className="card" style={{ maxWidth: '600px' }}>
        <EditAlumniForm initialData={data} />
      </div>
    </div>
  );
}
