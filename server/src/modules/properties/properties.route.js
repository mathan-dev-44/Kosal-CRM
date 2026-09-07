import express from "express";

import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from "./properties.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";

import {
  createProjectSchema,
  updateProjectSchema,
} from "./properties.validation.js";

import {
  createBuilding,
  getBuildings,
  getBuilding,
  updateBuilding,
  deleteBuilding,
} from "./buildings.controller.js";

import {
  createBuildingSchema,
  updateBuildingSchema,
} from "./properties.validation.js";

import { createUnitSchema, updateUnitSchema } from "./units.validation.js";

import {
  createUnit,
  getUnits,
  getUnit,
  updateUnit,
} from "./units.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  validate(createProjectSchema),
  createProject,
);

router.get("/", authenticate, getProjects);

router.get("/:id", authenticate, getProject);

router.patch(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  validate(updateProjectSchema),
  updateProject,
);

router.delete("/:id", authenticate, authorizeRoles("ADMIN"), deleteProject);

router.post(
  "/:projectId/buildings",
  authenticate,
  authorizeRoles("ADMIN"),
  validate(createBuildingSchema),
  createBuilding,
);

router.get("/:projectId/buildings", authenticate, getBuildings);

router.get("/buildings/:id", authenticate, getBuilding);

router.patch(
  "/buildings/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  validate(updateBuildingSchema),
  updateBuilding,
);

router.delete(
  "/buildings/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  deleteBuilding,
);

router.post(
  "/buildings/:buildingId/units",
  authenticate,
  authorizeRoles("ADMIN"),
  validate(createUnitSchema),
  createUnit,
);

router.get("/buildings/:buildingId/units", authenticate, getUnits);

router.get("/units/:id", authenticate, getUnit);

router.patch(
  "/units/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  validate(updateUnitSchema),
  updateUnit,
);

export default router;
