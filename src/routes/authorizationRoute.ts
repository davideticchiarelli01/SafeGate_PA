import {Router} from "express";
import {AuthorizationDao} from "../dao/authorizationDao";
import {BadgeDao} from "../dao/badgeDao";
import {GateDao} from "../dao/gateDao";
import {AuthorizationRepository} from "../repositories/authorizationRepository";
import {BadgeRepository} from "../repositories/badgeRepository";
import {GateRepository} from "../repositories/gateRepository";
import {AuthorizationService} from "../services/authorizationService";
import {AuthorizationController} from "../controllers/authorizationController";
import {controllers} from "../dependencies";

const authorizationRouter = Router();
const {authorizationController} = controllers;

authorizationRouter.get("/authorizations", authorizationController.getAllAuthorizations);
authorizationRouter.get("/authorizations/:badgeId/:gateId", authorizationController.getAuthorization);
authorizationRouter.post("/authorizations", authorizationController.createAuthorization);
authorizationRouter.delete("/authorizations/:badgeId/:gateId", authorizationController.deleteAuthorization);

export default authorizationRouter;
