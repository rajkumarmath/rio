"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function login(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  
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
      return { error: "Invalid credentials" };
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
        bio: formData.get("bio") || null
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
        bio: formData.get("bio") || null
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
