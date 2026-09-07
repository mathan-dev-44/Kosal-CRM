import express from "express";

import { createUser, getUsers } from "./users.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";

import { createUserSchema } from "./users.validation.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  validate(createUserSchema),
  createUser,
);

router.get("/", authenticate, authorizeRoles("ADMIN"), getUsers);

export default router;
