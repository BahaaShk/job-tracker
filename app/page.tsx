// app/page.tsx

// This is a Server Component by default (no "use client" at the top)
// That means it runs on the server, can do async/await directly, and never ships to the browser

import { fetchRemotive, fetchHimalayas } from "@/lib/jobs";
import JobFeed from "@/components/JobFeed";

export default async function HomePage() {
  // Both fetches run in parallel — Promise.allSettled won't crash if one API is down
  // "settled" means we get the result of each promise whether it succeeded or failed
  const [remotiveResult, himalayasResult] = await Promise.allSettled([
    fetchRemotive("frontend"),
    fetchHimalayas("frontend"),
  ]);

  // Extract the jobs array from each result, fall back to empty array if it failed
  const remotiveJobs = remotiveResult.status === "fulfilled" ? remotiveResult.value : [];
  const himalayasJobs = himalayasResult.status === "fulfilled" ? himalayasResult.value : [];

  // Merge both lists into one array
  const allJobs = [...remotiveJobs, ...himalayasJobs];

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-text-primary text-2xl font-semibold">Job Feed</h1>
        <p className="text-text-secondary text-sm">
          Live listings from Remotive and Himalayas
        </p>
      </div>

      {/* JobFeed is a Client Component — we pass the server-fetched data down as props */}
      <JobFeed jobs={allJobs} />
    </main>
  );
}