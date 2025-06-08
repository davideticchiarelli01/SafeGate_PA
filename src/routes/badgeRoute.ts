import { Router } from "express";
import { controllers } from "../dependencies";
import { adminMiddleware, authMiddleware } from "../middlewares/authMiddleware";
import {
    validateBadgeCreation,
    validateBadgeId,
    validateBadgeUpdate,
    validateReactivateBadges
} from "../middlewares/badgeMiddleware";

/**
 * Express router for handling `Badge` related routes.
 * Provides endpoints for CRUD operations and management of badges.
 */
const badgeRouter = Router();
const { badgeController } = controllers;

/**
 * Route to retrieve all `Badge` records.
 * Requires authentication and admin privileges.
 * @route GET /badges
 * @middleware authMiddleware - Ensures the user is authenticated.
 * @middleware adminMiddleware - Ensures the user has admin privileges.
 * @controller badgeController.getAllBadges - Handles the request.
 */
badgeRouter.get("/badges", authMiddleware, adminMiddleware, badgeController.getAllBadges);

/**
 * Route to retrieve a specific `Badge` by ID.
 * Requires authentication and admin privileges.
 * @route GET /badges/:id
 * @middleware authMiddleware - Ensures the user is authenticated.
 * @middleware adminMiddleware - Ensures the user has admin privileges.
 * @middleware validateBadgeId - Validates the `id` parameter.
 * @controller badgeController.getBadge - Handles the request.
 */
badgeRouter.get("/badges/:id", authMiddleware, adminMiddleware, validateBadgeId, badgeController.getBadge);

/**
 * Route to create a new `Badge`.
 * Requires authentication and admin privileges.
 * @route POST /badges
 * @middleware authMiddleware - Ensures the user is authenticated.
 * @middleware adminMiddleware - Ensures the user has admin privileges.
 * @middleware validateBadgeCreation - Validates the request body.
 * @controller badgeController.createBadge - Handles the request.
 */
badgeRouter.post("/badges", authMiddleware, adminMiddleware, validateBadgeCreation, badgeController.createBadge);

/**
 * Route to update an existing `Badge`.
 * Requires authentication and admin privileges.
 * @route PUT /badges/:id
 * @middleware authMiddleware - Ensures the user is authenticated.
 * @middleware adminMiddleware - Ensures the user has admin privileges.
 * @middleware validateBadgeUpdate - Validates the request body.
 * @controller badgeController.updateBadge - Handles the request.
 */
badgeRouter.put("/badges/:id", authMiddleware, adminMiddleware, validateBadgeUpdate, badgeController.updateBadge);

/**
 * Route to delete a `Badge` by ID.
 * Requires authentication and admin privileges.
 * @route DELETE /badges/:id
 * @middleware authMiddleware - Ensures the user is authenticated.
 * @middleware adminMiddleware - Ensures the user has admin privileges.
 * @middleware validateBadgeId - Validates the `id` parameter.
 * @controller badgeController.deleteBadge - Handles the request.
 */
badgeRouter.delete("/badges/:id", authMiddleware, adminMiddleware, validateBadgeId, badgeController.deleteBadge);

/**
 * Route to retrieve all suspended `Badge` records.
 * Requires authentication and admin privileges.
 * @route GET /badges_suspended
 * @middleware authMiddleware - Ensures the user is authenticated.
 * @middleware adminMiddleware - Ensures the user has admin privileges.
 * @controller badgeController.getSuspendedBadges - Handles the request.
 */
badgeRouter.get("/badges_suspended", authMiddleware, adminMiddleware, badgeController.getSuspendedBadges);

/**
 * Route to reactivate multiple suspended `Badges`.
 * Requires authentication and admin privileges.
 * @route PUT /reactivate_badges
 * @middleware authMiddleware - Ensures the user is authenticated.
 * @middleware adminMiddleware - Ensures the user has admin privileges.
 * @middleware validateReactivateBadges - Validates the request body.
 * @controller badgeController.reactivateBadges - Handles the request.
 */
badgeRouter.put("/reactivate_badges", authMiddleware, adminMiddleware, validateReactivateBadges, badgeController.reactivateBadges);

export default badgeRouter;
