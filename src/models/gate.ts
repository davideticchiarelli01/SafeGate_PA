import {
    Model,
    DataTypes,
    Sequelize,
    CreationOptional,
} from 'sequelize';
import db from '../db/database';
import { DPI } from '../enum/dpi';

const sequelize: Sequelize = db.getInstance();

export interface GateAttributes {
    id: string;
    name: string;
    requiredDPIs: DPI[];
}

export interface GateCreationAttributes {
    name: string;
    requiredDPIs?: DPI[];
}

export type GateUpdateAttributes = Partial<Omit<GateAttributes, 'id' | 'name' | 'createdAt'>>;

export class Gate extends Model<GateAttributes, GateCreationAttributes> implements GateAttributes {
    declare id: CreationOptional<string>;
    declare name: string;
    declare requiredDPIs: DPI[];
}

export function InitGateModel(sequelize: Sequelize) {
    Gate.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            requiredDPIs: {
                type: DataTypes.ARRAY(DataTypes.ENUM(...Object.values(DPI))),
                allowNull: false,
                defaultValue: [],
            }
        },
        {
            sequelize,
            modelName: 'Gate',
            tableName: 'Gates',
            timestamps: true,
        }
    );
};
