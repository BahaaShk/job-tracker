"use server";

import { createClient } from "@/lib/supabase/server";

// The status values must match what's in the DB constraint
type Status = "saved" | "applied" | "interview" | "rejected" | "offer";

export async function updateStatus(id: string, status: Status) {
  const supabase = await createClient();

  // Verify the user is logged in before touching the DB
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("saved_jobs")
    .update({ status })
    .eq("id", id)
    .eq("user_id", user.id); // extra safety: can't update someone else's row

  if (error) throw new Error(error.message);
}