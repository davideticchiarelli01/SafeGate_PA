import { Authorization } from "./authorization";
import { Badge } from "./badge";
import { Gate } from "./gate";
import { Transit } from "./transit";
import { User } from "./user";


export function RelationshipsModels() {
    Authorization.belongsTo(Badge, {
        foreignKey: 'badgeId',
        onDelete: 'CASCADE',
    });
    Badge.hasMany(Authorization, {
        foreignKey: 'badgeId'
    });

    Authorization.belongsTo(Gate, {
        foreignKey: 'gateId',
        onDelete: 'CASCADE',
    });
    Gate.hasMany(Authorization, {
        foreignKey: 'gateId'
    });

    User.belongsTo(Gate, {
        foreignKey: 'linkedGateId',
        onDelete: 'CASCADE'
    });
    Gate.hasOne(User, {
        foreignKey: 'linkedGateId'
    });

    Badge.belongsTo(User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
    });
    User.hasOne(Badge, {
        foreignKey: 'userId'
    });

    Transit.belongsTo(Gate, {
        foreignKey: 'gateId',
        onDelete: 'CASCADE'
    });
    Gate.hasMany(Transit, {
        foreignKey: 'gateId'
    });

    Transit.belongsTo(Badge, {
        foreignKey: 'badgeId',
        onDelete: 'CASCADE'
    });
    Badge.hasMany(Transit, {
        foreignKey: 'badgeId'
    });
}