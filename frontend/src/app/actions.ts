"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const RAW_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, "");

export async function login(prevState: any, formData: FormData) {
  if (formData.get("_hp_security_check")) {
    return { error: "Security check rejected." };
  }

  const username = (formData.get("username") as string || "").trim();
  const password = (formData.get("password") as string || "").trim();
  
  if (!username || !password) {
    return { error: "Username and password required" };
  }
  
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        username: username,
        password: password
      })
    });
    
    if (!res.ok) {
      return { error: "Invalid administrator credentials" };
    }
    
    const data = await res.json();
    const token = data.access_token;
    
    // Set secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 // 1 day
    });
    
  } catch (err) {
    return { error: "Network error during login" };
  }
  
  redirect("/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  redirect("/admin/login");
}

export async function loginAlumni(prevState: any, formData: FormData) {
  if (formData.get("_hp_security_check")) {
    return { error: "Security check rejected." };
  }

  const email = ((formData.get("email") as string) || "").trim().toLowerCase();
  const password = ((formData.get("password") as string) || "").trim();
  const redirectTo = (formData.get("redirect") as string) || "";

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid university or personal email address." };
  }

  let alumniId: number | null = null;
  let targetUrl = "/alumni";

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/alumni/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { error: errData.detail || "Authentication failed. Please verify your registered email and password." };
    }

    const data = await res.json();
    alumniId = data.alumni_id;

    const cookieStore = await cookies();
    cookieStore.set("alumni_session", JSON.stringify({
      alumni_id: data.alumni_id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      token: data.access_token,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    if (redirectTo) {
      targetUrl = redirectTo;
    } else {
      targetUrl = `/alumni/${data.alumni_id}/edit`;
    }
  } catch (err: any) {
    if (err?.message?.includes("NEXT_REDIRECT")) throw err;
    return { error: "Network error during alumni authentication." };
  }

  if (targetUrl) {
    redirect(targetUrl);
  }
}

export async function logoutAlumni() {
  const cookieStore = await cookies();
  cookieStore.delete("alumni_session");
  redirect("/signin");
}

export async function getAlumniSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("alumni_session")?.value;
  if (!sessionCookie) return null;
  try {
    return JSON.parse(sessionCookie);
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return Boolean(cookieStore.get("admin_token")?.value);
}

export async function updateAlumniProfileAction(alumniId: number, data: Record<string, any>) {
  const cookieStore = await cookies();
  const alumniSessionCookie = cookieStore.get("alumni_session")?.value;
  const adminToken = cookieStore.get("admin_token")?.value;

  let token: string | null = null;

  if (adminToken) {
    token = adminToken;
  } else if (alumniSessionCookie) {
    try {
      const parsed = JSON.parse(alumniSessionCookie);
      if (Number(parsed.alumni_id) === Number(alumniId) && parsed.token) {
        token = parsed.token;
      }
    } catch {
      // invalid cookie format
    }
  }

  if (!token) {
    return { error: "Unauthorized: You must be signed in with your designated alumni email or administrator credentials to update this profile." };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/alumni/${alumniId}/profile`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const resData = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { error: resData.detail || "Failed to update profile." };
    }
    return { success: true, data: resData };
  } catch (err: any) {
    return { error: "Network error during profile update." };
  }
}

export async function deleteAlumniAction(id: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return { error: "Unauthorized" };
  
  try {
    const res = await fetch(`${API_BASE_URL}/api/alumni/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) return { error: "Failed to delete alumni" };
  } catch (e) {
    return { error: "Network error" };
  }
}

export async function deleteAnnouncementAction(id: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return { error: "Unauthorized" };
  
  try {
    const res = await fetch(`${API_BASE_URL}/api/announcements/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) return { error: "Failed to delete announcement" };
  } catch (e) {
    return { error: "Network error" };
  }
}

export async function importPreviewAction(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return { error: "Unauthorized" };

  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/importer/preview`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData // let fetch set multipart boundary
    });
    const data = await res.json();
    if (!res.ok) return { error: data.detail || "Failed to preview import" };
    return { data };
  } catch (e) {
    return { error: "Network error" };
  }
}

export async function importExecuteAction(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return { error: "Unauthorized" };

  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/importer/import`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData
    });
    const data = await res.json();
    if (!res.ok) return { error: data.detail || "Failed to execute import" };
    return { data };
  } catch (e) {
    return { error: "Network error" };
  }
}

export async function createAlumniAction(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return { error: "Unauthorized" };

  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/alumni/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        email: formData.get("email"),
        phone: formData.get("phone") || null,
        location: formData.get("location") || null,
        bio: formData.get("bio") || null,
        linkedin_url: formData.get("linkedin_url") || null
      })
    });
    const data = await res.json();
    if (!res.ok) return { error: data.detail || "Failed to create alumni" };
    return { data };
  } catch (e) {
    return { error: "Network error" };
  }
}

export async function createAnnouncementAction(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return { error: "Unauthorized" };

  try {
    const res = await fetch(`${API_BASE_URL}/api/announcements/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: formData.get("title"),
        content: formData.get("content"),
        is_published: formData.get("is_published") === "on"
      })
    });
    const data = await res.json();
    if (!res.ok) return { error: data.detail || "Failed to create announcement" };
    return { data };
  } catch (e) {
    return { error: "Network error" };
  }
}

export async function editAlumniAction(id: number, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return { error: "Unauthorized" };

  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/alumni/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        email: formData.get("email"),
        phone: formData.get("phone") || null,
        location: formData.get("location") || null,
        bio: formData.get("bio") || null,
        linkedin_url: formData.get("linkedin_url") || null
      })
    });
    const data = await res.json();
    if (!res.ok) return { error: data.detail || "Failed to update alumni" };
    return { data };
  } catch (e) {
    return { error: "Network error" };
  }
}

export async function editAnnouncementAction(id: number, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return { error: "Unauthorized" };

  try {
    const res = await fetch(`${API_BASE_URL}/api/announcements/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: formData.get("title"),
        content: formData.get("content"),
        is_published: formData.get("is_published") === "on"
      })
    });
    const data = await res.json();
    if (!res.ok) return { error: data.detail || "Failed to update announcement" };
    return { data };
  } catch (e) {
    return { error: "Network error" };
  }
}
