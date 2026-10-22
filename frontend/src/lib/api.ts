const RAW_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, "");

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      // Keep fresh for testing, maybe revalidate later
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new ApiError(`API Error: ${response.statusText} (${response.status}) at ${url}`, response.status);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    const msg = error instanceof Error ? error.message : "Network error";
    throw new ApiError(`Failed to fetch ${url}: ${msg}`, 500);
  }
}

// --- Alumni API ---
export interface Alumni {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  avatar_url?: string;
  is_claimed?: boolean;
  is_mentor?: boolean;
  location?: string;
  bio?: string;
  department?: { name: string };
  batch?: { year: number };
  employment_history: Array<{
    company: string;
    title: string;
    start_date?: string;
    end_date?: string;
    is_current: boolean;
  }>;
  education_history: Array<{
    degree: string;
    field_of_study: string;
    institution: string;
    start_year?: number;
    end_year?: number;
  }>;
}

export function getAlumniAvatarUrl(alumnus: {
  avatar_url?: string | null;
  linkedin_url?: string | null;
  first_name?: string;
  last_name?: string;
}): string {
  if (alumnus.avatar_url && alumnus.avatar_url.trim()) {
    return alumnus.avatar_url.trim();
  }
  if (alumnus.linkedin_url) {
    const match = alumnus.linkedin_url.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
    if (match && match[1]) {
      return `https://unavatar.io/linkedin/${match[1]}?fallback=https://ui-avatars.com/api/?name=${encodeURIComponent((alumnus.first_name || '') + ' ' + (alumnus.last_name || ''))}&background=ea580c&color=ffffff&bold=true`;
    }
  }
  const name = `${alumnus.first_name || ''} ${alumnus.last_name || ''}`.trim() || 'Alumni';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ea580c&color=ffffff&bold=true`;
}

export interface AlumniPaginatedResponse {
  items: Alumni[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export async function getAlumni(params: Record<string, string | number | boolean> = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.append(key, value.toString());
    }
  });
  const qs = searchParams.toString();
  return fetchApi<AlumniPaginatedResponse>(`/api/alumni/${qs ? '?' + qs : ''}`);
}

export async function getAlumniProfile(id: number) {
  return fetchApi<Alumni>(`/api/alumni/${id}`);
}

export async function updateAlumniProfile(id: number, data: Record<string, any>) {
  return fetchApi<Alumni>(`/api/alumni/${id}/profile`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function claimAlumniProfile(id: number, data?: Record<string, any>) {
  return fetchApi<Alumni>(`/api/alumni/${id}/claim`, {
    method: 'POST',
    body: JSON.stringify(data || {}),
  });
}

// --- Announcements API ---
export interface Announcement {
  id: number;
  title: string;
  content: string;
  posted_at: string;
  is_published: boolean;
  author_username?: string;
}

export interface AnnouncementPaginatedResponse {
  items: Announcement[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export async function getAnnouncements(page = 1, size = 20) {
  return fetchApi<AnnouncementPaginatedResponse>(`/api/announcements/?page=${page}&size=${size}`);
}

export async function getAnnouncement(id: number) {
  return fetchApi<Announcement>(`/api/announcements/${id}`);
}

// --- Association API ---
export interface AssociationInfo {
  mission: string;
  overview: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  committee_members: Array<{ name: string; role: string }>;
  initiatives: Array<{ title: string; description: string }>;
}

export async function getAssociationInfo() {
  return fetchApi<AssociationInfo>(`/api/association/`);
}
