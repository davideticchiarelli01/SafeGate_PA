/**
 * User model definition and initialization.
 * This file defines the `User` model, which represents a system user
 * (e.g., admin, standard user, or gate operator) in the database.
 * It uses Sequelize ORM for model management.
 */

import {
    CreationOptional,
    DataTypes,
    Model,
    Sequelize
} from 'sequelize';
import { UserRole } from "../enum/userRoles";

/**
 * Interface defining the attributes of the User model.
 * @property {string} id - UUID of the user (primary key).
 * @property {string} email - Email address of the user.
 * @property {string} password - Hashed password of the user.
 * @property {UserRole} role - Role of the user (admin, user, gate).
 * @property {string} linkedGateId - UUID of the gate associated with the user (optional).
 * @property {number} token - Token balance of the user (default: 100).
 */
export interface UserAttributes {
    id: string;
    email: string;
    password: string;
    role: UserRole;
    linkedGateId: string;
    token: number;
}

/**
 * Interface defining the attributes required for creating a User instance.
 * Fields with default values or auto-generation are optional.
 */
export interface UserCreationAttributes {
    id?: string;
    email: string;
    password: string;
    role?: UserRole;
    linkedGateId?: string;
    token?: number;
}

/**
 * User model class.
 * Represents a user in the system.
 * @extends Model<UserAttributes,UserCreationAttributes>
 * @implements UserAttributes
 */
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    /**
     * UUID of the user (primary key).
     */
    declare id: CreationOptional<string>;

    /**
     * Email address of the user.
     */
    declare email: string;

    /**
     * Hashed password of the user.
     */
    declare password: string;

    /**
     * Role of the user (admin, user, or gate operator).
     */
    declare role: CreationOptional<UserRole>;

    /**
     * Optional foreign key linking the user to a gate.
     */
    declare linkedGateId: CreationOptional<string>;

    /**
     * Token balance of the user (default: 100).
     */
    declare token: CreationOptional<number>;
}

/**
 * Initializes the User model.
 * @param {Sequelize} sequelize - Sequelize instance used for model initialization.
 */
export function InitUserModel(sequelize: Sequelize) {
    User.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.ENUM(...Object.values(UserRole)),
                allowNull: false,
                defaultValue: UserRole.User,
            },
            linkedGateId: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'Gates',
                    key: 'id',
                },
            },
            token: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 100,
            }
        },
        {
            sequelize: sequelize,
            modelName: 'User',
            tableName: 'Users',
            timestamps: true,
        }
    );
}
