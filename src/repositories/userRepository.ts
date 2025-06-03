import { IRepository } from "./repository";
import { UserDao } from "../dao/userDao";
import { User } from "../models/user";
import { ErrorFactory } from "../factories/errorFactory";
import { ReasonPhrases } from "http-status-codes";

export class UserRepository implements IRepository<User> {
    constructor(private userDao: UserDao) {
    }

    async findById(id: string): Promise<User | null> {
        return this.userDao.get(id);
    }

    async findAll(): Promise<User[]> {
        return this.userDao.getAll();
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.userDao.getByEmail(email);
    }

    async create(data: { email: string, password: string }): Promise<User> {
        const user: User = User.build(data);
        return user.save();
    }

    update(id: string, item: User): Promise<User | null> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        const user = await this.userDao.get(id);

        if (!user) {
            throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'User not found');
        }

        await this.userDao.delete(user);

    }
}
