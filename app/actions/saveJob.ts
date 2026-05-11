// app/actions/saveJob.ts

"use server"; // marks this entire file as server-only — Next.js won't include this code in the browser bundle

import { createClient } from "@/lib/supabase/server"; // SSR client, reads session from cookies
import type { Job } from "@/lib/jobs";

export async function saveJob(job: Job) {
  const supabase = await createClient(); // create the server client for this request

  // getUser() verifies the session server-side — never trust the client for auth checks
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // If somehow called without a session, bail out
    return { error: "Not authenticated" };
  }

  const { error } = await supabase.from("saved_jobs").insert({
    user_id: user.id,
    title: job.title,
    company: job.company,
    job_url: job.job_url,
    source: job.source,
    status: "saved", // default status on first save
  });

  if (error) {
    // Supabase unique constraints or RLS violations surface here
    return { error: error.message };
  }

  return { success: true };
}
