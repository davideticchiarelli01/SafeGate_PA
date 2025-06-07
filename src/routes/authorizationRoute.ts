import { Router } from "express";
import { controllers } from "../dependencies";
import {
    validateAuthorizationCreation,
    validateAuthorizationIds
} from "../middlewares/authorizationMiddleware";
import { adminMiddleware, authMiddleware } from "../middlewares/authMiddleware";

const authorizationRouter = Router();
const { authorizationController } = controllers;

authorizationRouter.get("/authorizations", authMiddleware, adminMiddleware, authorizationController.getAllAuthorizations);
authorizationRouter.get("/authorizations/:badgeId/:gateId", authMiddleware, adminMiddleware, validateAuthorizationIds, authorizationController.getAuthorization);
authorizationRouter.post("/authorizations", authMiddleware, adminMiddleware, validateAuthorizationCreation, authorizationController.createAuthorization);
authorizationRouter.delete("/authorizations/:badgeId/:gateId", authMiddleware, adminMiddleware, validateAuthorizationIds, authorizationController.deleteAuthorization);

export default authorizationRouter;
