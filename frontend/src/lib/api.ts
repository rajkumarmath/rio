const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
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
      throw new ApiError(`API Error: ${response.statusText}`, response.status);
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

// --- Alumni API ---
export interface Alumni {
  id: number;
  first_name: string;
  last_name: string;
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

export interface AlumniPaginatedResponse {
  items: Alumni[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export async function getAlumni(params: Record<string, string | number> = {}) {
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
