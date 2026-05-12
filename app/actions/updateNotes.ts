"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateNotes(id: string, notes: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("saved_jobs")
    .update({ notes })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
}