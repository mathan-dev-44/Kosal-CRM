import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Project name must be at least 2 characters")
    .max(150, "Project name cannot exceed 150 characters"),

  description: z
    .string()
    .trim()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),

  location: z
    .string()
    .trim()
    .min(2, "Location is required")
    .max(255, "Location cannot exceed 255 characters"),

  imageUrl: z.string().trim().url("Invalid image URL").optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(2).max(150).optional(),

  description: z.string().trim().max(2000).optional(),

  location: z.string().trim().min(2).max(255).optional(),

  imageUrl: z.string().trim().url("Invalid image URL").optional(),
});

export const createBuildingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Building name must be at least 2 characters")
    .max(100, "Building name cannot exceed 100 characters"),
});

export const updateBuildingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Building name must be at least 2 characters")
    .max(100, "Building name cannot exceed 100 characters"),
});
