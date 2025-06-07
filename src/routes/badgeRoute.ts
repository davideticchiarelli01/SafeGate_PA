import { Router } from "express";
import { controllers } from "../dependencies";
import { adminMiddleware, authMiddleware } from "../middlewares/authMiddleware";
import {
    validateBadgeCreation,
    validateBadgeId,
    validateBadgeUpdate,
    validateReactivateBadges
} from "../middlewares/badgeMiddleware";

const badgeRouter = Router();
const { badgeController } = controllers;

badgeRouter.get("/badges", authMiddleware, adminMiddleware, badgeController.getAllBadges);
badgeRouter.get("/badges/:id", authMiddleware, adminMiddleware, validateBadgeId, badgeController.getBadge);
badgeRouter.post("/badges", authMiddleware, adminMiddleware, validateBadgeCreation, badgeController.createBadge);
badgeRouter.put("/badges/:id", authMiddleware, adminMiddleware, validateBadgeUpdate, badgeController.updateBadge);
badgeRouter.delete("/badges/:id", authMiddleware, adminMiddleware, validateBadgeId, badgeController.deleteBadge);

badgeRouter.get("/badges_suspended", authMiddleware, adminMiddleware, badgeController.getSuspendedBadges);
badgeRouter.put("/reactivate_badges", authMiddleware, adminMiddleware, validateReactivateBadges, badgeController.reactivateBadges);

export default badgeRouter;