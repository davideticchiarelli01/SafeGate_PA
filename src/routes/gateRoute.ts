import {Router} from "express";
import {GateDao} from "../dao/gateDao";
import {GateRepository} from "../repositories/gateRepository";
import {GateService} from "../services/gateService";
import {GateController} from "../controllers/gateController";

const gateDao: GateDao = new GateDao();
const gateRepository: GateRepository = new GateRepository(gateDao);
const gateService: GateService = new GateService(gateRepository);
const gateController: GateController = new GateController(gateService);

const gateRouter = Router();

gateRouter.get("/gates", gateController.getAllGates);
gateRouter.get("/gates/:id", gateController.getGate);
gateRouter.post("/gates", gateController.createGate);
gateRouter.put("/gates/:id", gateController.updateGate);
gateRouter.delete("/gates/:id", gateController.deleteGate);

export default gateRouter;