import { Suspense } from "react";
import EditProfileClient from "./EditProfileClient";

export const instant = false;

export default async function EditAlumniProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="container py-lg text-center text-secondary">
          Loading alumni profile editor...
        </div>
      }
    >
      <EditProfileClient id={id} />
    </Suspense>
  );
}
