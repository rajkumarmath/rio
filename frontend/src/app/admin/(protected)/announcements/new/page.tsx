"use client";

import { useActionState, useEffect } from "react";
import { createAnnouncementAction } from "@/app/actions";
import { useRouter } from "next/navigation";

const initialState = {
  error: null as string | null,
  data: null as any,
};

export default function AddAnnouncementPage() {
  const [state, formAction, pending] = useActionState(async (prevState: any, formData: FormData) => {
    return await createAnnouncementAction(formData);
  }, initialState);
  
  const router = useRouter();

  useEffect(() => {
    if (state.data) {
      router.push("/admin/announcements");
      router.refresh();
    }
  }, [state.data, router]);

  return (
    <div>
      <h1 className="mb-md">Create Announcement</h1>
      
      <div className="card" style={{ maxWidth: '600px' }}>
        {state.error && <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '4px' }}>{state.error}</div>}
        
        <form action={formAction} className="flex flex-col gap-md">
          <div>
            <label className="font-semibold mb-xs" style={{ display: 'block' }}>Title *</label>
            <input type="text" name="title" className="input-field" required disabled={pending} />
          </div>
          
          <div>
            <label className="font-semibold mb-xs" style={{ display: 'block' }}>Content *</label>
            <textarea name="content" className="input-field" rows={6} required disabled={pending}></textarea>
          </div>
          
          <div className="flex items-center gap-sm">
            <input type="checkbox" name="is_published" id="is_published" defaultChecked disabled={pending} />
            <label htmlFor="is_published" className="font-semibold">Publish immediately</label>
          </div>
          
          <div className="flex gap-sm mt-sm">
            <button type="submit" className="btn btn-primary" disabled={pending}>
              {pending ? "Saving..." : "Save Announcement"}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => router.back()} disabled={pending}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
