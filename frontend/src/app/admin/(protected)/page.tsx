import { getAdminStats } from "@/lib/adminApi";
import Link from "next/link";
import { redirect } from "next/navigation";

export const instant = false;

export default async function AdminDashboard() {
  let stats = null;
  let error = null;

  try {
    stats = await getAdminStats();
  } catch (err: any) {
    if (err.status === 401) {
      redirect("/admin/login");
    }
    error = err.message || "Failed to load dashboard stats.";
  }

  return (
    <div>
      <h1 className="mb-lg">Admin Dashboard</h1>
      
      {error && (
        <div className="card text-center mb-lg" style={{ color: 'red' }}>
          {error}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-2 gap-lg mb-lg">
          <div className="card flex flex-col items-center justify-center py-lg">
            <span style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--primary-color)' }}>{stats.alumni_count}</span>
            <span className="text-secondary font-semibold">Total Alumni</span>
          </div>
          <div className="card flex flex-col items-center justify-center py-lg">
            <span style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--primary-color)' }}>{stats.announcements_count}</span>
            <span className="text-secondary font-semibold">Published Announcements</span>
          </div>
          <div className="card flex flex-col items-center justify-center py-lg">
            <span style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--primary-color)' }}>{stats.departments_count}</span>
            <span className="text-secondary font-semibold">Departments</span>
          </div>
          <div className="card flex flex-col items-center justify-center py-lg">
            <span style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--primary-color)' }}>{stats.batches_count}</span>
            <span className="text-secondary font-semibold">Graduation Batches</span>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="mb-md">Quick Actions</h2>
        <div className="flex gap-sm">
          <Link href="/admin/import" className="btn btn-primary">Import Alumni Data</Link>
          <Link href="/admin/announcements" className="btn btn-accent">Create Announcement</Link>
        </div>
      </div>
    </div>
  );
}
