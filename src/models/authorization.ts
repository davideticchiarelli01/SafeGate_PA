import {
    Model,
    DataTypes,
    Sequelize,
    ForeignKey,
} from 'sequelize';
import Database from '../db/database';
import {Badge} from './badge';
import {Gate} from './gate';

const sequelize: Sequelize = Database.getInstance();

export interface AuthorizationAttributes {
    badgeId: string;
    gateId: string;
}

export interface AuthorizationCreationAttributes {
    badgeId: string;
    gateId: string;
}

export class Authorization extends Model<AuthorizationAttributes, AuthorizationCreationAttributes>
    implements AuthorizationAttributes {
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
        modelName: 'Authorization',
        tableName: 'Authorizations',
        timestamps: true,
    }
);
