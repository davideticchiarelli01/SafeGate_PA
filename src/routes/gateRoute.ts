import {Router} from "express";
import {authMiddleware, adminMiddleware} from "../middlewares/authMiddleware";
import {controllers} from "../dependencies";
import {validateGateCreation, validateGateId, validateGateUpdate} from "../middlewares/gateMiddleware";

const gateRouter: Router = Router();
const {gateController} = controllers;

// gateRouter.use(authMiddleware, adminMiddleware);
gateRouter.get("/gates", gateController.getAllGates);
gateRouter.get("/gates/:id", validateGateId, gateController.getGate);
gateRouter.post("/gates", validateGateCreation, gateController.createGate);
gateRouter.put("/gates/:id", validateGateUpdate, gateController.updateGate);
gateRouter.delete("/gates/:id", validateGateId, gateController.deleteGate);

export default gateRouter;