import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize} from "sequelize";
import db from "../db/database";
import {DPI} from "../utils/dpi";

const sequelize: Sequelize = db.getInstance();

export class Gate extends Model<InferAttributes<Gate>, InferCreationAttributes<Gate>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare requiredDPIs: string[];
}

Gate.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        requiredDPIs: {
            type: DataTypes.ARRAY(DataTypes.ENUM(...Object.values(DPI))),
            allowNull: true,
            defaultValue: [],
        }
    },
    {
        sequelize: sequelize,
        modelName: 'Gate',
        tableName: 'Gates',
        timestamps: true,
    }
);