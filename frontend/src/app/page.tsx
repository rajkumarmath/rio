import Link from "next/link";
import { getAnnouncements, getAlumni, getAssociationInfo, Announcement } from "@/lib/api";

export const instant = false;

export default async function Home() {
  let recentAnnouncements: Announcement[] = [];
  const stats = { alumni: 0 };
  let mission = "Connecting our global network of graduates.";

  try {
    const data = await getAnnouncements(1, 3);
    recentAnnouncements = data.items || [];
    
    const alumniData = await getAlumni({ size: 1 });
    stats.alumni = alumniData.total || 0;
    
    const assoc = await getAssociationInfo();
    if (assoc.mission) mission = assoc.mission;
  } catch (error) {
    console.error("Failed to load homepage data", error);
  }

  return (
    <div>
      {/* Hero Section */}
      <section style={{ padding: 'var(--spacing-xl) 0', textAlign: 'center' }}>
        <div className="container flex flex-col items-center gap-md">
          <div className="card" style={{ padding: 'var(--spacing-xl) var(--spacing-md)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '900px' }}>
            <h1 style={{ fontSize: '3.5rem', marginBottom: 'var(--spacing-sm)' }}>Welcome to AlumniSphere</h1>
            <p className="text-secondary" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
              {mission}
            </p>
            <div className="flex justify-center gap-md mt-lg">
              <Link href="/alumni" className="btn btn-accent">Explore Directory</Link>
              <Link href="/association" className="btn btn-outline">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Only show if real data exists */}
      {stats.alumni > 0 && (
        <section className="container py-lg text-center">
          <h2 className="mb-md">Our Growing Community</h2>
          <div className="card" style={{ display: 'inline-block', padding: 'var(--spacing-lg)' }}>
            <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--accent-color)' }}>
              {stats.alumni.toLocaleString()}+
            </div>
            <div className="text-secondary font-semibold">Registered Alumni</div>
          </div>
        </section>
      )}

      {/* Recent Announcements */}
      <section className="container py-lg">
        <div className="flex justify-between items-center mb-md">
          <h2>Latest Updates</h2>
          <Link href="/announcements" className="text-sm font-semibold">View All &rarr;</Link>
        </div>
        
        {recentAnnouncements.length === 0 ? (
          <div className="card text-center text-secondary py-lg">
            No announcements available at this time.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-lg">
            {recentAnnouncements.map((announcement) => (
              <div key={announcement.id} className="card flex flex-col justify-between">
                <div>
                  <h3 className="mb-sm" style={{ fontSize: '1.2rem' }}>{announcement.title}</h3>
                  <p className="text-secondary mb-md" style={{ fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {announcement.content}
                  </p>
                </div>
                <Link href={`/announcements/${announcement.id}`} className="text-sm font-semibold">Read More</Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
