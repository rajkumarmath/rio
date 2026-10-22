import Link from "next/link";
import { getAlumni, AlumniPaginatedResponse, getAlumniAvatarUrl } from "@/lib/api";
import SearchForm from "./SearchForm";
export const instant = false;


export default async function AlumniDirectory({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const page = typeof sp.page === "string" ? parseInt(sp.page) : 1;
  const q = typeof sp.q === "string" ? sp.q : "";
  const year = typeof sp.year === "string" ? sp.year : "";
  const department = typeof sp.department === "string" ? sp.department : "";
  const company = typeof sp.company === "string" ? sp.company : "";
  const designation = typeof sp.designation === "string" ? sp.designation : "";
  const location = typeof sp.location === "string" ? sp.location : "";
  const is_mentor = sp.is_mentor === "true" ? true : undefined;

  let data: AlumniPaginatedResponse | null = null;
  let error = null;

  try {
    data = await getAlumni({ page, size: 12, q, year, department, company, designation, location, ...(is_mentor !== undefined ? { is_mentor } : {}) });
  } catch (err: any) {
    console.error("Failed to load alumni directory:", err);
    error = err?.message || "Failed to load alumni directory. Please try again later.";
  }

  return (
    <div className="container py-lg">
      <div className="flex justify-between items-center mb-md" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem' }}>Alumni Directory</h1>
          <p className="text-secondary text-sm mt-xs">
            Connect directly with verified REVA graduates worldwide via LinkedIn &amp; Gmail.
          </p>
        </div>
        <Link href="/claim-profile" className="btn btn-outline" style={{ color: 'var(--accent-color)', fontWeight: 600 }}>
          ✨ Not Listed or Unclaimed? Claim Profile
        </Link>
      </div>
      
      <div className="grid gap-lg" style={{ gridTemplateColumns: '300px 1fr' }}>
        <aside>
          <div className="card" style={{ position: 'sticky', top: '90px' }}>
            <h2 className="mb-md" style={{ fontSize: '1.25rem' }}>Filters</h2>
            <SearchForm initial={sp} />
          </div>
        </aside>
        
        <main>
          {error && <div className="card text-center" style={{ color: 'red' }}>{error}</div>}
          
          {data && data.items.length === 0 && !error && (
            <div className="card text-center text-secondary py-lg">
              No alumni found matching your criteria.
            </div>
          )}

          {data && data.items.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-md">
                {data.items.map((alumnus) => {
                  const avatarUrl = getAlumniAvatarUrl(alumnus);
                  return (
                    <div key={alumnus.id} className="card flex flex-col justify-between" style={{ height: '100%', padding: '1.25rem' }}>
                      <div>
                        {/* Top Profile Header with Circular DP */}
                        <div className="flex items-start gap-md mb-sm">
                          <Link href={`/alumni/${alumnus.id}`} style={{ flexShrink: 0 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={avatarUrl}
                              alt={`${alumnus.first_name} ${alumnus.last_name}`}
                              className="avatar-circle"
                              style={{ width: '56px', height: '56px' }}
                            />
                          </Link>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="flex justify-between items-start">
                              <div>
                                <Link href={`/alumni/${alumnus.id}`}>
                                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', cursor: 'pointer', margin: 0 }}>
                                    {alumnus.first_name} {alumnus.last_name}
                                  </h3>
                                </Link>
                                <div className="flex items-center gap-xs mt-xs" style={{ flexWrap: 'wrap' }}>
                                  {alumnus.is_mentor && <span className="badge-mentor" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>Mentor</span>}
                                  {alumnus.is_claimed && <span className="badge-claimed" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>Verified</span>}
                                </div>
                              </div>

                              {/* Direct Social Connecting Logos */}
                              <div className="flex items-center gap-xs" style={{ flexShrink: 0 }}>
                                {alumnus.email && (
                                  <a
                                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(alumnus.email)}&su=${encodeURIComponent('REVA AlumniSphere Connection')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={`Send Email to ${alumnus.first_name} via Gmail`}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      width: '32px',
                                      height: '32px',
                                      borderRadius: '50%',
                                      boxShadow: 'var(--neu-flat)',
                                    }}
                                  >
                                    <svg width="17" height="17" viewBox="0 0 24 24">
                                      <path fill="#EA4335" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
                                    </svg>
                                  </a>
                                )}
                                <a
                                  href={alumnus.linkedin_url || `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(alumnus.first_name + ' ' + alumnus.last_name + ' REVA University')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={`Connect with ${alumnus.first_name} on LinkedIn`}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    boxShadow: 'var(--neu-flat)',
                                  }}
                                >
                                  <svg width="17" height="17" viewBox="0 0 24 24" fill="#0A66C2">
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
                        
                        {alumnus.employment_history && alumnus.employment_history.length > 0 && (
                          <div className="mt-xs pt-xs" style={{ borderTop: '1px solid var(--border-color)' }}>
                            <p className="text-sm font-semibold">{alumnus.employment_history[0].title}</p>
                            <p className="text-sm text-secondary">{alumnus.employment_history[0].company}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-md pt-xs flex justify-between items-center text-sm text-secondary">
                        {alumnus.location ? (
                          <div className="flex items-center gap-xs">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            {alumnus.location}
                          </div>
                        ) : <span />}

                        <Link href={`/alumni/${alumnus.id}`} className="font-semibold text-sm" style={{ color: 'var(--accent-color)' }}>
                          View Profile &rarr;
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {data.pages > 1 && (
                <div className="flex justify-center gap-sm mt-lg">
                  {page > 1 && (
                    <Link href={`/alumni?page=${page - 1}`} className="btn btn-outline">Previous</Link>
                  )}
                  <span className="btn btn-outline" style={{ pointerEvents: 'none' }}>Page {page} of {data.pages}</span>
                  {page < data.pages && (
                    <Link href={`/alumni?page=${page + 1}`} className="btn btn-outline">Next</Link>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
