import { UserDao } from "./dao/userDao";
import { UserRepository } from "./repositories/userRepository";

import { TransitDao } from "./dao/transitDao";
import { TransitRepository } from "./repositories/transitRepository";

import { AuthorizationDao } from "./dao/authorizationDao";
import { AuthorizationRepository } from "./repositories/authorizationRepository";

import { BadgeDao } from "./dao/badgeDao";
import { BadgeRepository } from "./repositories/badgeRepository";

import { GateDao } from "./dao/gateDao";
import { GateRepository } from "./repositories/gateRepository";

import { AuthorizationService } from "./services/authorizationService";
import { BadgeService } from "./services/badgeService";
import { TransitService } from "./services/transitService";
import { GateService } from "./services/gateService";

import { AuthorizationController } from "./controllers/authorizationController";
import { BadgeController } from "./controllers/badgeController";
import { GateController } from "./controllers/gateController";
import { TransitController } from "./controllers/transitController";

/**
 * Instances of DAO (Data Access Object) classes.
 * These objects are responsible for direct communication with the database models.
 */
export const dao = {
    authorizationDao: new AuthorizationDao(),
    badgeDao: new BadgeDao(),
    gateDao: new GateDao(),
    transitDao: new TransitDao(),
    userDao: new UserDao()
};

/**
 * Instances of Repository classes.
 * These wrap DAOs and encapsulate query logic for their respective domain entities.
 */
export const repositories = {
    authorizationRepository: new AuthorizationRepository(dao.authorizationDao),
    badgeRepository: new BadgeRepository(dao.badgeDao),
    gateRepository: new GateRepository(dao.gateDao),
    transitRepository: new TransitRepository(dao.transitDao),
    userRepository: new UserRepository(dao.userDao),
};

/**
 * Instances of Service classes.
 * These contain business logic and handle calls to repositories.
 */
export const services = {
    authorizationService: new AuthorizationService(
        repositories.authorizationRepository,
        repositories.badgeRepository,
        repositories.gateRepository
    ),
    badgeService: new BadgeService(
        repositories.badgeRepository,
        repositories.userRepository
    ),
    gateService: new GateService(
        repositories.gateRepository
    ),
    transitService: new TransitService(
        repositories.transitRepository,
        repositories.badgeRepository,
        repositories.gateRepository,
        repositories.authorizationRepository
    )
};

/**
 * Instances of Controller classes.
 * These expose public methods used by route handlers to manage HTTP requests/responses.
 */
export const controllers = {
    authorizationController: new AuthorizationController(services.authorizationService),
    badgeController: new BadgeController(services.badgeService),
    gateController: new GateController(services.gateService),
    transitController: new TransitController(services.transitService),
};
