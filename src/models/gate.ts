/**
 * Gate model definition and initialization.
 * This file defines the `Gate` model, which represents a physical gate in the worksite.
 * Gates may require specific types of DPI for authorized access.
 */

import {
    Model,
    DataTypes,
    Sequelize,
    CreationOptional,
} from 'sequelize';
import { DPI } from '../enum/dpi';

/**
 * Interface defining the attributes of the Gate model.
 * @property {string} id - UUID of the gate (primary key).
 * @property {string} name - Unique name identifying the gate.
 * @property {DPI[]} requiredDPIs - Array of DPIs required to access the gate.
 */
export interface GateAttributes {
    id: string;
    name: string;
    requiredDPIs: DPI[];
}

/**
 * Interface defining the attributes required to create a Gate instance.
 * @property {string} name - Name of the gate.
 * @property {DPI[]} [requiredDPIs] - Optional array of required DPIs (default: empty array).
 */
export interface GateCreationAttributes {
    name: string;
    requiredDPIs?: DPI[];
}

/**
 * Type representing updatable fields for a Gate.
 * Excludes 'id', 'name', and 'createdAt' from being modified.
 */
export type GateUpdateAttributes = Partial<Omit<GateAttributes, 'id' | 'name' | 'createdAt'>>;

/**
 * Gate model class.
 * Represents a worksite access point with associated DPI requirements.
 * @extends Model<GateAttributes,GateCreationAttributes>
 * @implements GateAttributes
 */
export class Gate extends Model<GateAttributes, GateCreationAttributes> implements GateAttributes {
    /**
     * UUID of the gate (auto-generated).
     */
    declare id: CreationOptional<string>;

    /**
     * Unique name of the gate.
     */
    declare name: string;

    /**
     * Array of required DPIs to access the gate.
     */
    declare requiredDPIs: DPI[];
}

/**
 * Initializes the Gate model.
 * @param {Sequelize} sequelize - Sequelize instance used for model initialization.
 */
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
