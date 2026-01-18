"use client"

import { useParams } from "next/navigation";
import PREditorPageContent from "@/components/PREditorPage";

export default function EditPRPage() {
  const params = useParams();

  const repoId = params.id as string;
  const prId = params.prId as string;

  return <PREditorPageContent repoId={repoId} prId={prId} />;
}
