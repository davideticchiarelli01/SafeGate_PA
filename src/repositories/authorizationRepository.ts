import {Authorization, AuthorizationAttributes, AuthorizationCreationAttributes} from '../models/authorization';
import {AuthorizationDao} from '../dao/authorizationDao';

export class AuthorizationRepository {
    constructor(private dao: AuthorizationDao) {
    }

    findById(badgeId: string, gateId: string): Promise<Authorization | null> {
        return this.dao.get(badgeId, gateId);
    }

    findAll(): Promise<Authorization[]> {
        return this.dao.getAll();
    }

    create(data: AuthorizationCreationAttributes): Promise<Authorization> {
        return this.dao.create(data);
    }

    delete(authorization: Authorization): Promise<void> {
        return this.dao.delete(authorization);
    }
}