import { getAnnouncement, Announcement } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";

export const instant = false;

export default async function AnnouncementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  let ann: Announcement | null = null;
  const { id } = await params;
  
  try {
    ann = await getAnnouncement(parseInt(id));
  } catch (err: any) {
    if (err.status === 404) {
      notFound();
    }
  }

  if (!ann) {
    return <div className="container py-lg text-center" style={{ color: 'red' }}>Error loading announcement.</div>;
  }

  return (
    <div className="container py-lg">
      <Link href="/announcements" className="text-sm font-semibold mb-lg" style={{ display: 'inline-block' }}>← Back to Announcements</Link>
      
      <div className="card mt-md" style={{ padding: 'var(--spacing-lg)' }}>
        <h1 className="mb-sm" style={{ fontSize: '2.5rem' }}>{ann.title}</h1>
        
        <div className="flex items-center gap-md mb-lg pb-md text-sm text-secondary" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <span>Posted on {new Date(ann.posted_at).toLocaleDateString()}</span>
          <span>&bull;</span>
          <span>By {ann.author_username || 'Admin'}</span>
        </div>
        
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: '1.1rem' }}>
          {ann.content}
        </div>
      </div>
    </div>
  );
}
