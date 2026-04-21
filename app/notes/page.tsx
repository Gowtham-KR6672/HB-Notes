import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getNotes } from "@/lib/notes";
import { WorkspaceApp } from "@/components/workspace/workspace-app";

export default async function NotesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const notes = await getNotes({
    userId: user._id.toString(),
    page: 1,
    limit: 12
  });

  return (
    <WorkspaceApp
      initialNotes={JSON.parse(JSON.stringify(notes))}
      user={{
        _id: user._id.toString(),
        name: user.name,
        email: user.email
      }}
    />
  );
}
