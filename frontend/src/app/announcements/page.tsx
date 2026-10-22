import Link from "next/link";
import { getAnnouncements, AnnouncementPaginatedResponse } from "@/lib/api";

export const instant = false;

export default async function AnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const page = typeof sp.page === "string" ? parseInt(sp.page) : 1;

  let data: AnnouncementPaginatedResponse | null = null;
  let error = null;

  try {
    data = await getAnnouncements(page, 10);
  } catch (err) {
    error = "Failed to load announcements. Please try again later.";
  }

  return (
    <div className="container py-lg">
      <div className="flex justify-between items-center mb-lg">
        <h1>Announcements</h1>
      </div>

      {error && <div className="card text-center" style={{ color: 'red' }}>{error}</div>}
      
      {data && data.items.length === 0 && !error && (
        <div className="card text-center text-secondary py-lg">
          No announcements published yet.
        </div>
      )}

      {data && data.items.length > 0 && (
        <>
          <div className="flex flex-col gap-md">
            {data.items.map((ann) => (
              <div key={ann.id} className="card">
                <div className="flex justify-between items-start mb-sm">
                  <h2 style={{ fontSize: '1.4rem' }}>
                    <Link href={`/announcements/${ann.id}`} style={{ color: 'var(--primary-color)' }}>
                      {ann.title}
                    </Link>
                  </h2>
                  <span className="text-sm text-secondary whitespace-nowrap">
                    {new Date(ann.posted_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-secondary mb-md" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {ann.content}
                </p>
                <Link href={`/announcements/${ann.id}`} className="text-sm font-semibold">Read Full Announcement →</Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {data.pages > 1 && (
            <div className="flex justify-center gap-sm mt-lg">
              {page > 1 && (
                <Link href={`/announcements?page=${page - 1}`} className="btn btn-outline">Previous</Link>
              )}
              <span className="btn btn-outline" style={{ pointerEvents: 'none' }}>Page {page} of {data.pages}</span>
              {page < data.pages && (
                <Link href={`/announcements?page=${page + 1}`} className="btn btn-outline">Next</Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
