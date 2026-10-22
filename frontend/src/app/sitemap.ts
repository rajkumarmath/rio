import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alumni.reva.edu.in";
  const now = new Date();

  const routes = [
    "",
    "/alumni",
    "/mentorship",
    "/achievers",
    "/opportunities",
    "/services",
    "/association",
    "/announcements",
    "/privacy",
    "/terms",
    "/signin",
    "/claim-profile",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/alumni" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/alumni" ? 0.9 : 0.7,
  }));
}
