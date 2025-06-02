import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Sequelize,
    ForeignKey
} from 'sequelize';
import Database from '../db/database';
import {Badge} from "./badge";
import {Gate} from "./gate";


const sequelize: Sequelize = Database.getInstance();

export class Authorization extends Model<
    InferAttributes<Authorization>,
    InferCreationAttributes<Authorization>
> {
    declare badgeId: ForeignKey<Badge['id']>;
    declare gateId: ForeignKey<Gate['id']>;
}

Authorization.init(
    {
        badgeId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Badges',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        gateId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Gates',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
    },
    {
        sequelize,
        modelName: 'AccessAuthorization',
        tableName: 'AccessAuthorizations',
        timestamps: true,
    }
);


