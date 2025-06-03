import { IDao } from "./dao";
import { User, UserAttributes, UserCreationAttributes } from "../models/user";

export class UserDao implements IDao<User, UserCreationAttributes, Partial<UserAttributes>> {

    constructor() {
    }

    async get(id: string): Promise<User | null> {
        return await User.findByPk(id);
    }

    async getAll(): Promise<User[]> {
        return await User.findAll();
    }

    async getByEmail(email: string): Promise<User | null> {
        return await User.findOne({ where: { email } });
    }

    async create(data: UserCreationAttributes): Promise<User> {
        return await User.create(data);
    }

    async update(user: User, data: Partial<UserAttributes>): Promise<User> {
        return await user.update(data);
    }

    async delete(user: User): Promise<void> {
        if (user) await user.destroy();
    }
}

