import { getAssociationInfo } from "@/lib/api";

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
        <div className="container card" style={{ marginBottom: 'var(--spacing-md)' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Association Info</h1>
          <p className="text-secondary" style={{ fontSize: '1.2rem', maxWidth: '800px' }}>
            {info?.mission || "Fostering lifelong connections."}
          </p>
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
