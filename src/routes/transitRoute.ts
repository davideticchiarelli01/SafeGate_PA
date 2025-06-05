import {Router} from "express";
import {
    authMiddleware,
    adminMiddleware,
    gateOrAdminMiddleware,
    userOrAdminMiddleware
} from "../middlewares/authMiddleware";
import {controllers} from "../dependencies";
import {
    validateBadgeReport,
    validateGateReport,
    validateTransitCreation,
    validateTransitId,
    validateTransitStats,
    validateTransitUpdate
} from "../middlewares/transitMiddleware";

const transitRouter = Router();
const {transitController} = controllers;

transitRouter.get("/transits", transitController.getAllTransits);
transitRouter.get("/transits/:id", authMiddleware, validateTransitId, transitController.getTransit);
transitRouter.post("/transits", authMiddleware, gateOrAdminMiddleware, validateTransitCreation, transitController.createTransit);
transitRouter.put("/transits/:id", authMiddleware, adminMiddleware, validateTransitUpdate, transitController.updateTransit);
transitRouter.delete("/transits/:id", authMiddleware, adminMiddleware, validateTransitId, transitController.deleteTransit);

transitRouter.get("/transits_stats/:badgeId", validateTransitStats, transitController.getTransitStats);
transitRouter.get('/gate_report', authMiddleware, adminMiddleware, validateGateReport, transitController.getGateReport);
transitRouter.get('/badge_report', authMiddleware, userOrAdminMiddleware, validateBadgeReport, transitController.getBadgeReport);


export default transitRouter;
