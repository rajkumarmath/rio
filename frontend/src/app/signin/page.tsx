"use client";

import { useState } from "react";
import Link from "next/link";
import { login } from "@/app/actions";
import { useActionState } from "react";

type Role = "admin" | "alumni" | "faculty" | "student";

export default function SignInPage() {
  const [role, setRole] = useState<Role>("admin");
  const [state, formAction, isPending] = useActionState(login, null);

  // Demo helpers
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [alumniEmail, setAlumniEmail] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [studentSrn, setStudentSrn] = useState("");
  const [portalMessage, setPortalMessage] = useState<string | null>(null);

  const fillDemoAdmin = () => {
    setAdminUsername("admin");
    setAdminPassword("AdminPass123!");
  };

  const handleAlumniQuickAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alumniEmail) {
      setPortalMessage("Please enter your registered alumni email address.");
      return;
    }
    // Redirect to claim or search profile
    window.location.href = `/claim-profile?email=${encodeURIComponent(alumniEmail)}`;
  };

  const handleRoleQuickDemo = (roleName: string, destination: string) => {
    setPortalMessage(`Welcome! Authenticated as ${roleName}. Redirecting to directory...`);
    setTimeout(() => {
      window.location.href = destination;
    }, 900);
  };

  return (
    <div className="container py-lg" style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        {/* Header */}
        <div className="text-center mb-lg">
          <span className="badge-reva-navy mb-xs">REVA UNIVERSITY PORTAL</span>
          <h1 style={{ fontSize: '2.2rem', marginTop: '0.5rem', color: 'var(--primary-color)' }}>
            Sign In to AlumniSphere
          </h1>
          <p className="text-secondary text-sm mt-xs">
            Select your role to access customized university resources and network tools.
          </p>
        </div>

        {/* 4 Role Switcher Buttons */}
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
              gap: '4px',
              transition: 'all 0.25s ease',
              background: role === "admin" ? 'var(--primary-color)' : 'transparent',
              color: role === "admin" ? '#ffffff' : 'var(--text-secondary)',
              boxShadow: role === "admin" ? '0 4px 12px rgba(11, 30, 54, 0.3)' : 'none',
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>👔</span>
            <span>Admin</span>
          </button>

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
              gap: '4px',
              transition: 'all 0.25s ease',
              background: role === "alumni" ? 'var(--accent-color)' : 'transparent',
              color: role === "alumni" ? '#ffffff' : 'var(--text-secondary)',
              boxShadow: role === "alumni" ? '0 4px 12px rgba(234, 88, 12, 0.35)' : 'none',
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>🎓</span>
            <span>Alumni</span>
          </button>

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
              gap: '4px',
              transition: 'all 0.25s ease',
              background: role === "faculty" ? '#2563eb' : 'transparent',
              color: role === "faculty" ? '#ffffff' : 'var(--text-secondary)',
              boxShadow: role === "faculty" ? '0 4px 12px rgba(37, 99, 235, 0.35)' : 'none',
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>👨‍🏫</span>
            <span>Faculty</span>
          </button>

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
              gap: '4px',
              transition: 'all 0.25s ease',
              background: role === "student" ? '#059669' : 'transparent',
              color: role === "student" ? '#ffffff' : 'var(--text-secondary)',
              boxShadow: role === "student" ? '0 4px 12px rgba(5, 150, 105, 0.35)' : 'none',
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>🎒</span>
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
                  padding: '0.4rem 0.8rem',
                  color: 'var(--accent-color)',
                  borderColor: 'var(--accent-color)',
                }}
              >
                Auto-Fill Demo Admin
              </button>
            </div>

            {state?.error && (
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
                {state.error}
              </div>
            )}

            <form action={formAction} className="flex flex-col gap-md">
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
                disabled={isPending}
                className="btn btn-accent mt-sm"
                style={{ width: '100%', padding: '0.9rem' }}
              >
                {isPending ? "Authenticating..." : "Sign In to Admin Dashboard"}
              </button>

              <p className="text-secondary text-sm text-center mt-xs">
                Credentials: <code>admin</code> / <code>AdminPass123!</code>
              </p>
            </form>
          </div>
        )}

        {/* ROLE 2: ALUMNI PORTAL */}
        {role === "alumni" && (
          <div>
            <div className="mb-md">
              <h2 style={{ fontSize: '1.25rem' }}>Alumni Gateway</h2>
              <p className="text-secondary text-sm mt-xs">
                Update your professional profile, display your LinkedIn DP, or claim your pre-loaded graduation record.
              </p>
            </div>

            <form onSubmit={handleAlumniQuickAccess} className="flex flex-col gap-md">
              <div>
                <label className="text-sm font-semibold mb-xs block">Your Registered Email</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  placeholder="e.g. priya.sharma@reva.edu.in"
                  value={alumniEmail}
                  onChange={(e) => setAlumniEmail(e.target.value)}
                />
              </div>

              <div className="flex gap-sm">
                <button
                  type="submit"
                  className="btn btn-accent"
                  style={{ flex: 1, padding: '0.85rem' }}
                >
                  Find &amp; Update My Profile
                </button>
              </div>

              <div
                style={{
                  margin: '1rem 0',
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
                    fontSize: '0.85rem',
                  }}
                >
                  OR FIRST TIME HERE?
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
                ✨ Claim Your Alumni Profile (Search by Name)
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
                Connect with graduates from your department, arrange technical talks, and mentor current students.
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
                <label className="text-sm font-semibold mb-xs block">Department</label>
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
                Reach out directly to alumni on LinkedIn and Gmail for mentorship, referral requests, and internship opportunities.
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
                onClick={() => handleRoleQuickDemo("Student", "/alumni?is_mentor=true")}
                className="btn btn-accent mt-xs"
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  background: '#059669',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.4)',
                }}
              >
                Find Alumni Mentors &amp; Open Roles &rarr;
              </button>

              <div className="card" style={{ padding: '1rem', background: 'var(--bg-color)', marginTop: '0.5rem' }}>
                <div className="text-sm font-semibold mb-xs" style={{ color: '#047857' }}>
                  💡 Student Tip:
                </div>
                <p className="text-secondary text-sm">
                  Alumni with the <span className="badge-mentor" style={{ transform: 'scale(0.85)', display: 'inline-block' }}>MENTOR</span> badge have volunteered to review student resumes and guide placement preparation.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
