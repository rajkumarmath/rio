"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent } from "react";

export default function SearchForm({ initial }: { initial: Record<string, any> }) {
  const router = useRouter();
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    
    for (const [key, value] of formData.entries()) {
      if (value && typeof value === 'string' && value.trim() !== '') {
        params.append(key, value.trim());
      }
    }
    
    router.push(`/alumni?${params.toString()}`);
  };

  const handleReset = () => {
    router.push("/alumni");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-sm">
      <div>
        <label className="text-sm font-semibold mb-xs" style={{ display: 'block' }}>Search Name</label>
        <input type="text" name="q" defaultValue={initial.q || ""} className="input-field" placeholder="E.g., John Doe" />
      </div>
      <div>
        <label className="text-sm font-semibold mb-xs" style={{ display: 'block' }}>Graduation Year</label>
        <input type="number" name="year" defaultValue={initial.year || ""} className="input-field" placeholder="YYYY" />
      </div>
      <div>
        <label className="text-sm font-semibold mb-xs" style={{ display: 'block' }}>Department</label>
        <input type="text" name="department" defaultValue={initial.department || ""} className="input-field" placeholder="E.g., Computer Science" />
      </div>
      <div>
        <label className="text-sm font-semibold mb-xs" style={{ display: 'block' }}>Company</label>
        <input type="text" name="company" defaultValue={initial.company || ""} className="input-field" placeholder="E.g., TechCorp" />
      </div>
      <div>
        <label className="text-sm font-semibold mb-xs" style={{ display: 'block' }}>Designation</label>
        <input type="text" name="designation" defaultValue={initial.designation || ""} className="input-field" placeholder="E.g., Engineer" />
      </div>
      <div>
        <label className="text-sm font-semibold mb-xs" style={{ display: 'block' }}>Location</label>
        <input type="text" name="location" defaultValue={initial.location || ""} className="input-field" placeholder="E.g., Bengaluru" />
      </div>

      <div style={{ marginTop: '0.25rem' }}>
        <label className="flex items-center gap-xs text-sm font-semibold" style={{ cursor: 'pointer' }}>
          <input
            type="checkbox"
            name="is_mentor"
            value="true"
            defaultChecked={initial.is_mentor === "true" || initial.is_mentor === true}
            style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
          />
          <span>Open to Mentor Only</span>
        </label>
      </div>
      
      <div className="flex flex-col gap-sm mt-md">
        <button type="submit" className="btn btn-primary">Apply Filters</button>
        <button type="button" onClick={handleReset} className="btn btn-outline">Clear</button>
      </div>
    </form>
  );
}
