// components/JobCard.tsx

"use client"; // needs useState for the save button's loading/success state

import { useState } from "react";
import { Job } from "@/lib/jobs";
import { saveJob } from "@/app/actions/saveJob";

type Props = {
  job: Job;
  alreadySaved: boolean;
};

export default function JobCard({ job, alreadySaved }: Props) {
  // initialize directly from the prop — so on refresh it starts as "saved" if it's in the DB
  const [status, setStatus] = useState<"idle" | "loading" | "saved" | "error">(
    alreadySaved ? "saved" : "idle");

  async function handleSave() {
    setStatus("loading");
    const result = await saveJob(job); // calls the Server Action directly — no fetch, no API route
    if (result.error) {
      setStatus("error");
    } else {
      setStatus("saved");
    }
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-4 flex flex-col gap-3">
      {/* Job info */}
      <div className="flex flex-col gap-1">
        <a
          href={job.job_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-primary font-medium hover:text-accent transition-colors"
        >
          {job.title}
        </a>
        <span className="text-text-secondary text-sm">{job.company}</span>
      </div>

      {/* Footer: source badge + save button */}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs text-muted bg-bg px-2 py-1 rounded-full border border-border capitalize">
          {job.source}
        </span>

        <button
          onClick={handleSave}
          disabled={status === "loading" || status === "saved"}
          className={`text-sm px-3 py-1 rounded-md border transition-colors
            ${status === "saved"
              ? "border-success text-success cursor-default"
              : status === "error"
              ? "border-danger text-danger hover:bg-danger/10"
              : "border-border text-text-secondary hover:border-accent hover:text-accent"
            }`}
        >
          {status === "loading" ? "Saving..." : status === "saved" ? "Saved ✓" : status === "error" ? "Retry" : "Save"}
        </button>
      </div>
    </div>
  );
}