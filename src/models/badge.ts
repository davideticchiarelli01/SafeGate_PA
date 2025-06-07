/**
 * Badge model definition and initialization.
 * This file defines the `Badge` model, which represents a badge assigned to a user.
 * It includes status tracking and unauthorized access attempt information.
 */

import {
    Model,
    DataTypes,
    Sequelize,
    CreationOptional
} from 'sequelize';
import { BadgeStatus } from '../enum/badgeStatus';

/**
 * Interface defining the attributes of the Badge model.
 * @property {string} id - UUID of the badge (primary key).
 * @property {string} userId - UUID of the user to whom the badge is assigned.
 * @property {BadgeStatus} status - Current status of the badge (active or suspended).
 * @property {number} unauthorizedAttempts - Count of failed access attempts.
 * @property {Date | null} firstUnauthorizedAttempt - Timestamp of the first unauthorized attempt, if any.
 */
export interface BadgeAttributes {
    id: string;
    userId: string;
    status: BadgeStatus;
    unauthorizedAttempts: number;
    firstUnauthorizedAttempt: Date | null;
}

/**
 * Interface defining the attributes required for creating a Badge instance.
 * @property {string} userId - UUID of the user assigned to the badge.
 * @property {BadgeStatus} [status] - Optional status (default: active).
 * @property {number} [unauthorizedAttempts] - Optional failed attempt count (default: 0).
 * @property {Date} [firstUnauthorizedAttempt] - Optional timestamp of first unauthorized access.
 */
export interface BadgeCreationAttributes {
    userId: string;
    status?: BadgeStatus;
    unauthorizedAttempts?: number;
    firstUnauthorizedAttempt?: Date;
}

/**
 * Type representing updatable fields for a Badge.
 * Excludes 'id', 'userId' and 'createdAt' from being modified.
 */
export type BadgeUpdateAttributes = Partial<Omit<BadgeAttributes, 'id' | 'userId' | 'createdAt'>>;

/**
 * Badge model class.
 * Represents a user's badge with authorization tracking.
 * @extends Model<BadgeAttributes,BadgeCreationAttributes>
 * @implements BadgeAttributes
 */
export class Badge extends Model<BadgeAttributes, BadgeCreationAttributes> implements BadgeAttributes {
    /**
     * UUID of the badge (auto-generated).
     */
    declare id: CreationOptional<string>;

    /**
     * UUID of the user assigned to this badge.
     */
    declare userId: string;

    /**
     * Status of the badge (active or suspended).
     */
    declare status: CreationOptional<BadgeStatus>;

    /**
     * Number of unauthorized transit attempts.
     */
    declare unauthorizedAttempts: CreationOptional<number>;

    /**
     * Timestamp of the first unauthorized attempt, if any.
     */
    declare firstUnauthorizedAttempt: CreationOptional<Date | null>;
}

/**
 * Initializes the Badge model.
 * @param {Sequelize} sequelize - Sequelize instance used for model initialization.
 */
export function InitBadgeModel(sequelize: Sequelize) {
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
}
