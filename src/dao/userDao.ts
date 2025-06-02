import { IDao } from "./dao";
import { User } from "../models/user";
import { UserRole } from "../utils/userRoles";
import { UUID } from "node:crypto";
import { link } from "node:fs";

export class UserDao implements IDao<User> {

    constructor() {
    }

    async get(id: string): Promise<User | null> {
        return User.findByPk(id);
    }

    async getAll(): Promise<User[]> {
        return User.findAll();
    }

    async create(user: User): Promise<User> {
        return User.create(user);
    }

    async update(user: User, email: string, password: string, role: UserRole, linkedGateId: UUID, token: number): Promise<User> {
        user.email = email;
        user.password = password;
        user.role = role;
        user.linkedGateId = linkedGateId;
        user.token = token;
        await user.save();
        return user;
    }

    async delete(user: User): Promise<void> {
        await user.destroy();
    }
}

