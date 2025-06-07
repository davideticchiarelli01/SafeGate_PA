import {Router} from "express";
import {authMiddleware, adminMiddleware} from "../middlewares/authMiddleware";
import {controllers} from "../dependencies";
import {validateGateCreation, validateGateId, validateGateUpdate} from "../middlewares/gateMiddleware";

const gateRouter: Router = Router();
const {gateController} = controllers;

gateRouter.get("/gates", authMiddleware, adminMiddleware, gateController.getAllGates);
gateRouter.get("/gates/:id", authMiddleware, adminMiddleware, ...validateGateId, gateController.getGate);
gateRouter.post("/gates", authMiddleware, adminMiddleware, ...validateGateCreation, gateController.createGate);
gateRouter.put("/gates/:id", authMiddleware, adminMiddleware, ...validateGateUpdate, gateController.updateGate);
gateRouter.delete("/gates/:id", authMiddleware, adminMiddleware, ...validateGateId, gateController.deleteGate);

export default gateRouter;