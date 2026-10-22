import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getAlumniProfile } from "@/lib/api";
import { getAlumniSession, getAdminSession } from "@/app/actions";
import EditProfileClient from "./EditProfileClient";
import AlumniAuthGate from "./AlumniAuthGate";

export const instant = false;

export default async function EditAlumniProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = parseInt(id);

  let profile = null;
  try {
    profile = await getAlumniProfile(numId);
  } catch {
    notFound();
  }

  if (!profile) {
    notFound();
  }

  const alumniSession = await getAlumniSession();
  const isAdmin = await getAdminSession();

  const isAuthorized = isAdmin || (alumniSession && alumniSession.alumni_id === numId);

  return (
    <Suspense
      fallback={
        <div className="container py-lg text-center text-secondary">
          Loading alumni profile verification...
        </div>
      }
    >
      {isAuthorized ? (
        <EditProfileClient id={id} />
      ) : (
        <AlumniAuthGate
          id={id}
          email={profile.email}
          name={`${profile.first_name} ${profile.last_name}`}
        />
      )}
    </Suspense>
  );
}
