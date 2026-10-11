"use client";

import { useActionState, useEffect } from "react";
import { createAlumniAction } from "@/app/actions";
import { useRouter } from "next/navigation";

const initialState = {
  error: null as string | null,
  data: null as any,
};

// Next 15 useActionState expects form state with potentially arbitrary shape
// I'll wrap the action to match the signature if necessary, or just use it raw.
export default function AddAlumniPage() {
  const [state, formAction, pending] = useActionState(async (prevState: any, formData: FormData) => {
    return await createAlumniAction(formData);
  }, initialState);
  
  const router = useRouter();

  useEffect(() => {
    if (state.data) {
      router.push("/admin/alumni");
      router.refresh();
    }
  }, [state.data, router]);

  return (
    <div>
      <h1 className="mb-md">Add New Alumni</h1>
      
      <div className="card" style={{ maxWidth: '600px' }}>
        {state.error && <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '4px' }}>{state.error}</div>}
        
        <form action={formAction} className="flex flex-col gap-md">
          <div className="grid grid-cols-2 gap-sm">
            <div>
              <label className="font-semibold mb-xs" style={{ display: 'block' }}>First Name *</label>
              <input type="text" name="first_name" className="input-field" required disabled={pending} />
            </div>
            <div>
              <label className="font-semibold mb-xs" style={{ display: 'block' }}>Last Name *</label>
              <input type="text" name="last_name" className="input-field" required disabled={pending} />
            </div>
          </div>
          
          <div>
            <label className="font-semibold mb-xs" style={{ display: 'block' }}>Email *</label>
            <input type="email" name="email" className="input-field" required disabled={pending} />
          </div>
          
          <div>
            <label className="font-semibold mb-xs" style={{ display: 'block' }}>Phone</label>
            <input type="text" name="phone" className="input-field" disabled={pending} />
          </div>
          
          <div>
            <label className="font-semibold mb-xs" style={{ display: 'block' }}>Location</label>
            <input type="text" name="location" className="input-field" disabled={pending} />
          </div>
          
          <div>
            <label className="font-semibold mb-xs" style={{ display: 'block' }}>Bio</label>
            <textarea name="bio" className="input-field" rows={4} disabled={pending}></textarea>
          </div>
          
          <div className="flex gap-sm mt-sm">
            <button type="submit" className="btn btn-primary" disabled={pending}>
              {pending ? "Saving..." : "Save Alumni"}
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
