import {Badge, BadgeAttributes, BadgeCreationAttributes} from "../models/badge";
import {IDao} from "./dao";

export class BadgeDao implements IDao<Badge, BadgeCreationAttributes, Partial<BadgeAttributes>> {
    async get(id: string): Promise<Badge | null> {
        return Badge.findByPk(id);
    }

    async getAll(): Promise<Badge[]> {
        return Badge.findAll();
    }

    async create(data: BadgeCreationAttributes): Promise<Badge> {
        return Badge.create(data);
    }

    async update(gate: Badge, data: Partial<BadgeAttributes>): Promise<Badge> {
        return gate.update(data);
    }

    async delete(gate: Badge): Promise<void> {
        if (gate) await gate.destroy();
    }
}