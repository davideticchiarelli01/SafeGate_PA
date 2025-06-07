import { Authorization } from "../authorization";
import { Badge } from "../badge";
import { Gate } from "../gate";
import { Transit } from "../transit";
import { User } from "../user";

/**
 * Defines all Sequelize associations (model relationships).
 * Should be called after all models are initialized.
 */
export function RelationshipsModels() {
    // Authorization belongs to one Badge
    Authorization.belongsTo(Badge, {
        foreignKey: 'badgeId',
        onDelete: 'CASCADE',
    });

    // A Badge can have many Authorizations
    Badge.hasMany(Authorization, {
        foreignKey: 'badgeId'
    });

    // Authorization belongs to one Gate
    Authorization.belongsTo(Gate, {
        foreignKey: 'gateId',
        onDelete: 'CASCADE',
    });

    // A Gate can have many Authorizations
    Gate.hasMany(Authorization, {
        foreignKey: 'gateId'
    });

    // A User may be linked to one Gate
    User.belongsTo(Gate, {
        foreignKey: 'linkedGateId',
        onDelete: 'CASCADE'
    });

    // A Gate may have one linked User (gate operator)
    Gate.hasOne(User, {
        foreignKey: 'linkedGateId'
    });

    // Each Badge belongs to one User
    Badge.belongsTo(User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
    });

    // Each User has one Badge
    User.hasOne(Badge, {
        foreignKey: 'userId'
    });

    // Each Transit belongs to one Gate
    Transit.belongsTo(Gate, {
        foreignKey: 'gateId',
        onDelete: 'CASCADE'
    });

    // A Gate can have many Transits
    Gate.hasMany(Transit, {
        foreignKey: 'gateId'
    });

    // Each Transit belongs to one Badge
    Transit.belongsTo(Badge, {
        foreignKey: 'badgeId',
        onDelete: 'CASCADE'
    });

    // A Badge can have many Transits
    Badge.hasMany(Transit, {
        foreignKey: 'badgeId'
    });
}
