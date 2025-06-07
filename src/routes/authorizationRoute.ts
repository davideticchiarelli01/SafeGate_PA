import {Router} from "express";
import {controllers} from "../dependencies";
import {
    validateAuthorizationCreation,
    validateAuthorizationIds
} from "../middlewares/authorizationMiddleware";

const authorizationRouter = Router();
const {authorizationController} = controllers;

authorizationRouter.get("/authorizations", authorizationController.getAllAuthorizations);
authorizationRouter.get("/authorizations/:badgeId/:gateId", validateAuthorizationIds, authorizationController.getAuthorization);
authorizationRouter.post("/authorizations", validateAuthorizationCreation, authorizationController.createAuthorization);
authorizationRouter.delete("/authorizations/:badgeId/:gateId", validateAuthorizationIds, authorizationController.deleteAuthorization);

export default authorizationRouter;
