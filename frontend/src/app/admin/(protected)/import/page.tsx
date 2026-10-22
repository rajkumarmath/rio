import ImportForm from "./ImportForm";

export default function AdminImportPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-md">
        <h1>Import Alumni Data</h1>
        <div className="flex gap-sm">
          <a
            href="/alumni_import_template.xlsx"
            download="alumni_import_template.xlsx"
            className="btn btn-accent flex items-center gap-xs"
            title="Download blank Excel spreadsheet formatted with required headers"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download Excel Template (.xlsx)
          </a>
          <a
            href="/alumni_import_template.csv"
            download="alumni_import_template.csv"
            className="btn btn-outline flex items-center gap-xs"
            title="Download CSV template"
          >
            Download CSV (.csv)
          </a>
        </div>
      </div>
      
      <div className="card mb-lg">
        <h2 className="mb-sm text-lg">Spreadsheet Guidelines & Supported Columns</h2>
        <p className="text-secondary mb-md">
          Download the pre-formatted Excel template above, paste your department records, and upload it below. The system automatically maps headers and validates records before insertion.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.9rem' }}>
          <div style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.03)' }}>
            <strong>First Name</strong> <span style={{ color: 'red' }}>*</span>
            <div className="text-secondary text-xs">e.g. Aarav</div>
          </div>
          <div style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.03)' }}>
            <strong>Last Name</strong> <span style={{ color: 'red' }}>*</span>
            <div className="text-secondary text-xs">e.g. Sharma</div>
          </div>
          <div style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.03)' }}>
            <strong>Email</strong> <span style={{ color: 'red' }}>*</span>
            <div className="text-secondary text-xs">e.g. aarav@example.com</div>
          </div>
          <div style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.03)' }}>
            <strong>Phone</strong>
            <div className="text-secondary text-xs">e.g. +91 98765 43210</div>
          </div>
          <div style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.03)' }}>
            <strong>Department</strong>
            <div className="text-secondary text-xs">e.g. SCIT</div>
          </div>
          <div style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.03)' }}>
            <strong>Graduation Year</strong>
            <div className="text-secondary text-xs">e.g. 2022</div>
          </div>
          <div style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.03)' }}>
            <strong>Current Company</strong>
            <div className="text-secondary text-xs">e.g. AWS</div>
          </div>
          <div style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.03)' }}>
            <strong>Current Role</strong>
            <div className="text-secondary text-xs">e.g. Senior Cloud Engineer</div>
          </div>
          <div style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.03)' }}>
            <strong>LinkedIn URL</strong>
            <div className="text-secondary text-xs">e.g. linkedin.com/in/...</div>
          </div>
          <div style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.03)' }}>
            <strong>Location</strong>
            <div className="text-secondary text-xs">e.g. Bengaluru, India</div>
          </div>
        </div>
      </div>

      <div className="card">
        <ImportForm />
      </div>
    </div>
  );
}
