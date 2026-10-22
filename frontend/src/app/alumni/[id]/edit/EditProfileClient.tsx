"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getAlumniProfile, getAlumniAvatarUrl, Alumni } from "@/lib/api";
import { updateAlumniProfileAction } from "@/app/actions";

export default function EditProfileClient({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isClaimedFlow = searchParams.get("claimed") === "1";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Alumni | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    isClaimedFlow ? "Profile ownership verified. Complete your details below to update your public alumni card." : null
  );

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isMentor, setIsMentor] = useState(false);
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getAlumniProfile(parseInt(id));
        setProfile(data);
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setPhone(data.phone || "");
        setLocation(data.location || "");
        setBio(data.bio || "");
        setLinkedinUrl(data.linkedin_url || "");
        setAvatarUrl(data.avatar_url || "");
        setIsMentor(Boolean(data.is_mentor));

        const currEmp = data.employment_history?.find((e) => e.is_current) || data.employment_history?.[0];
        if (currEmp) {
          setCompany(currEmp.company || "");
          setTitle(currEmp.title || "");
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load alumni profile");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [id]);

  // Derived live circular avatar preview
  const previewAvatar = getAlumniAvatarUrl({
    avatar_url: avatarUrl,
    linkedin_url: linkedinUrl,
    first_name: firstName,
    last_name: lastName,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await updateAlumniProfileAction(parseInt(id), {
        first_name: firstName,
        last_name: lastName,
        phone,
        location,
        bio,
        linkedin_url: linkedinUrl,
        avatar_url: avatarUrl,
        is_mentor: isMentor,
        company,
        title,
      });

      if (res?.error) {
        setError(res.error);
        return;
      }

      setSuccessMessage("Profile updated successfully. Your career details and profile picture are now live.");
      setTimeout(() => {
        router.refresh();
      }, 500);
    } catch (err: any) {
      setError(err?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-lg text-center text-secondary">
        Loading alumni profile editor...
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="container py-lg text-center" style={{ color: '#dc2626' }}>
        {error}
      </div>
    );
  }

  return (
    <div className="container py-lg" style={{ maxWidth: '820px', margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-md">
        <Link href={`/alumni/${id}`} className="text-sm font-semibold">
          &larr; View Public Profile
        </Link>
        <span className="badge-reva-navy">REVA ALUMNI SPHERE</span>
      </div>

      <div className="card" style={{ padding: '2.5rem' }}>
        {/* Header */}
        <div className="mb-lg">
          <h1 style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>
            Update Profile Information
          </h1>
          <p className="text-secondary text-sm mt-xs">
            Manage your public alumni presence, LinkedIn connection, circular avatar, and mentorship status.
          </p>
        </div>

        {successMessage && (
          <div
            className="mb-md"
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#065f46',
              border: '1px solid #10b981',
              fontWeight: 600,
            }}
          >
            {successMessage}
          </div>
        )}

        {error && (
          <div
            className="mb-md text-sm"
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#dc2626',
              fontWeight: 500,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
          {/* Circular Avatar Preview Section */}
          <div
            className="card"
            style={{
              background: 'var(--bg-color)',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewAvatar}
              alt="Profile Preview"
              className="avatar-circle"
              style={{
                width: '100px',
                height: '100px',
                border: '4px solid var(--accent-color)',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&background=ea580c&color=ffffff&bold=true`;
              }}
            />

            <div style={{ flex: 1, minWidth: '240px' }}>
              <div className="text-sm font-semibold mb-xs" style={{ color: 'var(--primary-color)' }}>
                Circular Profile Picture (Live Preview)
              </div>
              <p className="text-secondary text-sm mb-xs">
                Automatically fetches directly from your LinkedIn profile URL! You can also paste an explicit image URL below if desired.
              </p>
              <div className="flex gap-xs mt-xs">
                {isMentor && <span className="badge-mentor">Open to Mentor</span>}
                <span className="badge-claimed">Verified Alumnus</span>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
              1. Personal Details
            </h3>
            <div className="grid grid-cols-2 gap-md">
              <div>
                <label className="text-sm font-semibold mb-xs block">First Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-xs block">Last Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-xs block">Registered Email (Read-Only)</label>
                <input
                  type="email"
                  disabled
                  className="input-field"
                  value={profile?.email || ""}
                  style={{ opacity: 0.7, cursor: 'not-allowed' }}
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-xs block">Contact Phone Number</label>
                <input
                  type="tel"
                  className="input-field"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-xs block">Location (City, Country)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Bengaluru, India or London, UK"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-xs block">Custom Avatar Image URL (Optional)</label>
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://... (Leave blank to use LinkedIn picture)"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
              2. Career &amp; Professional Socials
            </h3>
            <div className="grid grid-cols-2 gap-md">
              <div>
                <label className="text-sm font-semibold mb-xs block">Current Organization / Company</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Google, Microsoft, Infosys, Startup"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-xs block">Job Title / Designation</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Senior Software Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label className="text-sm font-semibold mb-xs block flex items-center justify-between">
                  <span>LinkedIn Profile URL</span>
                  <span className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: 400 }}>
                    Powers your circular profile picture &amp; 1-click connect button
                  </span>
                </label>
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://www.linkedin.com/in/your-username"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label className="text-sm font-semibold mb-xs block">About / Bio</label>
                <textarea
                  className="input-field"
                  rows={4}
                  placeholder="Share a short summary of your journey since graduating from REVA University..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          {/* Mentorship Settings */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              background: 'var(--bg-color)',
              border: isMentor ? '2px solid #10b981' : '1px solid transparent',
              transition: 'all 0.3s ease',
            }}
          >
            <div className="flex items-start gap-md">
              <input
                type="checkbox"
                id="isMentorCheckbox"
                checked={isMentor}
                onChange={(e) => setIsMentor(e.target.checked)}
                style={{
                  width: '22px',
                  height: '22px',
                  marginTop: '3px',
                  cursor: 'pointer',
                  accentColor: '#10b981',
                }}
              />
              <label htmlFor="isMentorCheckbox" style={{ cursor: 'pointer', flex: 1 }}>
                <div className="flex items-center gap-xs">
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary-color)' }}>
                    Open to Mentoring REVA Students &amp; Young Alumni
                  </span>
                  <span className="badge-mentor">MENTOR BADGE</span>
                </div>
                <p className="text-secondary text-sm mt-xs">
                  Display an &ldquo;Open to Mentor&rdquo; badge on your profile. Current REVA students can reach out to you via LinkedIn/Gmail for career guidance, resume reviews, and placement advice.
                </p>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between mt-sm" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <Link
              href={`/alumni/${id}`}
              className="btn btn-outline"
              style={{ padding: '0.8rem 1.8rem' }}
            >
              Cancel &amp; Return
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-accent"
              style={{ padding: '0.8rem 2.5rem', fontSize: '1rem' }}
            >
              {saving ? "Saving Changes..." : "Save Profile Changes &rarr;"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
