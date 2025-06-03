import {
    Model,
    DataTypes,
    Sequelize,
    CreationOptional
} from 'sequelize';
import db from '../db/database';
import {BadgeStatus} from '../enum/badgeStatus';

const sequelize: Sequelize = db.getInstance();

export interface BadgeAttributes {
    id: string;
    userId: string;
    status: BadgeStatus;
    unauthorizedAttempts: number;
    firstUnauthorizedAttempt: Date | null;
}

export interface BadgeCreationAttributes {
    id?: string;
    userId: string;
    status?: BadgeStatus;
    unauthorizedAttempts?: number;
    firstUnauthorizedAttempt?: Date | null;
}

export class Badge extends Model<BadgeAttributes, BadgeCreationAttributes> implements BadgeAttributes {
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
