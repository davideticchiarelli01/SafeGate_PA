import {Router} from "express";
import {controllers} from "../dependencies";
import {
    validateAuthorizationCreation,
    validateAuthorizationIds
} from "../middlewares/authorizationMiddleware";
import {adminMiddleware, authMiddleware} from "../middlewares/authMiddleware";

/**
 * Express router for handling `Authorization` related routes.
 * Provides endpoints for CRUD operations on `Authorization` entities.
 */
const authorizationRouter = Router();
const {authorizationController} = controllers;

/**
 * Route to retrieve all `Authorization` records.
 * Requires authentication and admin privileges.
 * @route GET /authorizations
 * @middleware authMiddleware - Ensures the user is authenticated.
 * @middleware adminMiddleware - Ensures the user has admin privileges.
 * @controller authorizationController.getAllAuthorizations - Handles the request.
 */
authorizationRouter.get("/authorizations", authMiddleware, adminMiddleware, authorizationController.getAllAuthorizations);

/**
 * Route to retrieve a specific `Authorization` record by `badgeId` and `gateId`.
 * Requires authentication and admin privileges.
 * @route GET /authorizations/:badgeId/:gateId
 * @middleware authMiddleware - Ensures the user is authenticated.
 * @middleware adminMiddleware - Ensures the user has admin privileges.
 * @middleware validateAuthorizationIds - Validates the provided `badgeId` and `gateId`.
 * @controller authorizationController.getAuthorization - Handles the request.
 */
authorizationRouter.get("/authorizations/:badgeId/:gateId", authMiddleware, adminMiddleware, validateAuthorizationIds, authorizationController.getAuthorization);

/**
 * Route to create a new `Authorization` record.
 * Requires authentication and admin privileges.
 * @route POST /authorizations
 * @middleware authMiddleware - Ensures the user is authenticated.
 * @middleware adminMiddleware - Ensures the user has admin privileges.
 * @middleware validateAuthorizationCreation - Validates the request body for creating an `Authorization`.
 * @controller authorizationController.createAuthorization - Handles the request.
 */
authorizationRouter.post("/authorizations", authMiddleware, adminMiddleware, validateAuthorizationCreation, authorizationController.createAuthorization);

/**
 * Route to delete a specific `Authorization` record by `badgeId` and `gateId`.
 * Requires authentication and admin privileges.
 * @route DELETE /authorizations/:badgeId/:gateId
 * @middleware authMiddleware - Ensures the user is authenticated.
 * @middleware adminMiddleware - Ensures the user has admin privileges.
 * @middleware validateAuthorizationIds - Validates the provided `badgeId` and `gateId`.
 * @controller authorizationController.deleteAuthorization - Handles the request.
 */
authorizationRouter.delete("/authorizations/:badgeId/:gateId", authMiddleware, adminMiddleware, validateAuthorizationIds, authorizationController.deleteAuthorization);

export default authorizationRouter;