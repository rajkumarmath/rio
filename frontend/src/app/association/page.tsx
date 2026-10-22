import { getAssociationInfo } from "@/lib/api";
import Image from "next/image";

export const instant = false;

export default async function AssociationPage() {
  let info = null;
  let error = null;

  try {
    info = await getAssociationInfo();
  } catch (err) {
    error = "Association information is currently unavailable.";
  }

  return (
    <div>
      <section style={{ padding: 'var(--spacing-lg) 0' }}>
        <div className="container card" style={{ marginBottom: 'var(--spacing-md)', padding: 0, overflow: 'hidden' }}>
          <div style={{ position: 'relative', height: '320px', width: '100%' }}>
            <Image
              src="/reva_convocation.jpg"
              alt="REVA Alumni Association Grand Reunion"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(11, 30, 54, 0.95) 0%, rgba(11, 30, 54, 0.4) 60%, transparent 100%)',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                color: '#ffffff',
              }}
            >
              <span className="badge-mentor" style={{ marginBottom: '0.5rem', alignSelf: 'flex-start' }}>
                REVA ALUMNI ASSOCIATION (RUAA)
              </span>
              <h1 style={{ fontSize: '2.4rem', color: '#ffffff', margin: '0.25rem 0' }}>
                Fostering Lifelong Global Connections
              </h1>
              <p style={{ color: '#e2e8f0', maxWidth: '750px', fontSize: '1rem', lineHeight: 1.5 }}>
                {info?.mission || "Connecting graduates worldwide, supporting student scholarships, and championing alma mater pride across 45+ nations."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-lg">
        {error && <div className="card text-center" style={{ color: 'red' }}>{error}</div>}
        
        {info && (
          <div className="grid gap-lg" style={{ gridTemplateColumns: '2fr 1fr' }}>
            <div>
              <div className="card mb-lg">
                <h2 className="mb-md">Overview</h2>
                <p style={{ color: 'var(--text-secondary)' }}>{info.overview}</p>
              </div>

              <h2 className="mb-md">Key Initiatives</h2>
              <div className="flex flex-col gap-md mb-lg">
                {info.initiatives?.map((init, i) => (
                  <div key={i} className="card">
                    <h3 className="mb-xs" style={{ fontSize: '1.1rem' }}>{init.title}</h3>
                    <p className="text-secondary">{init.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="card mb-lg">
                <h2 className="mb-md" style={{ fontSize: '1.25rem' }}>Contact Us</h2>
                <div className="flex flex-col gap-sm text-sm">
                  <p><strong>Email:</strong> {info.contact_email}</p>
                  <p><strong>Phone:</strong> {info.contact_phone}</p>
                  <p><strong>Address:</strong><br/>{info.address}</p>
                </div>
              </div>

              <div className="card">
                <h2 className="mb-md" style={{ fontSize: '1.25rem' }}>Committee</h2>
                <ul className="flex flex-col gap-sm" style={{ listStyle: 'none' }}>
                  {info.committee_members?.map((member, i) => (
                    <li key={i} className="flex flex-col" style={{ borderBottom: i !== info.committee_members.length -1 ? '1px solid var(--border-color)' : 'none', paddingBottom: i !== info.committee_members.length -1 ? '0.5rem' : 0 }}>
                      <span className="font-semibold">{member.name}</span>
                      <span className="text-secondary text-sm">{member.role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
