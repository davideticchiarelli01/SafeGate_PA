import { IRepository } from "./repository";
import { UserDao } from "../dao/userDao";
import { User, UserAttributes, UserCreationAttributes } from "../models/user";

export class UserRepository implements IRepository<User, UserCreationAttributes, Partial<UserAttributes>> {
    constructor(private userDao: UserDao) {
    }

    findById(id: string): Promise<User | null> {
        return this.userDao.get(id);
    }

    findAll(): Promise<User[]> {
        return this.userDao.getAll();
    }

    findByEmail(email: string): Promise<User | null> {
        return this.userDao.getByEmail(email);
    }

    create(data: UserCreationAttributes): Promise<User> {
        return this.userDao.create(data);
    }

    update(user: User, data: Partial<UserAttributes>): Promise<User | null> {
        return this.userDao.update(user, data);
    }

    delete(user: User): Promise<void> {
        return this.userDao.delete(user);

    }
}
