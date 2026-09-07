import express from "express";

import { login, me } from "./auth.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";

const router = express.Router();

router.post("/login", login);

router.get("/me", authenticate, me);

router.get("/admin-test", authenticate, authorizeRoles("ADMIN"), (req, res) => {
  res.json({
    success: true,
    message: "You are an admin",
    user: req.user,
  });
});

export default router;
