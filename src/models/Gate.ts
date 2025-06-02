import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import db from "../db/database";

const sequelize: Sequelize = db.getInstance();

export class Gate extends Model<InferAttributes<Gate>, InferCreationAttributes<Gate>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare requiredDPIs: string[];
}

Gate.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        requiredDPIs: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
            defaultValue: [],
        },
    },
    {
        sequelize: sequelize,
        modelName: 'Gate',
        tableName: 'Gates',
        timestamps: true,
    }
);