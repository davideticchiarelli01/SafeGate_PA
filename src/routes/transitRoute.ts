import { Router } from "express";
import { TransitDao } from "../dao/transitDao";
import { TransitRepository } from "../repositories/transitRepository";
import { TransitService } from "../services/transitService";
import { TransitController } from "../controllers/transitController";
import { authMiddleware, adminMiddleware, gateOrAdminMiddleware } from "../middlewares/authMiddleware";

const transitDao: TransitDao = new TransitDao();
const transitRepository: TransitRepository = new TransitRepository(transitDao);
const transitService: TransitService = new TransitService(transitRepository);
const transitController: TransitController = new TransitController(transitService);

const transitRouter = Router();

transitRouter.get("/transits", transitController.getAllTransits);
transitRouter.get("/transits/:id", transitController.getTransit);
//transitRouter.post("/transits", authMiddleware, gateOrAdminMiddleware, transitController.createTransit);
transitRouter.put("/transits/:id", transitController.updateTransit);
transitRouter.delete("/transits/:id", transitController.deleteTransit);

export default transitRouter;