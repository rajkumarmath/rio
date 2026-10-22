"use client";

import { useState } from "react";
import Link from "next/link";
import { login, loginAlumni } from "@/app/actions";
import { useActionState } from "react";

type Role = "admin" | "alumni" | "faculty" | "student";

export default function SignInPage() {
  const [role, setRole] = useState<Role>("admin");
  const [adminState, adminFormAction, isAdminPending] = useActionState(login, null);
  const [alumniState, alumniFormAction, isAlumniPending] = useActionState(loginAlumni, null);

  // Form states
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [alumniEmail, setAlumniEmail] = useState("");
  const [alumniPassword, setAlumniPassword] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [studentSrn, setStudentSrn] = useState("");
  const [portalMessage, setPortalMessage] = useState<string | null>(null);

  const fillDemoAdmin = () => {
    setAdminUsername("admin");
    setAdminPassword("AdminPass123!");
  };

  const fillDemoAlumni = () => {
    setAlumniEmail("priya.sharma@reva.edu.in");
    setAlumniPassword("RevaAlumni2026!");
  };

  const handleRoleQuickDemo = (roleName: string, destination: string) => {
    setPortalMessage(`Welcome! Authenticated as ${roleName}. Redirecting...`);
    setTimeout(() => {
      window.location.href = destination;
    }, 700);
  };

  return (
    <div className="container py-lg" style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        {/* Header */}
        <div className="text-center mb-lg">
          <span className="badge-reva-navy mb-xs" style={{ display: 'inline-block' }}>REVA UNIVERSITY PORTAL</span>
          <h1 style={{ fontSize: '2.2rem', marginTop: '0.5rem', color: 'var(--primary-color)' }}>
            Sign In to AlumniSphere
          </h1>
          <p className="text-secondary text-sm mt-xs">
            Select your institutional affiliation to access authorized university tools and network resources.
          </p>
        </div>

        {/* 4 Professional Role Switcher Buttons with SVG icons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            background: 'var(--bg-color)',
            padding: '8px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--neu-inset)',
            marginBottom: '2rem',
          }}
        >
          {/* Admin Role Button */}
          <button
            type="button"
            onClick={() => { setRole("admin"); setPortalMessage(null); }}
            style={{
              padding: '0.75rem 0.5rem',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.25s ease',
              background: role === "admin" ? 'var(--primary-color)' : 'transparent',
              color: role === "admin" ? '#ffffff' : 'var(--text-secondary)',
              boxShadow: role === "admin" ? '0 4px 12px rgba(11, 30, 54, 0.3)' : 'none',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>Admin</span>
          </button>

          {/* Alumni Role Button */}
          <button
            type="button"
            onClick={() => { setRole("alumni"); setPortalMessage(null); }}
            style={{
              padding: '0.75rem 0.5rem',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.25s ease',
              background: role === "alumni" ? 'var(--accent-color)' : 'transparent',
              color: role === "alumni" ? '#ffffff' : 'var(--text-secondary)',
              boxShadow: role === "alumni" ? '0 4px 12px rgba(234, 88, 12, 0.35)' : 'none',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
            <span>Alumni</span>
          </button>

          {/* Faculty Role Button */}
          <button
            type="button"
            onClick={() => { setRole("faculty"); setPortalMessage(null); }}
            style={{
              padding: '0.75rem 0.5rem',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.25s ease',
              background: role === "faculty" ? '#2563eb' : 'transparent',
              color: role === "faculty" ? '#ffffff' : 'var(--text-secondary)',
              boxShadow: role === "faculty" ? '0 4px 12px rgba(37, 99, 235, 0.35)' : 'none',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <span>Faculty</span>
          </button>

          {/* Student Role Button */}
          <button
            type="button"
            onClick={() => { setRole("student"); setPortalMessage(null); }}
            style={{
              padding: '0.75rem 0.5rem',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.25s ease',
              background: role === "student" ? '#059669' : 'transparent',
              color: role === "student" ? '#ffffff' : 'var(--text-secondary)',
              boxShadow: role === "student" ? '0 4px 12px rgba(5, 150, 105, 0.35)' : 'none',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Student</span>
          </button>
        </div>

        {portalMessage && (
          <div
            className="mb-md text-center text-sm"
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#047857',
              fontWeight: 600,
            }}
          >
            {portalMessage}
          </div>
        )}

        {/* ROLE 1: ADMIN LOGIN */}
        {role === "admin" && (
          <div>
            <div className="flex justify-between items-center mb-md">
              <h2 style={{ fontSize: '1.25rem' }}>Administrator Sign In</h2>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="btn btn-outline"
                style={{
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.75rem',
                  color: 'var(--accent-color)',
                  borderColor: 'var(--accent-color)',
                }}
              >
                Auto-Fill Demo Admin
              </button>
            </div>

            {adminState?.error && (
              <div
                className="mb-md text-sm text-center"
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#dc2626',
                  fontWeight: 500,
                }}
              >
                {adminState.error}
              </div>
            )}

            <form action={adminFormAction} className="flex flex-col gap-md">
              <div>
                <label className="text-sm font-semibold mb-xs block">Admin Username</label>
                <input
                  type="text"
                  name="username"
                  required
                  className="input-field"
                  placeholder="e.g. admin"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-xs block">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="input-field"
                  placeholder="••••••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isAdminPending}
                className="btn btn-accent mt-sm"
                style={{ width: '100%', padding: '0.9rem' }}
              >
                {isAdminPending ? "Authenticating..." : "Sign In to Admin Dashboard"}
              </button>

              <p className="text-secondary text-sm text-center mt-xs">
                Credentials: <code>admin</code> / <code>AdminPass123!</code>
              </p>
            </form>
          </div>
        )}

        {/* ROLE 2: ALUMNI AUTHENTICATION */}
        {role === "alumni" && (
          <div>
            <div className="flex justify-between items-center mb-md">
              <div>
                <h2 style={{ fontSize: '1.25rem' }}>Alumni Account Login</h2>
                <p className="text-secondary text-sm mt-xs">
                  Sign in with your registered email to edit your career profile and mentorship settings.
                </p>
              </div>
              <button
                type="button"
                onClick={fillDemoAlumni}
                className="btn btn-outline"
                style={{
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.75rem',
                  color: 'var(--accent-color)',
                  borderColor: 'var(--accent-color)',
                  whiteSpace: 'nowrap',
                }}
              >
                Demo Alumnus Fill
              </button>
            </div>

            {alumniState?.error && (
              <div
                className="mb-md text-sm text-center"
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#dc2626',
                  fontWeight: 500,
                }}
              >
                {alumniState.error}
              </div>
            )}

            <form action={alumniFormAction} className="flex flex-col gap-md">
              <div>
                <label className="text-sm font-semibold mb-xs block">Registered Alumni Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="input-field"
                  placeholder="e.g. priya.sharma@reva.edu.in"
                  value={alumniEmail}
                  onChange={(e) => setAlumniEmail(e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-xs">
                  <label className="text-sm font-semibold block">Password</label>
                  <span className="text-xs text-secondary">
                    First time? Enter any new password to activate
                  </span>
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  className="input-field"
                  placeholder="••••••••••••"
                  value={alumniPassword}
                  onChange={(e) => setAlumniPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isAlumniPending}
                className="btn btn-accent mt-xs"
                style={{ width: '100%', padding: '0.9rem' }}
              >
                {isAlumniPending ? "Verifying Credentials..." : "Sign In & Access Profile"}
              </button>

              <div
                style={{
                  margin: '1.25rem 0 0.5rem 0',
                  textAlign: 'center',
                  borderTop: '1px solid var(--border-color)',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    position: 'relative',
                    top: '-0.75rem',
                    background: 'var(--surface-color)',
                    padding: '0 1rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.8rem',
                  }}
                >
                  NEW GRADUATE?
                </span>
              </div>

              <Link
                href="/claim-profile"
                className="btn btn-outline text-center"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderColor: 'var(--accent-color)',
                  color: 'var(--accent-color)',
                  fontWeight: 600,
                  boxShadow: 'var(--neu-flat)',
                }}
              >
                Claim Pre-Imported Profile Record &rarr;
              </Link>
            </form>
          </div>
        )}

        {/* ROLE 3: FACULTY PORTAL */}
        {role === "faculty" && (
          <div>
            <div className="mb-md">
              <h2 style={{ fontSize: '1.25rem' }}>Faculty &amp; Mentor Access</h2>
              <p className="text-secondary text-sm mt-xs">
                Connect with graduates from your school, invite guest speakers, and foster industry collaborations.
              </p>
            </div>

            <div className="flex flex-col gap-md">
              <div>
                <label className="text-sm font-semibold mb-xs block">Faculty Employee ID / Email</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. FAC-CSE-1042 or prof.sharma@reva.edu.in"
                  value={facultyId}
                  onChange={(e) => setFacultyId(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-xs block">School / Department</label>
                <select className="input-field" style={{ cursor: 'pointer' }}>
                  <option>School of Computer Science &amp; Engineering</option>
                  <option>School of Electronics &amp; Communication Engineering</option>
                  <option>School of Mechanical Engineering</option>
                  <option>School of Legal Studies</option>
                  <option>School of Management Studies</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => handleRoleQuickDemo("Faculty Member", "/alumni")}
                className="btn btn-accent mt-xs"
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  background: '#2563eb',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
                }}
              >
                Access Department Alumni Network &rarr;
              </button>
            </div>
          </div>
        )}

        {/* ROLE 4: STUDENT PORTAL */}
        {role === "student" && (
          <div>
            <div className="mb-md">
              <h2 style={{ fontSize: '1.25rem' }}>Student Gateway</h2>
              <p className="text-secondary text-sm mt-xs">
                Directly contact alumni for placement mentorship, resume guidance, and referral opportunities.
              </p>
            </div>

            <div className="flex flex-col gap-md">
              <div>
                <label className="text-sm font-semibold mb-xs block">Student SRN (Student Registration Number)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. R21EN102"
                  value={studentSrn}
                  onChange={(e) => setStudentSrn(e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={() => handleRoleQuickDemo("Student", "/mentorship")}
                className="btn btn-accent mt-xs"
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  background: '#059669',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.4)',
                }}
              >
                Explore Mentorship Hub &amp; Open Roles &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
