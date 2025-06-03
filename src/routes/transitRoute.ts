import { Router } from "express";
import { TransitDao } from "../dao/transitDao";
import { TransitRepository } from "../repositories/transitRepository";
import { BadgeRepository } from "../repositories/badgeRepository";
import { TransitService } from "../services/transitService";
import { TransitController } from "../controllers/transitController";
import { authMiddleware, adminMiddleware, gateOrAdminMiddleware } from "../middlewares/authMiddleware";
import { BadgeDao } from "../dao/badgeDao";

const badgeDao: BadgeDao = new BadgeDao();
const transitDao: TransitDao = new TransitDao();
const badgeRepository: BadgeRepository = new BadgeRepository(badgeDao);
const transitRepository: TransitRepository = new TransitRepository(transitDao);
const transitService: TransitService = new TransitService(transitRepository, badgeRepository);
const transitController: TransitController = new TransitController(transitService);

const transitRouter = Router();

transitRouter.get("/transits", transitController.getAllTransits);
transitRouter.get("/transits/:id", authMiddleware, transitController.getTransit); //se amministratore OK sennò verificare se gli id corrispondono tra chi richiede e il badge richiesto
transitRouter.post("/transits", authMiddleware, gateOrAdminMiddleware, transitController.createTransit);
transitRouter.put("/transits/:id", authMiddleware, adminMiddleware, transitController.updateTransit);
transitRouter.delete("/transits/:id", authMiddleware, adminMiddleware, transitController.deleteTransit);

export default transitRouter;