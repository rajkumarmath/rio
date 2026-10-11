"use client";

import { useState } from "react";
import { importPreviewAction, importExecuteAction } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function ImportForm() {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPreviewData(null);
      setError(null);
      setSuccess(null);
    }
  };

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("file", file);
    
    const res = await importPreviewAction(formData);
    setLoading(false);
    
    if (res?.error) {
      setError(res.error);
    } else {
      setPreviewData(res?.data);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("file", file);
    
    const res = await importExecuteAction(formData);
    setLoading(false);
    
    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess("Import successful! Redirecting...");
      setTimeout(() => {
        router.push("/admin/alumni");
        router.refresh();
      }, 2000);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '4px' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#dcfce3', borderRadius: '4px' }}>{success}</div>}

      <form onSubmit={handlePreview} className="flex gap-md items-end mb-lg">
        <div>
          <label className="font-semibold mb-xs" style={{ display: 'block' }}>Select File (CSV/Excel)</label>
          <input 
            type="file" 
            accept=".csv, .xlsx, .xls"
            onChange={handleFileChange}
            className="input-field" 
            disabled={loading || !!success}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={!file || loading || !!success}>
          {loading ? "Processing..." : "Preview Data"}
        </button>
      </form>

      {previewData && !success && (
        <div className="card" style={{ backgroundColor: 'var(--bg-color)' }}>
          <h3 className="mb-md">Preview Summary</h3>
          <div className="grid grid-cols-3 gap-md mb-md">
            <div>
              <div className="text-sm text-secondary">Total Rows</div>
              <div className="font-semibold text-lg">{previewData.total_rows}</div>
            </div>
            <div>
              <div className="text-sm text-secondary">Valid (Insertable)</div>
              <div className="font-semibold text-lg" style={{ color: 'green' }}>{previewData.valid_count}</div>
            </div>
            <div>
              <div className="text-sm text-secondary">Duplicates</div>
              <div className="font-semibold text-lg" style={{ color: 'red' }}>{previewData.duplicate_count}</div>
            </div>
          </div>
          
          <div className="flex gap-sm">
            <button onClick={handleImport} className="btn btn-accent" disabled={loading}>
              Confirm and Import
            </button>
            <button onClick={() => setPreviewData(null)} className="btn btn-outline" disabled={loading}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
