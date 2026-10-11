"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteAlumniAction, deleteAnnouncementAction } from "@/app/actions";

export default function DeleteButton({ id, type }: { id: number, type: 'alumni' | 'announcement' }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      let res;
      if (type === 'alumni') {
        res = await deleteAlumniAction(id);
      } else {
        res = await deleteAnnouncementAction(id);
      }
      
      if (res?.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    });
  };

  return (
    <button 
      onClick={handleDelete} 
      className="btn btn-outline" 
      style={{ color: 'red', borderColor: 'red', padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}
      disabled={isPending}
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
