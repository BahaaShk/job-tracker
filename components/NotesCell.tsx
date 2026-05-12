"use client";

import { useRef, useState, useTransition } from "react";
import { updateNotes } from "@/app/actions/updateNotes";

interface Props {
  id: string;
  initialNotes: string | null;
}

export default function NotesCell({ id, initialNotes }: Props) {
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

    // Track the last successfully saved value so isDirty compares against it,
  // not the stale prop — the prop never changes after the server renders the page
  const savedValueRef = useRef(initialNotes ?? "");

  // Only show the save button if the user has changed the text
  const isDirty = notes !== (initialNotes ?? "");

  function handleSave() {
    startTransition(async () => {
      await updateNotes(id, notes);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="space-y-1">
      <textarea
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          setSaved(false); // reset the "Saved" indicator if they edit again
        }}
        rows={2}
        placeholder="Add notes…"
        className="
          w-full text-sm bg-bg border border-border rounded-md px-2 py-1
          text-text-primary placeholder:text-muted resize-none
          focus:outline-none focus:ring-2 focus:ring-accent/40
          transition-colors
        "
      />

      {/* Only render the row when there's something to show */}
      {(isDirty || saved) && (
        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              onClick={handleSave}
              disabled={isPending}
              className="text-xs px-2 py-0.5 rounded bg-accent text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
            >
              {isPending ? "Saving…" : "Save"}
            </button>
          )}
          {saved && !isDirty && (
            <span className="text-xs text-success">Saved</span>
          )}
        </div>
      )}
    </div>
  );
}