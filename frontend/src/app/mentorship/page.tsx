import Link from "next/link";
import { getAlumni, getAlumniAvatarUrl, Alumni } from "@/lib/api";

export const instant = false;

export default async function MentorshipHubPage() {
  let mentors: Alumni[] = [];
  try {
    const data = await getAlumni({ is_mentor: true, size: 24 });
    mentors = data.items || [];
  } catch (err) {
    console.error("Failed to load mentors:", err);
  }

  const domains = [
    { name: "Software & Artificial Intelligence", count: "120+ Mentors" },
    { name: "Higher Studies & MS Abroad", count: "45+ Mentors" },
    { name: "Core Engineering & VLSI", count: "38+ Mentors" },
    { name: "Civil Services & Public Policy", count: "15+ Mentors" },
    { name: "Product Management & Startups", count: "28+ Mentors" },
  ];

  return (
    <div className="container py-lg">
      {/* Hero Banner */}
      <div className="card mb-lg text-center" style={{ padding: '3rem 1.5rem', background: 'var(--bg-color)' }}>
        <span className="badge-mentor mb-xs" style={{ display: 'inline-block' }}>STUDENT &amp; ALUMNI MENTORSHIP PROGRAM</span>
        <h1 style={{ fontSize: '2.4rem', marginTop: '0.5rem', color: 'var(--primary-color)' }}>
          REVA Alumni Mentorship Hub
        </h1>
        <p className="text-secondary" style={{ maxWidth: '720px', margin: '0.75rem auto 1.5rem', lineHeight: 1.6 }}>
          Connect 1-on-1 with experienced graduates from REVA University. Gain resume reviews, placement insights, interview coaching, and guidance for higher education abroad.
        </p>

        <div className="flex justify-center gap-md" style={{ flexWrap: 'wrap' }}>
          <Link href="/signin" className="btn btn-accent" style={{ padding: '0.75rem 1.8rem' }}>
            Volunteer as a Mentor
          </Link>
          <a href="#mentors-directory" className="btn btn-outline" style={{ padding: '0.75rem 1.8rem' }}>
            Browse All Mentors
          </a>
        </div>
      </div>

      {/* Domain Cards */}
      <div className="mb-lg">
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Mentorship Tracks</h2>
        <div className="grid grid-cols-3 gap-md" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {domains.map((domain, i) => (
            <div key={i} className="card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--primary-color)', marginBottom: '0.35rem' }}>
                {domain.name}
              </h3>
              <p className="text-secondary text-sm">{domain.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Mentors Grid */}
      <div id="mentors-directory">
        <div className="flex justify-between items-center mb-md" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Verified Alumni Mentors</h2>
            <p className="text-secondary text-sm">Graduates open to guiding current students and recent graduates</p>
          </div>
          <Link href="/alumni?is_mentor=true" className="text-sm font-semibold" style={{ color: 'var(--accent-color)' }}>
            View Full Filtered Directory &rarr;
          </Link>
        </div>

        {mentors.length === 0 ? (
          <div className="card text-center text-secondary py-lg">
            No mentors currently available. Check back shortly or volunteer from your profile.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-md">
            {mentors.map((alumnus) => {
              const avatar = getAlumniAvatarUrl(alumnus);
              const currEmp = alumnus.employment_history?.find((e) => e.is_current) || alumnus.employment_history?.[0];

              return (
                <div key={alumnus.id} className="card flex flex-col justify-between" style={{ padding: '1.5rem' }}>
                  <div>
                    <div className="flex items-start gap-md mb-sm">
                      <Link href={`/alumni/${alumnus.id}`} style={{ flexShrink: 0 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={avatar}
                          alt={`${alumnus.first_name} ${alumnus.last_name}`}
                          className="avatar-circle"
                          style={{ width: '60px', height: '60px' }}
                        />
                      </Link>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="flex justify-between items-start">
                          <div>
                            <Link href={`/alumni/${alumnus.id}`}>
                              <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--primary-color)' }}>
                                {alumnus.first_name} {alumnus.last_name}
                              </h3>
                            </Link>
                            <span className="badge-mentor" style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem', marginTop: '0.25rem' }}>
                              Open to Mentor
                            </span>
                          </div>

                          {/* Social logos */}
                          <div className="flex items-center gap-xs">
                            {alumnus.email && (
                              <a
                                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(alumnus.email)}&su=${encodeURIComponent('REVA Mentorship Inquiry')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Contact via Gmail"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '50%',
                                  boxShadow: 'var(--neu-flat)',
                                }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24">
                                  <path fill="#EA4335" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
                                </svg>
                              </a>
                            )}
                            <a
                              href={alumnus.linkedin_url || `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(alumnus.first_name + ' ' + alumnus.last_name + ' REVA University')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Connect on LinkedIn"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                boxShadow: 'var(--neu-flat)',
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                              </svg>
                            </a>
                          </div>
                        </div>

                        {alumnus.department && (
                          <p className="text-sm text-secondary mt-xs">
                            {alumnus.department.name} {alumnus.batch?.year ? `'${alumnus.batch.year.toString().slice(2)}` : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    {currEmp && (
                      <div className="mt-xs pt-xs" style={{ borderTop: '1px solid var(--border-color)' }}>
                        <p className="text-sm font-semibold">{currEmp.title}</p>
                        <p className="text-sm text-secondary">{currEmp.company}</p>
                      </div>
                    )}

                    {alumnus.bio && (
                      <p className="text-secondary text-sm mt-xs" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {alumnus.bio}
                      </p>
                    )}
                  </div>

                  <div className="mt-md pt-xs flex justify-between items-center text-sm">
                    <span className="text-secondary">Free 1-on-1 Guidance</span>
                    <Link href={`/alumni/${alumnus.id}`} className="font-semibold" style={{ color: 'var(--accent-color)' }}>
                      Request Mentorship &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
