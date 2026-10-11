import { getAnnouncements } from "@/lib/api";
import Link from "next/link";
import { redirect } from "next/navigation";
import DeleteButton from "../alumni/DeleteButton";

export const instant = false;

export default async function AdminAnnouncementsList({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const page = typeof sp.page === "string" ? parseInt(sp.page) : 1;
  
  let data = null;
  let error = null;

  try {
    data = await getAnnouncements(page, 20);
  } catch (err: any) {
    error = err.message || "Failed to load announcements.";
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-md">
        <h1>Manage Announcements</h1>
        <Link href="/admin/announcements/new" className="btn btn-primary">Create New</Link>
      </div>

      {error && <div className="card text-center" style={{ color: 'red' }}>{error}</div>}

      {data && data.items.length === 0 && (
        <div className="card text-center text-secondary py-lg">
          No announcements found.
        </div>
      )}

      {data && data.items.length > 0 && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem' }}>Title</th>
                <th style={{ padding: '1rem' }}>Date</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((ann: any) => (
                <tr key={ann.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{ann.title}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{new Date(ann.posted_at).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <div className="flex gap-xs">
                      <Link href={`/admin/announcements/${ann.id}/edit`} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>Edit</Link>
                      <DeleteButton id={ann.id} type="announcement" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {data && data.pages > 1 && (
        <div className="flex justify-center gap-sm mt-lg">
          {page > 1 && (
            <Link href={`/admin/announcements?page=${page - 1}`} className="btn btn-outline">Previous</Link>
          )}
          <span className="btn btn-outline" style={{ pointerEvents: 'none' }}>Page {page} of {data.pages}</span>
          {page < data.pages && (
            <Link href={`/admin/announcements?page=${page + 1}`} className="btn btn-outline">Next</Link>
          )}
        </div>
      )}
    </div>
  );
}
