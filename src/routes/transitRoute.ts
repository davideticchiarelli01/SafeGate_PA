import { Router } from "express";
import { authMiddleware, adminMiddleware, gateOrAdminMiddleware, userOrAdminMiddleware } from "../middlewares/authMiddleware";
import { controllers } from "../dependencies";

const transitRouter = Router();
const { transitController } = controllers;

transitRouter.get("/transits", transitController.getAllTransits);
transitRouter.get("/transits/:id", transitController.getTransit);
//transitRouter.post("/transits", authMiddleware, gateOrAdminMiddleware, transitController.createTransit);
transitRouter.post("/transits", transitController.createTransit);
transitRouter.put("/transits/:id", adminMiddleware, transitController.updateTransit);
transitRouter.delete("/transits/:id", adminMiddleware, transitController.deleteTransit);

transitRouter.get("/transits_stats/:badgeId", transitController.getTransitStats);

transitRouter.get('/gate_report', authMiddleware, adminMiddleware, transitController.getGateReport);
transitRouter.get('/badge_report', authMiddleware, userOrAdminMiddleware, transitController.getBadgeReport);


export default transitRouter;
