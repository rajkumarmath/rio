"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("reva_cookie_consent");
      if (!consent) {
        // Small delay to prevent layout shift on initial load
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage may fail in private mode
    }
  }, []);

  const handleConsent = (level: "all" | "essential") => {
    try {
      localStorage.setItem("reva_cookie_consent", level);
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      role="region"
      aria-label="Cookie consent"
      style={{
        position: "fixed",
        bottom: "1.5rem",
        left: "1.5rem",
        right: "1.5rem",
        maxWidth: "680px",
        margin: "0 auto",
        zIndex: 9999,
        background: "var(--primary-color)",
        color: "#ffffff",
        padding: "1.25rem 1.75rem",
        borderRadius: "var(--radius-md)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        display: "flex",
        flexDirection: "column",
        gap: "0.85rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <span
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              color: "var(--accent-color)",
              fontWeight: 700,
              display: "block",
              marginBottom: "0.25rem",
            }}
          >
            Institutional Cookie Notice
          </span>
          <p style={{ fontSize: "0.88rem", lineHeight: 1.5, margin: 0, color: "#e2e8f0" }}>
            REVA AlumniSphere uses strictly necessary authentication cookies to secure your session and maintain directory privacy. No personal data is sold or used for commercial third-party tracking. Learn more in our{" "}
            <Link href="/privacy" style={{ color: "var(--accent-color)", textDecoration: "underline" }}>
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => handleConsent("essential")}
          className="btn btn-outline"
          style={{
            fontSize: "0.82rem",
            padding: "0.45rem 1rem",
            color: "#cbd5e1",
            borderColor: "rgba(255, 255, 255, 0.25)",
            background: "transparent",
            borderRadius: "var(--radius-md)",
          }}
        >
          Essential Only
        </button>

        <button
          type="button"
          onClick={() => handleConsent("all")}
          className="btn btn-accent"
          style={{
            fontSize: "0.82rem",
            padding: "0.45rem 1.25rem",
            borderRadius: "var(--radius-md)",
          }}
        >
          Accept &amp; Continue
        </button>
      </div>
    </aside>
  );
}
