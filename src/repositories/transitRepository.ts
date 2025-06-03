import { IRepository } from "./repository";
import { TransitDao } from "../dao/transitDao";
import { Transit, TransitAttributes, TransitCreationAttributes } from "../models/transit";
import { UserPayload } from "../utils/userPayload";
import { UserRole } from "../enum/userRoles";
import { User } from "../models/user";

export class TransitRepository implements IRepository<Transit, TransitCreationAttributes, Partial<TransitAttributes>> {

    constructor(private transitDao: TransitDao) {
    }

    findById(id: string): Promise<Transit | null> {
        return this.transitDao.get(id);
    }

    findAll(): Promise<Transit[]> {
        return this.transitDao.getAll();
    }

    create(data: TransitCreationAttributes): Promise<Transit> {
        return this.transitDao.create(data);
    }

    update(transit: Transit, data: Partial<TransitAttributes>): Promise<Transit> {
        return this.transitDao.update(transit, data);
    }

    delete(transit: Transit): Promise<void> {
        return this.transitDao.delete(transit);
    }
}
