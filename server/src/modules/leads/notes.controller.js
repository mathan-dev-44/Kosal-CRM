import {
  addNoteToLead,
  getLeadNotes,
  removeNoteFromLead,
} from "./notes.service.js";

export const createNote = async (req, res) => {
  try {
    const note = await addNoteToLead(req.params.id, req.body.content, req.user);

    return res.status(201).json({
      success: true,
      message: "Note added successfully",
      data: note,
    });
  } catch (error) {
    console.error(error);

    const status =
      error.message === "Lead not found"
        ? 404
        : error.message === "You do not have access to this lead"
          ? 403
          : 400;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

export const getNotes = async (req, res) => {
  try {
    const notes = await getLeadNotes(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      data: notes,
    });
  } catch (error) {
    console.error(error);

    const status = error.message === "Lead not found" ? 404 : 403;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await removeNoteFromLead(
      req.params.id,
      req.params.noteId,
      req.user,
    );

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      data: note,
    });
  } catch (error) {
    console.error(error);

    let status = 400;

    if (error.message === "Lead not found") {
      status = 404;
    }

    if (error.message === "You do not have access to this lead") {
      status = 403;
    }

    if (error.message === "Note not found") {
      status = 404;
    }

    if (error.message === "Note does not belong to this lead") {
      status = 400;
    }

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};
