"use client";

import { useState, useTransition } from "react";
import StatusSelect from "./StatusSelect";
import NotesCell from "./NotesCell";
import { deleteJob } from "@/app/actions/deleteJob";

type Status = "saved" | "applied" | "interview" | "rejected" | "offer";

// This type mirrors the saved_jobs row we fetch from Supabase
export interface SavedJob {
  id: string;
  title: string;
  company: string;
  job_url: string;
  source: string;
  status: Status;
  notes: string | null;
  created_at: string;
}

interface Props {
  jobs: SavedJob[];
}

const ALL_STATUSES: Status[] = ["saved", "applied", "interview", "rejected", "offer"];

export default function SavedTable({ jobs }: Props) {
  // Track which status filter is active. "all" is the default.
  const [filter, setFilter] = useState<Status | "all">("all");
  // Track which row is being deleted so we can show a spinner on that row only
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const visible = filter === "all"
    ? jobs
    : jobs.filter((j) => j.status === filter);

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      await deleteJob(id);
      setDeletingId(null);
    });
  }

  return (
    <div className="space-y-4">
      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        {(["all", ...ALL_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`
              px-3 py-1 rounded-full text-sm capitalize border transition-colors
              ${filter === s
                ? "bg-accent text-white border-accent"
                : "bg-surface text-text-secondary border-border hover:border-accent hover:text-accent"
              }
            `}
          >
            {s}
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="text-text-secondary text-sm py-8 text-center">
          No jobs match this filter.
        </p>
      )}

      {/* Responsive table — horizontal scroll on mobile */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface border-b border-border">
            <tr>
              {["Role", "Company", "Source", "Status", "Notes", ""].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-text-secondary font-medium whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((job) => (
              <tr
                key={job.id}
                className="border-b border-border last:border-0 hover:bg-surface/60 transition-colors"
              >
                <td className="px-4 py-3 text-text-primary font-medium max-w-[200px]">
                  <a
                    href={job.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors line-clamp-2"
                  >
                    {job.title}
                  </a>
                </td>
                <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                  {job.company}
                </td>
                <td className="px-4 py-3 text-text-secondary capitalize whitespace-nowrap">
                  {job.source}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusSelect id={job.id} currentStatus={job.status} />
                </td>
                <td className="px-4 py-3 min-w-[200px]">
                  <NotesCell id={job.id} initialNotes={job.notes} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <button
                    onClick={() => handleDelete(job.id)}
                    disabled={deletingId === job.id}
                    className="text-danger hover:opacity-70 disabled:opacity-30 transition-opacity text-xs"
                  >
                    {deletingId === job.id ? "Deleting…" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}