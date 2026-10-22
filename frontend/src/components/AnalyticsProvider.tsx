"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      const consent = localStorage.getItem("reva_cookie_consent");
      if (consent === "essential") {
        // User requested essential cookies only; skip analytics telemetry
        return;
      }

      const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID;
      const fullPath = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;

      // If Google Analytics or Plausible is configured in the environment
      if (typeof window !== "undefined" && analyticsId && (window as any).gtag) {
        (window as any).gtag("config", analyticsId, {
          page_path: fullPath,
        });
      }
    } catch {
      // Safe no-op in restricted browser environments
    }
  }, [pathname, searchParams]);

  return null;
}
