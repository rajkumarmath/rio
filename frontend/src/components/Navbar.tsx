"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 100, backgroundColor: "var(--bg-color)" }}>
      <div
        className="container flex justify-between items-center"
        style={{ minHeight: "88px", padding: "0.75rem 1rem" }}
      >
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-sm"
          style={{
            fontSize: "1.45rem",
            fontWeight: 700,
            color: "var(--primary-color)",
            textDecoration: "none",
          }}
        >
          <Image
            src="/logo.png"
            alt="REVA University Official Crest"
            width={72}
            height={72}
            style={{ objectFit: "contain" }}
            priority
          />
          <span style={{ letterSpacing: "-0.5px" }}>REVA AlumniSphere</span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="desktop-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/alumni"
            className="btn btn-outline"
            style={{ padding: "0.5rem 0.95rem", fontSize: "0.88rem" }}
          >
            Directory
          </Link>
          <Link
            href="/mentorship"
            className="btn btn-outline"
            style={{ padding: "0.5rem 0.95rem", fontSize: "0.88rem" }}
          >
            Mentorship
          </Link>
          <Link
            href="/achievers"
            className="btn btn-outline"
            style={{ padding: "0.5rem 0.95rem", fontSize: "0.88rem" }}
          >
            Achievers
          </Link>
          <Link
            href="/opportunities"
            className="btn btn-outline"
            style={{ padding: "0.5rem 0.95rem", fontSize: "0.88rem" }}
          >
            Careers
          </Link>
          <Link
            href="/services"
            className="btn btn-outline"
            style={{ padding: "0.5rem 0.95rem", fontSize: "0.88rem" }}
          >
            Services
          </Link>
          <Link
            href="/signin"
            className="btn btn-accent"
            style={{ padding: "0.55rem 1.25rem", fontSize: "0.88rem" }}
          >
            Sign In
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mobile-toggle"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          style={{
            display: "none",
            background: "transparent",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            padding: "0.6rem",
            cursor: "pointer",
            color: "var(--primary-color)",
          }}
        >
          {mobileOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div
          className="mobile-menu"
          style={{
            backgroundColor: "var(--surface-color)",
            borderTop: "1px solid var(--border-color)",
            padding: "1rem",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <Link
              href="/alumni"
              onClick={() => setMobileOpen(false)}
              className="btn btn-outline"
              style={{ width: "100%", justifyContent: "flex-start", padding: "0.75rem 1rem" }}
            >
              Alumni Directory
            </Link>
            <Link
              href="/mentorship"
              onClick={() => setMobileOpen(false)}
              className="btn btn-outline"
              style={{ width: "100%", justifyContent: "flex-start", padding: "0.75rem 1rem" }}
            >
              Mentorship Hub
            </Link>
            <Link
              href="/achievers"
              onClick={() => setMobileOpen(false)}
              className="btn btn-outline"
              style={{ width: "100%", justifyContent: "flex-start", padding: "0.75rem 1rem" }}
            >
              Hall of Fame
            </Link>
            <Link
              href="/opportunities"
              onClick={() => setMobileOpen(false)}
              className="btn btn-outline"
              style={{ width: "100%", justifyContent: "flex-start", padding: "0.75rem 1rem" }}
            >
              Career Board
            </Link>
            <Link
              href="/services"
              onClick={() => setMobileOpen(false)}
              className="btn btn-outline"
              style={{ width: "100%", justifyContent: "flex-start", padding: "0.75rem 1rem" }}
            >
              Alumni Services Desk
            </Link>
            <Link
              href="/claim-profile"
              onClick={() => setMobileOpen(false)}
              className="btn btn-outline"
              style={{ width: "100%", justifyContent: "flex-start", padding: "0.75rem 1rem", color: "var(--accent-color)" }}
            >
              Claim Your Profile Record
            </Link>
            <Link
              href="/signin"
              onClick={() => setMobileOpen(false)}
              className="btn btn-accent"
              style={{ width: "100%", textAlign: "center", padding: "0.75rem 1rem" }}
            >
              Sign In to Portal
            </Link>
          </nav>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
}
