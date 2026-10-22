import { Suspense } from "react";
import ClaimProfileClient from "./ClaimProfileClient";

export const instant = false;

export default function ClaimProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="container py-lg text-center text-secondary">
          Loading alumni records...
        </div>
      }
    >
      <ClaimProfileClient />
    </Suspense>
  );
}
