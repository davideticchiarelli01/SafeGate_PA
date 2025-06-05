import {Router} from "express";
import {controllers} from "../dependencies";
import {adminMiddleware, authMiddleware} from "../middlewares/authMiddleware";
import {
    validateBadgeCreation,
    validateBadgeId,
    validateBadgeUpdate,
    validateReactivateBadges
} from "../middlewares/badgeMiddleware";


const badgeRouter = Router();
const {badgeController} = controllers;

//badgeRouter.use(authMiddleware, adminMiddleware)
badgeRouter.get("/badges", badgeController.getAllBadges);
badgeRouter.get("/badges/:id", validateBadgeId, badgeController.getBadge);
badgeRouter.post("/badges", validateBadgeCreation, badgeController.createBadge);
badgeRouter.put("/badges/:id", validateBadgeUpdate, badgeController.updateBadge);
badgeRouter.delete("/badges/:id", validateBadgeId, badgeController.deleteBadge);

badgeRouter.get("/badges_suspended", badgeController.getSuspendedBadges);
badgeRouter.put("/reactivate_badges", validateReactivateBadges, badgeController.reactivateBadges);

export default badgeRouter;