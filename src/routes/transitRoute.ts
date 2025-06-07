import { Router } from "express";
import {
    authMiddleware,
    adminMiddleware,
    gateOrAdminMiddleware,
    userOrAdminMiddleware
} from "../middlewares/authMiddleware";
import { controllers } from "../dependencies";
import {
    validateBadgeReport,
    validateGateReport,
    validateTransitCreation,
    validateTransitId,
    validateTransitStats,
    validateTransitUpdate
} from "../middlewares/transitMiddleware";

const transitRouter = Router();
const { transitController } = controllers;

transitRouter.get("/transits", authMiddleware, adminMiddleware, transitController.getAllTransits);
transitRouter.get("/transits/:id", authMiddleware, userOrAdminMiddleware, validateTransitId, transitController.getTransit);
transitRouter.post("/transits", authMiddleware, gateOrAdminMiddleware, validateTransitCreation, transitController.createTransit);
transitRouter.put("/transits/:id", authMiddleware, adminMiddleware, validateTransitUpdate, transitController.updateTransit);
transitRouter.delete("/transits/:id", authMiddleware, adminMiddleware, validateTransitId, transitController.deleteTransit);

transitRouter.get("/transits_stats/:badgeId", authMiddleware, validateTransitStats, transitController.getTransitStats); //da chiedere
transitRouter.get('/gate_report', authMiddleware, adminMiddleware, validateGateReport, transitController.getGateReport);
transitRouter.get('/badge_report', authMiddleware, userOrAdminMiddleware, validateBadgeReport, transitController.getBadgeReport);


export default transitRouter;
