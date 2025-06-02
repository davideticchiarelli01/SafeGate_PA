import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Sequelize
} from 'sequelize';
import Database from '../db/database';
import {BadgeStatus} from "../utils/badgeStatus";

const sequelize: Sequelize = Database.getInstance();


export class Badge extends Model<InferAttributes<Badge>, InferCreationAttributes<Badge>> {
    declare id: CreationOptional<string>;
    declare userId: string;
    declare status: CreationOptional<BadgeStatus>;
    declare unauthorizedAttempts: CreationOptional<number>;
    declare firstUnauthorizedAttempt: CreationOptional<Date | null>;
}

Badge.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
        status: {
            type: DataTypes.ENUM(...Object.values(BadgeStatus)),
            allowNull: false,
            defaultValue: BadgeStatus.Active,
        },
        unauthorizedAttempts: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        firstUnauthorizedAttempt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        }
    },
    {
        sequelize,
        modelName: 'Badge',
        tableName: 'Badges',
        timestamps: true,
    }
);
