/**
 * Authorization model definition and initialization.
 * This file defines the `Authorization` model, which represents the relationship
 * between badges and gates in the database. It uses Sequelize ORM for model management.
 */
import {
    Model,
    DataTypes,
    Sequelize,
    ForeignKey,
} from 'sequelize';
import {Badge} from './badge';
import {Gate} from './gate';

/**
 * Interface defining the attributes of the Authorization model.
 * @property {string} badgeId - UUID of the badge associated with the authorization.
 * @property {string} gateId - UUID of the gate associated with the authorization.
 */
export interface AuthorizationAttributes {
    badgeId: string;
    gateId: string;
}

/**
 * Interface defining the attributes required for creating an Authorization instance.
 * @property {string} badgeId - UUID of the badge associated with the authorization.
 * @property {string} gateId - UUID of the gate associated with the authorization.
 */
export interface AuthorizationCreationAttributes {
    badgeId: string;
    gateId: string;
}

/**
 * Authorization model class.
 * Represents the relationship between badges and gates.
 * @extends Model<AuthorizationAttributes, AuthorizationCreationAttributes>
 * @implements AuthorizationAttributes
 */
export class Authorization extends Model<AuthorizationAttributes, AuthorizationCreationAttributes>
    implements AuthorizationAttributes {
    /**
     * Foreign key referencing the `Badge` model's `id`.
     */
    declare badgeId: ForeignKey<Badge['id']>;
    /**
     * Foreign key referencing the `Gate` model's `id`.
     */
    declare gateId: ForeignKey<Gate['id']>;
}

/**
 * Initializes the Authorization model.
 * @param {Sequelize} sequelize - Sequelize instance used for model initialization.
 */
export function InitAuthorizationModel(sequelize: Sequelize) {
    Authorization.init(
        {
            /**
             * UUID of the badge associated with the authorization.
             * Acts as a primary key and foreign key referencing the `Badges` table.
             */
            badgeId: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'Badges',
                    key: 'id',
                },
                onDelete: 'CASCADE', // Ensures that if a badge is deleted, its authorizations are also removed.
            },
            /**
             * UUID of the gate associated with the authorization.
             * Acts as a primary key and foreign key referencing the `Gates` table.
             */
            gateId: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'Gates',
                    key: 'id',
                },
                onDelete: 'CASCADE', // Ensures that if a gate is deleted, its authorizations are also removed.
            },
        },
        {
            sequelize,
            modelName: 'Authorization',
            tableName: 'Authorizations',
            timestamps: true, // Enables createdAt and updatedAt fields.
        }
    );
}