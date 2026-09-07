import express from "express";

import {
  createLead,
  getLeads,
  getLead,
  updateLead,
  assignLead,
  deleteLead,
} from "./leads.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";

import {
  createLeadSchema,
  updateLeadSchema,
  assignLeadSchema,
} from "./leads.validation.js";

import { createNote, getNotes, deleteNote } from "./notes.controller.js";

import { createNoteSchema } from "./notes.validation.js";

import {
  createFollowUp,
  getFollowUps,
  updateFollowUp,
} from "./followups.controller.js";

import {
  createFollowUpSchema,
  updateFollowUpSchema,
} from "./followups.validation.js";

const router = express.Router();

router.post("/", authenticate, validate(createLeadSchema), createLead);

router.get("/", authenticate, getLeads);

router.get("/:id", authenticate, getLead);

router.patch("/:id", authenticate, validate(updateLeadSchema), updateLead);

router.delete("/:id", authenticate, deleteLead);

router.patch(
  "/:id/assign",
  authenticate,
  authorizeRoles("ADMIN"),
  validate(assignLeadSchema),
  assignLead,
);

router.post("/:id/notes", authenticate, validate(createNoteSchema), createNote);

router.get("/:id/notes", authenticate, getNotes);

router.delete("/:id/notes/:noteId", authenticate, deleteNote);

router.post(
  "/:id/follow-ups",
  authenticate,
  validate(createFollowUpSchema),
  createFollowUp,
);

router.get("/:id/follow-ups", authenticate, getFollowUps);

router.patch(
  "/:id/follow-ups/:followUpId",
  authenticate,
  validate(updateFollowUpSchema),
  updateFollowUp,
);

export default router;
