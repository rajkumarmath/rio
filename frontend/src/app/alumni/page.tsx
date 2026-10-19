import Link from "next/link";
import { getAlumni, AlumniPaginatedResponse } from "@/lib/api";
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

  let data: AlumniPaginatedResponse | null = null;
  let error = null;

  try {
    data = await getAlumni({ page, size: 12, q, year, department, company, designation, location });
  } catch (err: any) {
    console.error("Failed to load alumni directory:", err);
    error = err?.message || "Failed to load alumni directory. Please try again later.";
  }

  return (
    <div className="container py-lg">
      <h1 className="mb-md">Alumni Directory</h1>
      
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
                {data.items.map((alumnus) => (
                  <Link href={`/alumni/${alumnus.id}`} key={alumnus.id}>
                    <div className="card flex flex-col justify-between" style={{ height: '100%' }}>
                      <div>
                        <h3 className="mb-sm" style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                          {alumnus.first_name} {alumnus.last_name}
                        </h3>
                        {alumnus.department && <p className="text-sm text-secondary mb-sm">{alumnus.department.name} {alumnus.batch?.year ? `'${alumnus.batch.year.toString().slice(2)}` : ''}</p>}
                        
                        {alumnus.employment_history && alumnus.employment_history.length > 0 && (
                          <div className="mt-sm pt-sm" style={{ borderTop: '1px solid var(--border-color)' }}>
                            <p className="text-sm font-semibold">{alumnus.employment_history[0].title}</p>
                            <p className="text-sm text-secondary">{alumnus.employment_history[0].company}</p>
                          </div>
                        )}
                      </div>
                      
                      {alumnus.location && (
                        <div className="mt-md text-sm text-secondary flex items-center gap-sm">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                          {alumnus.location}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
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
