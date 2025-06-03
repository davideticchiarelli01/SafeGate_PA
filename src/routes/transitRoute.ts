import {Router} from "express";
import {authMiddleware, adminMiddleware, gateOrAdminMiddleware} from "../middlewares/authMiddleware";
import {controllers} from "../dependencies";

const transitRouter = Router();
const {transitController} = controllers;

transitRouter.get("/transits", transitController.getAllTransits);
transitRouter.get("/transits/:id", authMiddleware, transitController.getTransit);
transitRouter.post("/transits", authMiddleware, gateOrAdminMiddleware, transitController.createTransit);
transitRouter.put("/transits/:id", authMiddleware, adminMiddleware, transitController.updateTransit);
transitRouter.delete("/transits/:id", authMiddleware, adminMiddleware, transitController.deleteTransit);

export default transitRouter;
