import {Router} from "express";
import {authMiddleware, adminMiddleware} from "../middlewares/authMiddleware";
import {controllers} from "../dependencies";

const gateRouter: Router = Router();
const {gateController} = controllers;

// gateRouter.use(authMiddleware, adminMiddleware);
gateRouter.get("/gates", gateController.getAllGates);
gateRouter.get("/gates/:id", gateController.getGate);
gateRouter.post("/gates", gateController.createGate);
gateRouter.put("/gates/:id", gateController.updateGate);
gateRouter.delete("/gates/:id", gateController.deleteGate);

export default gateRouter;