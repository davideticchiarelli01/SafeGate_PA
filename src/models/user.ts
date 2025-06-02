import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize} from 'sequelize';
import Database from '../db/database';
import {UserRole} from "../utils/userRoles";

const sequelize: Sequelize = Database.getInstance();

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
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
