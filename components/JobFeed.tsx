// components/JobFeed.tsx

"use client"; // needs useState for the keyword filter input

import { useState } from "react";
import { Job } from "@/lib/jobs";
import JobCard from "./JobCard";

type Props = {
  jobs: Job[]; // the full list fetched server-side, passed down as props
  savedUrls: Set<string>;
};

export default function JobFeed({ jobs, savedUrls }: Props) {
  const [keyword, setKeyword] = useState("");

  // filter happens client-side on the already-fetched data — no re-fetch, instant feedback
  const filtered = jobs.filter((job) => {
    const q = keyword.toLowerCase();
    return (
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Search/filter input */}
      <input
        type="text"
        placeholder="Filter by title or company..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="w-full max-w-md bg-surface border border-border rounded-lg px-4 py-2 text-text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
      />

      {/* Results count */}
      <p className="text-text-secondary text-sm">
        {filtered.length} {filtered.length === 1 ? "job" : "jobs"} found
      </p>

      {/* Job grid */}
      {filtered.length === 0 ? (
        <p className="text-muted text-sm">No jobs match your filter.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              alreadySaved={savedUrls.has(job.job_url)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
