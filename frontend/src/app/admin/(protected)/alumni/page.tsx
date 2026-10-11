import { getAdminAlumni } from "@/lib/adminApi";
import Link from "next/link";
import { redirect } from "next/navigation";
import DeleteButton from "./DeleteButton";

export const instant = false;

export default async function AdminAlumniList({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const page = typeof sp.page === "string" ? parseInt(sp.page) : 1;
  
  let data = null;
  let error = null;

  try {
    data = await getAdminAlumni(page, 20);
  } catch (err: any) {
    if (err.status === 401) {
      redirect("/admin/login");
    }
    error = err.message || "Failed to load alumni.";
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-md">
        <h1>Manage Alumni</h1>
        <Link href="/admin/alumni/new" className="btn btn-primary">Add Alumni</Link>
      </div>

      {error && <div className="card text-center" style={{ color: 'red' }}>{error}</div>}

      {data && data.items.length === 0 && (
        <div className="card text-center text-secondary py-lg">
          No alumni records found in the database.
        </div>
      )}

      {data && data.items.length > 0 && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Phone</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((alumnus: any) => (
                <tr key={alumnus.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{alumnus.first_name} {alumnus.last_name}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{alumnus.email}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{alumnus.phone || 'N/A'}</td>
                  <td style={{ padding: '1rem' }}>
                    <div className="flex gap-xs">
                      <Link href={`/admin/alumni/${alumnus.id}/edit`} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>Edit</Link>
                      <DeleteButton id={alumnus.id} type="alumni" />
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
            <Link href={`/admin/alumni?page=${page - 1}`} className="btn btn-outline">Previous</Link>
          )}
          <span className="btn btn-outline" style={{ pointerEvents: 'none' }}>Page {page} of {data.pages}</span>
          {page < data.pages && (
            <Link href={`/admin/alumni?page=${page + 1}`} className="btn btn-outline">Next</Link>
          )}
        </div>
      )}
    </div>
  );
}
