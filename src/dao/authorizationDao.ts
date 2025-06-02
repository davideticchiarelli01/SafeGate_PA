import {IDao} from "./dao";
import {Authorization} from "../models/authorization";

export class authorizationDao implements IDao<Authorization> {

    constructor() {
    }

    async get(id: string): Promise<Authorization | null> {
        return Authorization.findByPk(id);
    }

    async getAll(): Promise<Authorization[]> {
        return Authorization.findAll();
    }

    async create(badge: Authorization): Promise<Authorization> {
        return Authorization.create(badge);
    }

    async update(authorization: Authorization): Promise<Authorization> {
        await authorization.save();
        return authorization;
    }

    async delete(authorization: Authorization): Promise<void> {
        await authorization.destroy();
    }
}

