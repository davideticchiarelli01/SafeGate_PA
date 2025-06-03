import {
    CreationOptional,
    DataTypes,
    Model,
    Sequelize
} from 'sequelize';
import db from '../db/database';
import { UserRole } from "../enum/userRoles";

const sequelize: Sequelize = db.getInstance();

export interface UserAttributes {
    id: string;
    email: string;
    password: string;
    role: UserRole;
    linkedGateId: string;
    token: number;
}

export interface UserCreationAttributes {
    id?: string;
    email: string;
    password: string;
    role?: UserRole;
    linkedGateId?: string;
    token?: number;
}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    declare id: CreationOptional<string>;  // 'id' is optional because it is auto-generated
    declare email: string;
    declare password: string;
    declare role: CreationOptional<UserRole>;
    declare linkedGateId: CreationOptional<string>;
    declare token: CreationOptional<number>;
}

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
