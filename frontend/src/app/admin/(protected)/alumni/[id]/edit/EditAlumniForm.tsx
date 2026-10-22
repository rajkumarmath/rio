"use client";

import { useActionState, useEffect } from "react";
import { editAlumniAction } from "@/app/actions";
import { useRouter } from "next/navigation";

const initialState = {
  error: null as string | null,
  data: null as any,
};

export default function EditAlumniForm({ initialData }: { initialData: any }) {
  const [state, formAction, pending] = useActionState(async (prevState: any, formData: FormData) => {
    return await editAlumniAction(initialData.id, formData);
  }, initialState);
  
  const router = useRouter();

  useEffect(() => {
    if (state.data) {
      router.push("/admin/alumni");
      router.refresh();
    }
  }, [state.data, router]);

  return (
    <form action={formAction} className="flex flex-col gap-md">
      {state.error && <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '4px' }}>{state.error}</div>}
      
      <div className="grid grid-cols-2 gap-sm">
        <div>
          <label className="font-semibold mb-xs" style={{ display: 'block' }}>First Name *</label>
          <input type="text" name="first_name" className="input-field" defaultValue={initialData.first_name} required disabled={pending} />
        </div>
        <div>
          <label className="font-semibold mb-xs" style={{ display: 'block' }}>Last Name *</label>
          <input type="text" name="last_name" className="input-field" defaultValue={initialData.last_name} required disabled={pending} />
        </div>
      </div>
      
      <div>
        <label className="font-semibold mb-xs" style={{ display: 'block' }}>Email *</label>
        <input type="email" name="email" className="input-field" defaultValue={initialData.email} required disabled={pending} />
      </div>
      
      <div>
        <label className="font-semibold mb-xs" style={{ display: 'block' }}>Phone</label>
        <input type="text" name="phone" className="input-field" defaultValue={initialData.phone || ""} disabled={pending} />
      </div>
      
      <div>
        <label className="font-semibold mb-xs" style={{ display: 'block' }}>Location</label>
        <input type="text" name="location" className="input-field" defaultValue={initialData.location || ""} disabled={pending} />
      </div>

      <div>
        <label className="font-semibold mb-xs" style={{ display: 'block' }}>LinkedIn Profile URL</label>
        <input type="url" name="linkedin_url" className="input-field" defaultValue={initialData.linkedin_url || ""} placeholder="https://www.linkedin.com/in/username" disabled={pending} />
      </div>
      
      <div>
        <label className="font-semibold mb-xs" style={{ display: 'block' }}>Bio</label>
        <textarea name="bio" className="input-field" rows={4} defaultValue={initialData.bio || ""} disabled={pending}></textarea>
      </div>
      
      <div className="flex gap-sm mt-sm">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Saving..." : "Update Alumni"}
        </button>
        <button type="button" className="btn btn-outline" onClick={() => router.back()} disabled={pending}>
          Cancel
        </button>
      </div>
    </form>
  );
}
