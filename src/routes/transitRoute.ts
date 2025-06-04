import { Router } from "express";
import { authMiddleware, adminMiddleware, gateOrAdminMiddleware } from "../middlewares/authMiddleware";
import { controllers } from "../dependencies";

const transitRouter = Router();
const { transitController } = controllers;

transitRouter.use(authMiddleware);

transitRouter.get("/transits", transitController.getAllTransits);
transitRouter.get("/transits/:id", transitController.getTransit);
transitRouter.post("/transits", gateOrAdminMiddleware, transitController.createTransit);
transitRouter.put("/transits/:id", adminMiddleware, transitController.updateTransit);
transitRouter.delete("/transits/:id", adminMiddleware, transitController.deleteTransit);

export default transitRouter;
