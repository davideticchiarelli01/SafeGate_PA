import {AuthorizationRepository} from '../repositories/authorizationRepository';
import {BadgeRepository} from '../repositories/badgeRepository';
import {GateRepository} from '../repositories/gateRepository';

import {Authorization, AuthorizationCreationAttributes} from '../models/authorization';
import {ErrorFactory} from '../factories/errorFactory';
import {ReasonPhrases} from 'http-status-codes';
import {Gate} from "../models/gate";
import {Badge} from "../models/badge";

export class AuthorizationService {
    constructor(
        private readonly authorizationRepo: AuthorizationRepository,
        private readonly badgeRepo: BadgeRepository,
        private readonly gateRepo: GateRepository
    ) {
    }

    async getAuthorization(badgeId: string, gateId: string): Promise<Authorization | null> {
        const gateAuth: Authorization | null = await this.authorizationRepo.findById(badgeId, gateId);
        if (!gateAuth) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Gate authorization not found');
        return gateAuth;
    }

    getAllAuthorizations(): Promise<Authorization[]> {
        return this.authorizationRepo.findAll();
    }

    async createAuthorization(data: AuthorizationCreationAttributes): Promise<Authorization> {
        const {badgeId, gateId} = data;

        const badgeExists: Badge | null = await this.badgeRepo.findById(badgeId);
        if (!badgeExists) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Badge not found');

        const gateExists: Gate | null = await this.gateRepo.findById(gateId);
        if (!gateExists) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Gate not found');

        const gateAuth: Authorization | null = await this.authorizationRepo.findById(badgeId, gateId);
        if (gateAuth) throw ErrorFactory.createError(ReasonPhrases.CONFLICT, 'Authorization already exists');

        return this.authorizationRepo.create(data);
    }

    async deleteAuthorization(badgeId: string, gateId: string): Promise<void> {
        const authorization = await this.authorizationRepo.findById(badgeId, gateId);
        if (!authorization) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Authorization not found');
        return this.authorizationRepo.delete(authorization);
    }
}
