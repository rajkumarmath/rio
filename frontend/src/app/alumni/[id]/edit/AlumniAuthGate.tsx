"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAlumni } from "@/app/actions";

export default function AlumniAuthGate({
  id,
  email,
  name,
}: {
  id: string;
  email?: string;
  name: string;
}) {
  const [state, formAction, isPending] = useActionState(loginAlumni, null);

  return (
    <div className="container py-lg" style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        {/* Security Padlock Header */}
        <div className="text-center mb-lg">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--bg-color)',
              boxShadow: 'var(--neu-flat)',
              color: 'var(--accent-color)',
              marginBottom: '1rem',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>

          <span className="badge-reva-navy mb-xs" style={{ display: 'inline-block' }}>SECURITY &amp; VERIFICATION GATE</span>
          <h1 style={{ fontSize: '1.8rem', marginTop: '0.5rem', color: 'var(--primary-color)' }}>
            Alumni Authentication Required
          </h1>
          <p className="text-secondary text-sm mt-xs">
            This profile belongs to <strong>{name}</strong>. In accordance with university privacy standards, only the verified alumni owner or authorized faculty administrators can edit this record.
          </p>
        </div>

        {state?.error && (
          <div
            className="mb-md text-sm text-center"
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#dc2626',
              fontWeight: 500,
            }}
          >
            {state.error}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-md">
          <input type="hidden" name="redirect" value={`/alumni/${id}/edit`} />

          <div>
            <label className="text-sm font-semibold mb-xs block">Registered Alumni Email</label>
            <input
              type="email"
              name="email"
              required
              defaultValue={email || ""}
              className="input-field"
              placeholder="e.g. name@reva.edu.in"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-xs">
              <label className="text-sm font-semibold block">Password / Passcode</label>
              <span className="text-xs text-secondary">
                First time? Enter any new password to activate
              </span>
            </div>
            <input
              type="password"
              name="password"
              required
              className="input-field"
              placeholder="Enter your alumni password"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="btn btn-accent mt-sm"
            style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem' }}
          >
            {isPending ? "Verifying Credentials..." : "Authenticate & Unlock Profile"}
          </button>
        </form>

        <div className="flex justify-between items-center mt-lg pt-md" style={{ borderTop: '1px solid var(--border-color)' }}>
          <Link href={`/alumni/${id}`} className="text-sm font-semibold text-secondary">
            &larr; Return to Public Profile
          </Link>

          <Link href="/signin" className="text-sm font-semibold" style={{ color: 'var(--accent-color)' }}>
            Switch Role or Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
