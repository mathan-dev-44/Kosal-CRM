import { findLeadById } from "./leads.repository.js";

import {
  createNote,
  findNotesByLeadId,
  findNoteById,
  deleteNote,
} from "./notes.repository.js";

const checkLeadAccess = async (leadId, user) => {
  const lead = await findLeadById(leadId);

  if (!lead) {
    throw new Error("Lead not found");
  }

  if (user.role === "SALES" && lead.assigned_to !== user.userId) {
    throw new Error("You do not have access to this lead");
  }

  return lead;
};

export const addNoteToLead = async (leadId, content, user) => {
  await checkLeadAccess(leadId, user);

  return await createNote({
    leadId,
    content,
  });
};

export const getLeadNotes = async (leadId, user) => {
  await checkLeadAccess(leadId, user);

  return await findNotesByLeadId(leadId);
};

export const removeNoteFromLead = async (leadId, noteId, user) => {
  await checkLeadAccess(leadId, user);

  const note = await findNoteById(noteId);

  if (!note) {
    throw new Error("Note not found");
  }

  if (note.lead_id !== leadId) {
    throw new Error("Note does not belong to this lead");
  }

  return await deleteNote(noteId);
};
