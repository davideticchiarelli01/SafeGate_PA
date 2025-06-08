import { Gate, GateCreationAttributes, GateUpdateAttributes } from '../models/gate';
import { GateDao } from '../dao/gateDao';
import { IRepository } from "./repository";

/**
 * Repository class for managing `Gate` entities.
 * Acts as an intermediary between the `GateDao` and the service layer.
 * Implements the `IRepository` interface.
 */
export class GateRepository implements IRepository<Gate, GateCreationAttributes, GateUpdateAttributes> {

    /**
     * Constructs an instance of `GateRepository`.
     * @param {GateDao} dao - The DAO used for direct database access for gates.
     */
    constructor(private dao: GateDao) {
    }

    /**
     * Retrieves a `Gate` by its unique ID.
     * @param {string} id - The ID of the gate.
     * @returns {Promise<Gate | null>} The gate if found, otherwise null.
     */
    async findById(id: string): Promise<Gate | null> {
        return this.dao.get(id);
    }

    /**
     * Retrieves all gates from the database.
     * @returns {Promise<Gate[]>} A list of all gates.
     */
    findAll(): Promise<Gate[]> {
        return this.dao.getAll();
    }

    /**
     * Retrieves a `Gate` by its name.
     * @param {string} name - The name of the gate.
     * @returns {Promise<Gate | null>} The gate if found, otherwise null.
     */
    findByName(name: string): Promise<Gate | null> {
        return this.dao.getByName(name);
    }

    /**
     * Creates a new `Gate`.
     * @param {GateCreationAttributes} data - The data used to create the gate.
     * @returns {Promise<Gate>} The created gate.
     */
    create(data: GateCreationAttributes): Promise<Gate> {
        return this.dao.create(data);
    }

    /**
     * Updates an existing `Gate`.
     * @param {Gate} gate - The gate instance to update.
     * @param {GateUpdateAttributes} data - The updated fields.
     * @returns {Promise<Gate>} The updated gate.
     */
    update(gate: Gate, data: GateUpdateAttributes): Promise<Gate> {
        return this.dao.update(gate, data);
    }

    /**
     * Deletes a `Gate` from the database.
     * @param {Gate} gate - The gate instance to delete.
     * @returns {Promise<void>} Resolves when deletion is complete.
     */
    delete(gate: Gate): Promise<void> {
        return this.dao.delete(gate);
    }
}
