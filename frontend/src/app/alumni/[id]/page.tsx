import { getAlumniProfile, Alumni } from "@/lib/api";
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

  return (
    <div className="container py-lg">
      <Link href="/alumni" className="text-sm font-semibold mb-lg" style={{ display: 'inline-block' }}>&larr; Back to Directory</Link>
      
      <div className="card mt-md">
        <div className="flex justify-between items-center mb-md" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem' }}>{profile.first_name} {profile.last_name}</h1>
            {profile.department && <p className="text-secondary" style={{ fontSize: '1.1rem' }}>{profile.department.name} {profile.batch?.year ? `'${profile.batch.year.toString().slice(2)}` : ''}</p>}
          </div>
          {profile.location && (
            <div className="tag flex items-center gap-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              {profile.location}
            </div>
          )}
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
