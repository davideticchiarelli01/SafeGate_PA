import { Gate, GateCreationAttributes, GateUpdateAttributes } from "../models/gate";
import { IDao } from "./dao";

/**
 * Data Access Object (DAO) for the `Gate` model.
 * Provides methods to interact with the database for `Gate` entities.
 * Implements the `IDao` interface for consistency across DAOs.
 */
export class GateDao implements IDao<Gate, GateCreationAttributes, GateUpdateAttributes> {

    /**
     * Retrieves a `Gate` record by its primary key (ID).
     * @param {string} id - UUID of the gate to retrieve.
     * @returns {Promise<Gate | null>} - The `Gate` record if found, otherwise `null`.
     */
    async get(id: string): Promise<Gate | null> {
        return await Gate.findByPk(id);
    }

    /**
     * Retrieves all `Gate` records from the database.
     * @returns {Promise<Gate[]>} - An array of all `Gate` records.
     */
    async getAll(): Promise<Gate[]> {
        return await Gate.findAll();
    }

    /**
     * Retrieves a `Gate` record by its unique name.
     * @param {string} name - The unique name of the gate.
     * @returns {Promise<Gate | null>} - The `Gate` record if found, otherwise `null`.
     */
    async getByName(name: string): Promise<Gate | null> {
        return await Gate.findOne({ where: { name } });
    }

    /**
     * Creates a new `Gate` record in the database.
     * @param {GateCreationAttributes} data - The data required to create a new `Gate`.
     * @returns {Promise<Gate>} - The newly created `Gate` record.
     */
    async create(data: GateCreationAttributes): Promise<Gate> {
        return await Gate.create(data);
    }

    /**
     * Updates an existing `Gate` record in the database.
     * @param {Gate} gate - The gate instance to update.
     * @param {GateUpdateAttributes} data - The data to update on the gate.
     * @returns {Promise<Gate>} - The updated `Gate` record.
     */
    async update(gate: Gate, data: GateUpdateAttributes): Promise<Gate> {
        return await gate.update(data);
    }

    /**
     * Deletes a `Gate` record from the database.
     * @param {Gate} gate - The gate instance to delete.
     * @returns {Promise<void>} - Resolves when the gate is successfully deleted.
     */
    async delete(gate: Gate): Promise<void> {
        return await gate.destroy();
    }
}