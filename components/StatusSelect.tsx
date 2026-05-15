"use client";

import { useState, useTransition } from "react";
import { updateStatus } from "@/app/actions/updateStatus";

type Status = "saved" | "applied" | "interview" | "rejected" | "offer";

interface Props {
  id: string;
  currentStatus: Status;
}

// Map each status to a color class so the pill changes color visually
const statusStyles: Record<Status, string> = {
  saved:     "bg-surface text-text-secondary border-border",
  applied:   "bg-surface text-accent border-accent",
  interview: "bg-surface text-warning border-warning",
  rejected:  "bg-surface text-danger border-danger",
  offer:     "bg-surface text-success border-success",
};

const statusOptions: Status[] = ["saved", "applied", "interview", "rejected", "offer"];

export default function StatusSelect({ id, currentStatus }: Props) {
  const [status, setStatus] = useState<Status>(currentStatus);
  // useTransition gives us isPending without blocking the UI
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as Status;
    setStatus(next); // optimistic update — show the change immediately

    startTransition(async () => {
      await updateStatus(id, next);
    });
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={isPending}
      className={`
        text-sm px-2 py-1 rounded-md border capitalize cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-accent/40
        disabled:opacity-50 transition-colors
        ${statusStyles[status]}
      `}
    >
      {statusOptions.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );
}