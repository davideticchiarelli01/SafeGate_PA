import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize} from "sequelize";
import db from "../db/database";
import {TransitStatus} from "../enum/transitStatus";
import {DPI} from "../enum/dpi";

const sequelize: Sequelize = db.getInstance();

export class Transit extends Model<InferAttributes<Transit>, InferCreationAttributes<Transit>> {
    declare id: CreationOptional<number>;
    declare gateId: number;
    declare badgeId: number;
    declare status: TransitStatus;
    declare usedDPIs: string[];
    declare DPIviolation: boolean;
}

Transit.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        gateId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Gate',
                key: 'id',
            }
        },
        badgeId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Badge',
                key: 'id',
            }
        },
        status: {
            type: DataTypes.ENUM(...Object.values(TransitStatus)),
            allowNull: false,
        },
        usedDPIs: {
            type: DataTypes.ARRAY(DataTypes.ENUM(...Object.values(DPI))),
            allowNull: true,
            defaultValue: [],
        },
        DPIviolation: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    },
    {
        sequelize: sequelize,
        modelName: 'Transit',
        tableName: 'Transits',
        timestamps: true,
    }
);