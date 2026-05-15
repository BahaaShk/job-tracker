import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SavedTable, { SavedJob } from "@/components/SavedTable";

export default async function SavedPage() {
  const supabase = await createClient();

  // Gate the page — middleware should catch this first, but belt-and-suspenders
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch all saved jobs for this user, newest first
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("id, title, company, job_url, source, status, notes, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const jobs = (data ?? []) as SavedJob[];

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">Saved Jobs</h1>
        <span className="text-text-secondary text-sm">{jobs.length} jobs are tracked</span>
      </div>

      <SavedTable jobs={jobs} />
    </main>
  );
}