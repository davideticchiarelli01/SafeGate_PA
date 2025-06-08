import { Router } from "express";
import { authMiddleware, adminMiddleware } from "../middlewares/authMiddleware";
import { controllers } from "../dependencies";
import { validateGateCreation, validateGateId, validateGateUpdate } from "../middlewares/gateMiddleware";

/**
 * Express router for handling `Gate` related routes.
 * Provides endpoints for CRUD operations on `Gate` entities.
 */
const gateRouter: Router = Router();
const { gateController } = controllers;

/**
 * Route to retrieve all `Gate` records.
 * Requires authentication and admin privileges.
 * @route GET /gates
 * @middleware authMiddleware - Ensures the user is authenticated.
 * @middleware adminMiddleware - Ensures the user has admin privileges.
 * @controller gateController.getAllGates - Handles the request.
 */
gateRouter.get("/gates", authMiddleware, adminMiddleware, gateController.getAllGates);

/**
 * Route to retrieve a specific `Gate` by ID.
 * Requires authentication and admin privileges.
 * @route GET /gates/:id
 * @middleware authMiddleware - Ensures the user is authenticated.
 * @middleware adminMiddleware - Ensures the user has admin privileges.
 * @middleware validateGateId - Validates the `id` parameter.
 * @controller gateController.getGate - Handles the request.
 */
gateRouter.get("/gates/:id", authMiddleware, adminMiddleware, ...validateGateId, gateController.getGate);

/**
 * Route to create a new `Gate`.
 * Requires authentication and admin privileges.
 * @route POST /gates
 * @middleware authMiddleware - Ensures the user is authenticated.
 * @middleware adminMiddleware - Ensures the user has admin privileges.
 * @middleware validateGateCreation - Validates the request body.
 * @controller gateController.createGate - Handles the request.
 */
gateRouter.post("/gates", authMiddleware, adminMiddleware, ...validateGateCreation, gateController.createGate);

/**
 * Route to update an existing `Gate`.
 * Requires authentication and admin privileges.
 * @route PUT /gates/:id
 * @middleware authMiddleware - Ensures the user is authenticated.
 * @middleware adminMiddleware - Ensures the user has admin privileges.
 * @middleware validateGateUpdate - Validates the request body.
 * @controller gateController.updateGate - Handles the request.
 */
gateRouter.put("/gates/:id", authMiddleware, adminMiddleware, ...validateGateUpdate, gateController.updateGate);

/**
 * Route to delete a specific `Gate` by ID.
 * Requires authentication and admin privileges.
 * @route DELETE /gates/:id
 * @middleware authMiddleware - Ensures the user is authenticated.
 * @middleware adminMiddleware - Ensures the user has admin privileges.
 * @middleware validateGateId - Validates the `id` parameter.
 * @controller gateController.deleteGate - Handles the request.
 */
gateRouter.delete("/gates/:id", authMiddleware, adminMiddleware, ...validateGateId, gateController.deleteGate);

export default gateRouter;
