import Link from "next/link";
import Image from "next/image";
import { getAnnouncements, getAlumni, getAssociationInfo, Announcement } from "@/lib/api";

export const instant = false;

export default async function Home() {
  let recentAnnouncements: Announcement[] = [];
  const stats = { alumni: 0 };
  let mission = "Connecting our global network of graduates from Rukmini Knowledge Park.";

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
              <span className="tag">35,000+ ALUMNI GLOBALLY</span>
            </div>

            <h1 style={{ fontSize: '3.2rem', marginBottom: 'var(--spacing-xs)', color: 'var(--primary-color)' }}>
              Welcome to REVA AlumniSphere
            </h1>
            <p className="text-secondary" style={{ fontSize: '1.2rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.5 }}>
              The official networking and career platform for graduates of Rukmini Knowledge Park. Engage with verified mentors, discover job referrals, and elevate your global professional presence.
            </p>

            <div className="flex justify-center gap-md mt-lg" style={{ flexWrap: 'wrap' }}>
              <Link href="/alumni" className="btn btn-accent" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
                Explore Directory →
              </Link>
              <Link href="/claim-profile" className="btn btn-outline" style={{ padding: '0.85rem 2rem', color: 'var(--accent-color)', fontWeight: 600 }}>
                Claim Your Profile
              </Link>
              <Link href="/mentorship" className="btn btn-outline" style={{ padding: '0.85rem 2rem' }}>
                Find a Mentor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Visual Showcase */}
      <section className="container mb-lg">
        <div className="card" style={{ padding: '0', overflow: 'hidden', position: 'relative', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ position: 'relative', height: '420px', width: '100%' }}>
            <Image
              src="/reva_campus_main.jpg"
              alt="REVA University Rukmini Knowledge Park Campus"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(11, 30, 54, 0.95) 0%, rgba(11, 30, 54, 0.5) 65%, transparent 100%)',
                padding: '2.5rem 2rem',
                color: '#ffffff',
              }}
            >
              <span className="badge-mentor" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                RUKMINI KNOWLEDGE PARK &bull; BENGALURU
              </span>
              <h2 style={{ color: '#ffffff', fontSize: '2rem', margin: '0.25rem 0' }}>
                A World-Class Center of Academic Excellence
              </h2>
              <p style={{ color: '#e2e8f0', maxWidth: '720px', fontSize: '0.98rem', lineHeight: 1.5 }}>
                Home to over 15,000 students and a proud network of 35,000+ alumni across 45+ nations. Equipped with advanced innovation laboratories, moot courts, incubation hubs, and international centers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Role Gateways with Clean Professional SVG Icons */}
      <section className="container mb-lg">
        <div className="text-center mb-md">
          <h2 style={{ fontSize: '1.6rem' }}>Institutional Gateways</h2>
          <p className="text-secondary text-sm">Select your role to access customized university services</p>
        </div>

        <div className="grid grid-cols-4 gap-md" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <Link href="/signin" className="card flex flex-col items-center text-center" style={{ padding: '1.75rem 1rem', cursor: 'pointer' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--bg-color)',
                boxShadow: 'var(--neu-flat)',
                color: 'var(--primary-color)',
                marginBottom: '0.75rem',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-color)' }}>Admin</h3>
            <p className="text-secondary text-sm mt-xs">Data imports, user directory, announcements &amp; audit</p>
          </Link>

          <Link href="/claim-profile" className="card flex flex-col items-center text-center" style={{ padding: '1.75rem 1rem', cursor: 'pointer' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--bg-color)',
                boxShadow: 'var(--neu-flat)',
                color: 'var(--accent-color)',
                marginBottom: '0.75rem',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-color)' }}>Alumni</h3>
            <p className="text-secondary text-sm mt-xs">Claim your record, sync LinkedIn DP, offer mentorship</p>
          </Link>

          <Link href="/signin" className="card flex flex-col items-center text-center" style={{ padding: '1.75rem 1rem', cursor: 'pointer' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--bg-color)',
                boxShadow: 'var(--neu-flat)',
                color: '#2563eb',
                marginBottom: '0.75rem',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.15rem', color: '#2563eb' }}>Faculty</h3>
            <p className="text-secondary text-sm mt-xs">Track departmental graduates, guest talks &amp; research</p>
          </Link>

          <Link href="/mentorship" className="card flex flex-col items-center text-center" style={{ padding: '1.75rem 1rem', cursor: 'pointer' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--bg-color)',
                boxShadow: 'var(--neu-flat)',
                color: '#059669',
                marginBottom: '0.75rem',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.15rem', color: '#059669' }}>Student</h3>
            <p className="text-secondary text-sm mt-xs">Direct outreach on LinkedIn/Gmail for mock interviews &amp; jobs</p>
          </Link>
        </div>
      </section>

      {/* Convocation & Reunion Spotlight */}
      <section className="container mb-lg">
        <div className="card grid gap-lg" style={{ gridTemplateColumns: '1.1fr 1fr', padding: '2rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', height: '280px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <Image
              src="/reva_convocation.jpg"
              alt="REVA Alumni Reunion Convocation"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>

          <div>
            <span className="badge-reva-navy mb-xs" style={{ display: 'inline-block' }}>ANNUAL REUNION &bull; RUAA</span>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-color)', margin: '0.5rem 0' }}>
              REVA Alumni Association (RUAA)
            </h2>
            <p className="text-secondary text-sm" style={{ lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Under the patronship of Chancellor Dr. P. Shyama Raju, RUAA organizes global alumni reunions, international chapter gatherings, career mentoring cohorts, and student scholarship endowments.
            </p>
            <div className="flex gap-sm">
              <Link href="/association" className="btn btn-outline" style={{ fontSize: '0.9rem' }}>
                Learn More About RUAA
              </Link>
              <Link href="/achievers" className="btn btn-accent" style={{ fontSize: '0.9rem' }}>
                View Hall of Fame →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Announcements */}
      <section className="container py-lg">
        <div className="flex justify-between items-center mb-md">
          <h2>Latest University Updates</h2>
          <Link href="/announcements" className="text-sm font-semibold" style={{ color: 'var(--accent-color)' }}>View All →</Link>
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
                <Link href={`/announcements/${announcement.id}`} className="text-sm font-semibold" style={{ color: 'var(--accent-color)' }}>Read More →</Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
