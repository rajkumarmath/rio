"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getAlumni, Alumni, getAlumniAvatarUrl } from "@/lib/api";

export default function ClaimProfileClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("email") || searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Alumni[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getAlumni({ q: searchTerm.trim(), size: 20 });
      setResults(res.items || []);
      setSearched(true);
    } catch (err: any) {
      setError(err?.message || "Failed to search profiles");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <div className="container py-lg" style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div className="card mb-lg" style={{ padding: '2.5rem' }}>
        <div className="text-center mb-md">
          <span className="badge-reva-navy mb-xs">ALUMNI ONBOARDING</span>
          <h1 style={{ fontSize: '2.2rem', marginTop: '0.5rem', color: 'var(--primary-color)' }}>
            Claim Your Alumni Profile
          </h1>
          <p className="text-secondary" style={{ maxWidth: '600px', margin: '0.5rem auto 0' }}>
            Find your student/graduation record from REVA University. Once claimed, you can personalize your circular LinkedIn profile picture, current company, and mentorship settings.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-sm mt-md">
          <input
            type="text"
            className="input-field"
            placeholder="Search by your full name or registered email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ fontSize: '1.05rem', padding: '1rem 1.25rem' }}
          />
          <button
            type="submit"
            disabled={loading}
            className="btn btn-accent"
            style={{ padding: '0 2rem', whiteSpace: 'nowrap' }}
          >
            {loading ? "Searching..." : "Find My Record"}
          </button>
        </form>
      </div>

      {/* Results */}
      {error && (
        <div className="card text-center mb-md" style={{ color: '#dc2626' }}>
          {error}
        </div>
      )}

      {loading && (
        <div className="card text-center py-lg text-secondary">
          Searching REVA University Alumni database...
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="card text-center py-lg text-secondary">
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            No matching alumni profile found for &ldquo;{query}&rdquo;.
          </p>
          <p className="text-sm">
            Try searching by only your first name or check with the alumni coordinator at{" "}
            <a href="mailto:alumni@reva.edu.in">alumni@reva.edu.in</a>.
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="flex flex-col gap-md">
          <div className="flex justify-between items-center">
            <h2 style={{ fontSize: '1.25rem' }}>Matching Alumni Records ({results.length})</h2>
            <span className="text-sm text-secondary">Select your profile to claim and update</span>
          </div>

          <div className="grid gap-md">
            {results.map((alumnus) => {
              const avatar = getAlumniAvatarUrl(alumnus);
              const currEmp = alumnus.employment_history?.find((e) => e.is_current) || alumnus.employment_history?.[0];

              return (
                <div
                  key={alumnus.id}
                  className="card flex items-center justify-between"
                  style={{
                    padding: '1.5rem',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div className="flex items-center gap-md">
                    {/* Circular Avatar */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatar}
                      alt={`${alumnus.first_name} ${alumnus.last_name}`}
                      className="avatar-circle"
                      style={{ width: '64px', height: '64px' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(alumnus.first_name + ' ' + alumnus.last_name)}&background=ea580c&color=ffffff&bold=true`;
                      }}
                    />

                    <div>
                      <div className="flex items-center gap-xs">
                        <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
                          {alumnus.first_name} {alumnus.last_name}
                        </h3>
                        {alumnus.is_claimed ? (
                          <span className="badge-claimed">Claimed</span>
                        ) : (
                          <span className="tag" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                            Unclaimed Record
                          </span>
                        )}
                        {alumnus.is_mentor && <span className="badge-mentor">Mentor</span>}
                      </div>

                      <p className="text-secondary text-sm mt-xs">
                        {alumnus.department?.name || "REVA University"}
                        {alumnus.batch?.year ? ` &bull; Class of ${alumnus.batch.year}` : ""}
                      </p>

                      {currEmp && (
                        <div className="flex items-center gap-xs text-sm font-semibold mt-xs" style={{ color: 'var(--primary-color)' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                          <span>{currEmp.title} at {currEmp.company}</span>
                        </div>
                      )}

                      {alumnus.location && (
                        <div className="flex items-center gap-xs text-secondary text-sm mt-xs">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                          <span>{alumnus.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-sm">
                    <Link
                      href={`/alumni/${alumnus.id}`}
                      className="btn btn-outline"
                      style={{ padding: '0.6rem 1.2rem', fontSize: '0.88rem' }}
                    >
                      View Public Card
                    </Link>

                    {alumnus.is_claimed ? (
                      <Link
                        href={`/signin`}
                        className="btn btn-outline"
                        style={{ padding: '0.6rem 1.2rem', fontSize: '0.88rem', color: 'var(--primary-color)' }}
                      >
                        Claimed (Sign In)
                      </Link>
                    ) : (
                      <Link
                        href={`/alumni/${alumnus.id}/edit?claimed=1`}
                        className="btn btn-accent"
                        style={{ padding: '0.6rem 1.4rem', fontSize: '0.88rem' }}
                      >
                        Claim Profile
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
