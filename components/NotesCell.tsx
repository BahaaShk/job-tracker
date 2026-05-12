"use client";

import { useState, useTransition, useRef } from "react";
import { updateNotes } from "@/app/actions/updateNotes";

interface Props {
  id: string;
  initialNotes: string | null;
}

export default function NotesCell({ id, initialNotes }: Props) {
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  // We need a ref to the textarea to detect blur (clicking away)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleBlur() {
    // Save on blur — user clicked away from the notes field
    startTransition(async () => {
      await updateNotes(id, notes);
      setSaved(true);
      // Clear the "Saved" indicator after 2 seconds
      timeoutRef.current = setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="relative">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={handleBlur}
        rows={2}
        placeholder="Add notes…"
        className="
          w-full text-sm bg-bg border border-border rounded-md px-2 py-1
          text-text-primary placeholder:text-muted resize-none
          focus:outline-none focus:ring-2 focus:ring-accent/40
          disabled:opacity-50 transition-colors
        "
        disabled={isPending}
      />
      {saved && (
        <span className="absolute -top-5 right-0 text-xs text-success">Saved</span>
      )}
    </div>
  );
}