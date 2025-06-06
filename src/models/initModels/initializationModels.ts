import {Sequelize} from "sequelize";
import {InitGateModel} from "../gate";
import {InitBadgeModel} from "../badge";
import {InitAuthorizationModel} from "../authorization";
import {InitTransitModel} from "../transit";
import {InitUserModel} from "../user";
import {RelationshipsModels} from "./relationshipsModels";


export function initModels(sequelize: Sequelize) {
    InitAuthorizationModel(sequelize);
    InitBadgeModel(sequelize);
    InitGateModel(sequelize);
    InitTransitModel(sequelize);
    InitUserModel(sequelize);

    RelationshipsModels();

}