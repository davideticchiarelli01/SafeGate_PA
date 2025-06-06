import {Authorization, AuthorizationCreationAttributes} from "../models/authorization";
import {IDao} from "./dao";


export class AuthorizationDao implements IDao<Authorization, AuthorizationCreationAttributes> {

    async get(badgeId: string, gateId: string): Promise<Authorization | null> {
        return await Authorization.findOne({
            where: {
                badgeId,
                gateId
            }
        });
    }

    async getAll(): Promise<Authorization[]> {
        return await Authorization.findAll();
    }

    async create(data: AuthorizationCreationAttributes): Promise<Authorization> {
        return await Authorization.create(data);
    }

    async delete(authorization: Authorization): Promise<void> {
        return await authorization.destroy();
    }
}