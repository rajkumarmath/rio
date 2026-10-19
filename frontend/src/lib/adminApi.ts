import { cookies } from "next/headers";
import { ApiError } from "./api";

const RAW_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, "");

async function getAdminToken() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("admin_token");
  return tokenCookie?.value;
}

export async function fetchAdminApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await getAdminToken();
  if (!token) {
    throw new ApiError("Unauthorized", 401);
  }

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
      cache: 'no-store'
    });

    if (response.status === 401) {
      throw new ApiError("Session expired", 401);
    }
    
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new ApiError(errData.detail || `API Error: ${response.statusText}`, response.status);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error instanceof Error ? error.message : "Network error", 500);
  }
}

// --- Admin Endpoints ---

export async function getAdminStats() {
  return fetchAdminApi<{alumni_count: number, departments_count: number, batches_count: number, announcements_count: number}>('/api/admin/stats/');
}

export async function getAdminAlumni(page = 1, size = 20, q = "") {
  let url = `/api/admin/alumni/?page=${page}&size=${size}`;
  if (q) url += `&q=${encodeURIComponent(q)}`;
  return fetchAdminApi<any>(url);
}

export async function deleteAlumni(id: number) {
  return fetchAdminApi(`/api/alumni/${id}`, { method: 'DELETE' });
}

export async function deleteAnnouncement(id: number) {
  return fetchAdminApi(`/api/announcements/${id}`, { method: 'DELETE' });
}

export async function getAdminAlumniProfile(id: number) {
  return fetchAdminApi<any>(`/api/admin/alumni/${id}`);
}

export async function getAdminAnnouncement(id: number) {
  return fetchAdminApi<any>(`/api/announcements/${id}`);
}
