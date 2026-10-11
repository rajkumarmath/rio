import Link from "next/link";
import { logout } from "@/app/actions";

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container py-lg">
      <div className="grid gap-lg" style={{ gridTemplateColumns: '250px 1fr' }}>
        <aside>
          <div className="card flex flex-col gap-sm" style={{ position: 'sticky', top: '90px' }}>
            <h2 className="mb-md" style={{ fontSize: '1.25rem' }}>Admin Menu</h2>
            <Link href="/admin" className="font-semibold p-2 rounded hover:bg-gray-100" style={{ padding: '0.5rem', display: 'block', borderRadius: '4px' }}>Dashboard</Link>
            <Link href="/admin/alumni" className="font-semibold p-2 rounded" style={{ padding: '0.5rem', display: 'block', borderRadius: '4px' }}>Alumni Management</Link>
            <Link href="/admin/announcements" className="font-semibold p-2 rounded" style={{ padding: '0.5rem', display: 'block', borderRadius: '4px' }}>Announcements</Link>
            <Link href="/admin/import" className="font-semibold p-2 rounded" style={{ padding: '0.5rem', display: 'block', borderRadius: '4px' }}>Import Data</Link>
            
            <hr style={{ margin: '1rem 0', borderColor: 'var(--border-color)' }} />
            
            <form action={logout}>
              <button type="submit" className="btn btn-outline" style={{ width: '100%' }}>Logout</button>
            </form>
          </div>
        </aside>
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
