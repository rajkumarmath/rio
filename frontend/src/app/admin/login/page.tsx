"use client";

import { useActionState } from "react";
import { login } from "@/app/actions";

const initialState = {
  error: null as string | null,
};

export default function AdminLogin() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="container flex justify-center items-center" style={{ minHeight: '60vh' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: 'var(--spacing-lg)' }}>
        <h1 className="mb-md text-center">Admin Login</h1>
        
        {state?.error && (
          <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', backgroundColor: '#fee2e2', padding: '0.5rem', borderRadius: '4px' }}>
            {state.error}
          </div>
        )}
        
        <form action={formAction} className="flex flex-col gap-md">
          <div>
            <label className="font-semibold mb-xs" style={{ display: 'block' }}>Username</label>
            <input 
              type="text" 
              name="username" 
              className="input-field" 
              required 
            />
          </div>
          <div>
            <label className="font-semibold mb-xs" style={{ display: 'block' }}>Password</label>
            <input 
              type="password" 
              name="password" 
              className="input-field" 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary mt-sm" 
            disabled={pending}
          >
            {pending ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
