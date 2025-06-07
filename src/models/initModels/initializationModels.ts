import { Sequelize } from "sequelize";
import { InitGateModel } from "../gate";
import { InitBadgeModel } from "../badge";
import { InitAuthorizationModel } from "../authorization";
import { InitTransitModel } from "../transit";
import { InitUserModel } from "../user";
import { RelationshipsModels } from "./relationshipsModels";

/**
 * Initializes all Sequelize models and their relationships.
 *
 * This function should be called once during the application's bootstrap phase,
 * after establishing a Sequelize connection. It performs the following:
 * - Registers all model definitions with Sequelize.
 * - Sets up model relationships (associations).
 *
 * @param {Sequelize} sequelize - The Sequelize instance used to define the models.
 */
export function initModels(sequelize: Sequelize) {
    InitAuthorizationModel(sequelize); // Initializes the "Authorizations" model
    InitBadgeModel(sequelize);         // Initializes the "Badges" model
    InitGateModel(sequelize);          // Initializes the "Gates" model
    InitTransitModel(sequelize);       // Initializes the "Transits" model
    InitUserModel(sequelize);          // Initializes the "Users" model

    RelationshipsModels();             // Defines all associations between the models
}
