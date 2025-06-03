import {Router} from "express";
import {BadgeDao} from "../dao/badgeDao";
import {BadgeRepository} from "../repositories/badgeRepository";
import {BadgeService} from "../services/badgeService";
import {BadgeController} from "../controllers/badgeController";

const badgeDao: BadgeDao = new BadgeDao();
const badgeRepository: BadgeRepository = new BadgeRepository(badgeDao);
const badgeService: BadgeService = new BadgeService(badgeRepository);
const badgeController: BadgeController = new BadgeController(badgeService);

const badgeRouter = Router();

badgeRouter.get("/badges", badgeController.getAllBadges);
badgeRouter.get("/badges/:id", badgeController.getBadge);
badgeRouter.post("/badges", badgeController.createBadge);
badgeRouter.put("/badges/:id", badgeController.updateBadge);
badgeRouter.delete("/badges/:id", badgeController.deleteBadge);

badgeRouter.get("/badges_suspended", badgeController.getSuspendedBadges);
badgeRouter.put("/reactivate_badges", badgeController.reactivateBadges);

export default badgeRouter;