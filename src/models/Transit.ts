import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import db from "../db/database";

const sequelize: Sequelize = db.getInstance();

enum TransitStatus {
    Authorized = "authorized",
    Unauthorized = "unauthorized"
}

export class Gate extends Model<InferAttributes<Gate>, InferCreationAttributes<Gate>> {
    declare id: CreationOptional<number>;
    declare gateId: number;
    declare badgeId: number;
    declare status: TransitStatus;
    declare usedDPIs: string[];
}

Gate.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        gateId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        badgeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(...Object.values(TransitStatus)),
            allowNull: false,
        },
        usedDPIs: {
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