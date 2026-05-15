"use client";

import { useState, useTransition } from "react";
import { updateNotes } from "@/app/actions/updateNotes";

interface Props {
  id: string;
  initialNotes: string | null;
}

export default function NotesCell({ id, initialNotes }: Props) {
  // This state holds whatever the user is currently typing in the textarea.
  const [notes, setNotes] = useState(initialNotes ?? "");

  // useTransition gives us a loading flag while the save request is running.
  const [isPending, startTransition] = useTransition();

  // This controls the small "Saved" message after a successful save.
  const [saved, setSaved] = useState(false);

  // This remembers the latest text that was successfully saved to the server.
  const [savedNotes, setSavedNotes] = useState(initialNotes ?? "");

  // If the current text is different from the last saved text, there are unsaved changes.
  const isDirty = notes !== savedNotes;

  function handleSave() {
    // Save the text that existed when the user clicked the button.
    const notesToSave = notes;

    startTransition(async () => {
      await updateNotes(id, notesToSave);

      // After the server save finishes, this text becomes the new saved version.
      setSavedNotes(notesToSave);
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
          setSaved(false); // Hide the old "Saved" message once they type again.
        }}
        rows={2}
        placeholder="Add notes ..."
        className="
          w-full text-sm bg-bg border border-border rounded-md px-2 py-1
          text-text-primary placeholder:text-muted resize-none
          focus:outline-none focus:ring-2 focus:ring-accent/40
          transition-colors
        "
      />

      <div className="flex items-center gap-2">
        <button
          onClick={handleSave}
          disabled={!isDirty || isPending}
          className="text-xs px-2 py-0.5 rounded bg-accent text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
        >
          {isPending ? "Saving ..." : "Save ?"}
        </button>

        {/*
          The Save button is always visible.
          This message only appears after saving, and only if there are no new edits.
        */}
        {saved && !isDirty && (
          <span className="text-xs text-success">Saved ✔</span>
        )}
      </div>
    </div>
  );
}
