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
      <section style={{ padding: 'var(--spacing-lg) 0 var(--spacing-xl) 0', textAlign: 'center' }}>
        <div className="container flex flex-col items-center gap-md">
          <div className="card" style={{ padding: 'var(--spacing-xl) var(--spacing-md)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '960px' }}>
            <div className="flex justify-center items-center gap-xs mb-sm" style={{ flexWrap: 'wrap' }}>
              <span className="badge-reva-navy">REVA UNIVERSITY</span>
              <span className="badge-mentor">NAAC A+ ACCREDITED</span>
              <span className="tag">35,000+ ALUMNI WORLDWIDE</span>
            </div>

            <h1 style={{ fontSize: '3.2rem', marginBottom: 'var(--spacing-xs)', color: 'var(--primary-color)' }}>
              Welcome to REVA AlumniSphere
            </h1>
            <p className="text-secondary" style={{ fontSize: '1.2rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.5 }}>
              Connecting our global community of graduates from Rukmini Knowledge Park. Engage with verified mentors, discover career referrals, and elevate your network.
            </p>

            <div className="flex justify-center gap-md mt-lg" style={{ flexWrap: 'wrap' }}>
              <Link href="/alumni" className="btn btn-accent" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
                Explore Directory &rarr;
              </Link>
              <Link href="/claim-profile" className="btn btn-outline" style={{ padding: '0.85rem 2rem', color: 'var(--accent-color)', fontWeight: 600 }}>
                ✨ Claim Your Profile
              </Link>
              <Link href="/alumni?is_mentor=true" className="btn btn-outline" style={{ padding: '0.85rem 2rem' }}>
                🤝 Find a Mentor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Role Gateways - Admin, Alumni, Faculty, Student */}
      <section className="container mb-lg">
        <div className="text-center mb-md">
          <h2 style={{ fontSize: '1.6rem' }}>Portal Gateways</h2>
          <p className="text-secondary text-sm">Select your role to access tailored university services</p>
        </div>

        <div className="grid grid-cols-4 gap-md" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <Link href="/signin" className="card flex flex-col items-center text-center" style={{ padding: '1.75rem 1rem', cursor: 'pointer' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👔</div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-color)' }}>Admin</h3>
            <p className="text-secondary text-sm mt-xs">Data imports, user directory, announcements &amp; audit</p>
          </Link>

          <Link href="/claim-profile" className="card flex flex-col items-center text-center" style={{ padding: '1.75rem 1rem', cursor: 'pointer' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎓</div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-color)' }}>Alumni</h3>
            <p className="text-secondary text-sm mt-xs">Claim your record, sync LinkedIn DP, offer mentorship</p>
          </Link>

          <Link href="/signin" className="card flex flex-col items-center text-center" style={{ padding: '1.75rem 1rem', cursor: 'pointer' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👨‍🏫</div>
            <h3 style={{ fontSize: '1.15rem', color: '#2563eb' }}>Faculty</h3>
            <p className="text-secondary text-sm mt-xs">Track departmental graduates, guest talks &amp; research</p>
          </Link>

          <Link href="/alumni?is_mentor=true" className="card flex flex-col items-center text-center" style={{ padding: '1.75rem 1rem', cursor: 'pointer' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎒</div>
            <h3 style={{ fontSize: '1.15rem', color: '#059669' }}>Student</h3>
            <p className="text-secondary text-sm mt-xs">Direct outreach on LinkedIn/Gmail for mock interviews &amp; jobs</p>
          </Link>
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
