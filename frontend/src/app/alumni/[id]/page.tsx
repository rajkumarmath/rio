import { getAlumniProfile, Alumni, getAlumniAvatarUrl } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";

export const instant = false;

export default async function AlumniProfilePage({ params }: { params: Promise<{ id: string }> }) {
  let profile: Alumni | null = null;
  const { id } = await params;
  
  try {
    profile = await getAlumniProfile(parseInt(id));
  } catch (err: any) {
    if (err.status === 404) {
      notFound();
    }
  }

  if (!profile) {
    return <div className="container py-lg text-center" style={{ color: 'red' }}>Error loading profile.</div>;
  }

  const avatarUrl = getAlumniAvatarUrl(profile);

  return (
    <div className="container py-lg">
      <Link href="/alumni" className="text-sm font-semibold mb-lg" style={{ display: 'inline-block' }}>&larr; Back to Directory</Link>
      
      <div className="card mt-md">
        <div className="flex justify-between items-center mb-md" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', flexWrap: 'wrap', gap: '1.25rem' }}>
          {/* Avatar and Identity */}
          <div className="flex items-center gap-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl}
              alt={`${profile.first_name} ${profile.last_name}`}
              className="avatar-circle"
              style={{
                width: '96px',
                height: '96px',
                border: '3.5px solid var(--accent-color)',
              }}
            />

            <div>
              <div className="flex items-center gap-xs" style={{ flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '2.2rem', margin: 0 }}>{profile.first_name} {profile.last_name}</h1>
                {profile.is_mentor && <span className="badge-mentor">Open to Mentor</span>}
                {profile.is_claimed && <span className="badge-claimed">Verified</span>}
              </div>

              {profile.department && (
                <p className="text-secondary" style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>
                  {profile.department.name} {profile.batch?.year ? `'${profile.batch.year.toString().slice(2)}` : ''}
                </p>
              )}

              {profile.location && (
                <div className="text-sm text-secondary flex items-center gap-xs mt-xs">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  {profile.location}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons: Gmail, LinkedIn, Claim/Edit Profile */}
          <div className="flex items-center gap-sm" style={{ flexWrap: 'wrap' }}>
            {profile.email && (
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}&su=${encodeURIComponent('REVA AlumniSphere Connection')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline flex items-center gap-xs"
                title={`Send Email via Gmail to ${profile.email}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.6rem 1.2rem',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: 'var(--neu-flat)',
                  color: '#EA4335',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Send via Gmail
              </a>
            )}

            <a
              href={profile.linkedin_url || `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(profile.first_name + ' ' + profile.last_name + ' REVA University')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline flex items-center gap-xs"
              title="Connect on LinkedIn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.6rem 1.2rem',
                borderRadius: 'var(--radius-full)',
                boxShadow: 'var(--neu-flat)',
                color: '#0A66C2',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              LinkedIn Profile
            </a>

            <Link
              href={`/alumni/${profile.id}/edit${profile.is_claimed ? '' : '?claimed=1'}`}
              className="btn btn-outline flex items-center gap-xs"
              title={profile.is_claimed ? "Edit your profile data" : "Claim this alumni profile"}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.6rem 1.2rem',
                borderRadius: 'var(--radius-full)',
                boxShadow: 'var(--neu-flat)',
                color: 'var(--accent-color)',
                borderColor: 'var(--accent-color)',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              {profile.is_claimed ? "✏️ Edit Profile" : "✨ Claim Profile"}
            </Link>
          </div>
        </div>

        {profile.bio && (
          <div className="mb-lg">
            <h3 className="mb-sm">About</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{profile.bio}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-lg">
          <div>
            <h3 className="mb-md">Experience</h3>
            {profile.employment_history && profile.employment_history.length > 0 ? (
              <div className="flex flex-col gap-md">
                {profile.employment_history.map((job, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="font-semibold">{job.title}</span>
                    <span className="text-secondary">{job.company}</span>
                    <span className="text-sm text-secondary">
                      {job.start_date || 'Unknown'} - {job.is_current ? 'Present' : (job.end_date || 'Unknown')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary text-sm">No experience listed.</p>
            )}
          </div>
          
          <div>
            <h3 className="mb-md">Education</h3>
            {profile.education_history && profile.education_history.length > 0 ? (
              <div className="flex flex-col gap-md">
                {profile.education_history.map((edu, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="font-semibold">{edu.institution}</span>
                    <span className="text-secondary">{edu.degree}, {edu.field_of_study}</span>
                    <span className="text-sm text-secondary">
                      {edu.start_year || ''} {edu.end_year ? `- ${edu.end_year}` : ''}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary text-sm">No education listed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
