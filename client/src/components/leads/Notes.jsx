import { useEffect, useState } from "react";

import { addLeadNoteApi, getLeadNotesApi } from "../../api/leads.api.js";

const Notes = ({ leadId }) => {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getLeadNotesApi(leadId);

      setNotes(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [leadId]);

  const handleAddNote = async (event) => {
    event.preventDefault();

    if (!note.trim()) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      await addLeadNoteApi(leadId, note.trim());

      setNote("");

      await loadNotes();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add note.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
          Notes
        </h2>

        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Keep track of important information about this lead.
        </p>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleAddNote} className="mb-6">
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Write a note about this lead..."
            rows={3}
            className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
          />

          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={saving || !note.trim()}
              className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {saving ? "Adding..." : "Add Note"}
            </button>
          </div>
        </form>

        {loading ? (
          <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Loading notes...
          </div>
        ) : notes.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-800">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              No notes yet
            </p>

            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              Add the first note for this lead.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {item.user_name || "CRM User"}
                    </p>

                    <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString()
                        : ""}
                    </p>
                  </div>
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
