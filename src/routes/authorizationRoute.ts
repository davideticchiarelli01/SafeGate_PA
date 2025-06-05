import { Router } from "express";
import { controllers } from "../dependencies";
import { validateAuthorizationCreation, validateAuthorizationDeletion } from "../middlewares/authorizationMiddleware";

const authorizationRouter = Router();
const { authorizationController } = controllers;

authorizationRouter.get("/authorizations", authorizationController.getAllAuthorizations);
authorizationRouter.get("/authorizations/:badgeId/:gateId", validateAuthorizationCreation, authorizationController.getAuthorization);
authorizationRouter.post("/authorizations", authorizationController.createAuthorization);
authorizationRouter.delete("/authorizations/:badgeId/:gateId", validateAuthorizationDeletion, authorizationController.deleteAuthorization);

export default authorizationRouter;
