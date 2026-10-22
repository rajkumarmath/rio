export default function Loading() {
  return (
    <div
      className="container flex flex-col items-center justify-center"
      style={{ minHeight: "55vh", padding: "4rem 1rem", textAlign: "center" }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          border: "4px solid rgba(11, 30, 54, 0.12)",
          borderTop: "4px solid var(--accent-color)",
          borderRadius: "50%",
          animation: "spin 0.85s linear infinite",
          marginBottom: "1.25rem",
        }}
      />
      <div style={{ color: "var(--primary-color)", fontWeight: 600, fontSize: "1.05rem" }}>
        Loading REVA AlumniSphere...
      </div>
      <p className="text-secondary text-sm mt-xs">
        Fetching verified university records and directory updates
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
