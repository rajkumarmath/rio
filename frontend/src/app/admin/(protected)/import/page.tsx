import ImportForm from "./ImportForm";

export default function AdminImportPage() {
  return (
    <div>
      <h1 className="mb-md">Import Alumni Data</h1>
      
      <div className="card mb-lg">
        <h2 className="mb-sm text-lg">Instructions</h2>
        <ul className="text-secondary" style={{ marginLeft: '1.5rem' }}>
          <li>Upload a CSV or Excel file containing alumni records.</li>
          <li>Maximum file size is 5MB.</li>
          <li>The system will detect duplicates and show you a preview before importing.</li>
        </ul>
      </div>

      <div className="card">
        <ImportForm />
      </div>
    </div>
  );
}
