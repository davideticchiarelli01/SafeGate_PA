import {Router} from "express";
import {controllers} from "../dependencies";


const badgeRouter = Router();
const {badgeController} = controllers;

badgeRouter.get("/badges", badgeController.getAllBadges);
badgeRouter.get("/badges/:id", badgeController.getBadge);
badgeRouter.post("/badges", badgeController.createBadge);
badgeRouter.put("/badges/:id", badgeController.updateBadge);
badgeRouter.delete("/badges/:id", badgeController.deleteBadge);

badgeRouter.get("/badges_suspended", badgeController.getSuspendedBadges);
badgeRouter.put("/reactivate_badges", badgeController.reactivateBadges);

export default badgeRouter;