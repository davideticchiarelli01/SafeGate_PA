import {Router} from "express";
import {
    authMiddleware,
    adminMiddleware,
    gateOrAdminMiddleware,
    userOrAdminMiddleware
} from "../middlewares/authMiddleware";
import {controllers} from "../dependencies";
import {
    validateBadgeReport,
    validateGateReport,
    validateTransitCreation,
    validateTransitId,
    validateTransitStats,
    validateTransitUpdate
} from "../middlewares/transitMiddleware";

/**
 * Express router for handling `Transit` related routes.
 * Provides endpoints for managing transit records and generating reports.
 */
const transitRouter: Router = Router();
const {transitController} = controllers;

/**
 * Route to retrieve all `Transit` records.
 * Requires authentication and admin privileges.
 * @route GET /transits
 * @middleware authMiddleware - Ensures the user is authenticated.
 * @middleware adminMiddleware - Ensures the user has admin privileges.
 * @controller transitController.getAllTransits - Handles the request.
 */
transitRouter.get("/transits", authMiddleware, adminMiddleware, transitController.getAllTransits);

/**
 * Route to retrieve a specific `Transit` by ID.
 * Requires authentication. Admin can access any; users can access only their own.
 * @route GET /transits/:id
 * @middleware authMiddleware - Ensures the user is authenticated.
 * @middleware userOrAdminMiddleware - Allows access if user is admin or owns the badge.
 * @middleware validateTransitId - Validates the `id` parameter.
 * @controller transitController.getTransit - Handles the request.
 */
transitRouter.get("/transits/:id", authMiddleware, userOrAdminMiddleware, validateTransitId, transitController.getTransit);

/**
 * Route to create a new `Transit`.
 * Requires authentication. Accessible to gate or admin roles.
 * @route POST /transits
 * @middleware authMiddleware - Ensures the user is authenticated.
 * @middleware gateOrAdminMiddleware - Ensures the user is a gate or admin.
 * @middleware validateTransitCreation - Validates the request body.
 * @controller transitController.createTransit - Handles the request.
 */
transitRouter.post("/transits", authMiddleware, gateOrAdminMiddleware, validateTransitCreation, transitController.createTransit);

/**
 * Route to update an existing `Transit` by ID.
 * Requires authentication and admin privileges.
 * @route PUT /transits/:id
 * @middleware authMiddleware - Ensures the user is authenticated.
 * @middleware adminMiddleware - Ensures the user has admin privileges.
 * @middleware validateTransitUpdate - Validates the request body.
 * @controller transitController.updateTransit - Handles the request.
 */
transitRouter.put("/transits/:id", authMiddleware, adminMiddleware, validateTransitUpdate, transitController.updateTransit);

/**
 * Route to delete a `Transit` by ID.
 * Requires authentication and admin privileges.
 * @route DELETE /transits/:id
 * @middleware authMiddleware - Ensures the user is authenticated.
 * @middleware adminMiddleware - Ensures the user has admin privileges.
 * @middleware validateTransitId - Validates the `id` parameter.
 * @controller transitController.deleteTransit - Handles the request.
 */
transitRouter.delete("/transits/:id", authMiddleware, adminMiddleware, validateTransitId, transitController.deleteTransit);

/**
 * Route to retrieve transit statistics for a specific badge.
 * Requires authentication.
 * @route GET /transits_stats/:badgeId
 * @middleware authMiddleware - Ensures the user is authenticated.
 * @middleware validateTransitStats - Validates badgeId and optional filters.
 * @controller transitController.getTransitStats - Handles the request.
 */
transitRouter.get("/transits_stats/:badgeId", authMiddleware, validateTransitStats, transitController.getTransitStats);

/**
 * Route to generate a report grouped by gate.
 * Requires authentication and admin privileges.
 * @route GET /gate_report
 * @middleware authMiddleware - Ensures the user is authenticated.
 * @middleware adminMiddleware - Ensures the user has admin privileges.
 * @middleware validateGateReport - Validates query parameters.
 * @controller transitController.getGateReport - Handles the request.
 */
transitRouter.get('/gate_report', authMiddleware, adminMiddleware, validateGateReport, transitController.getGateReport);

/**
 * Route to generate a report grouped by badge.
 * Accessible by the user or admin.
 * @route GET /badge_report
 * @middleware authMiddleware - Ensures the user is authenticated.
 * @middleware userOrAdminMiddleware - Allows access if user is admin or owns the badge.
 * @middleware validateBadgeReport - Validates query parameters.
 * @controller transitController.getBadgeReport - Handles the request.
 */
transitRouter.get('/badge_report', authMiddleware, userOrAdminMiddleware, validateBadgeReport, transitController.getBadgeReport);

export default transitRouter;
