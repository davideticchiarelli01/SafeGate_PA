import { GateRepository } from '../repositories/gateRepository';
import { Gate, GateCreationAttributes, GateUpdateAttributes } from '../models/gate';
import { ErrorFactory } from '../factories/errorFactory';
import { ReasonPhrases } from 'http-status-codes';

/**
 * Service class for handling `Gate` related operations.
 * Provides methods for creating, retrieving, updating, and deleting gates.
 */
export class GateService {
    /**
     * Constructs an instance of `GateService`.
     * @param {GateRepository} repo - The repository layer for `Gate` operations.
     */
    constructor(private repo: GateRepository) {
    }

    /**
     * Retrieves a specific `Gate` by its ID.
     * @param {string} id - The unique identifier of the gate.
     * @returns {Promise<Gate>} The gate if found.
     * @throws {HttpError} If the gate is not found.
     */
    async getGate(id: string): Promise<Gate> {
        const gate: Gate | null = await this.repo.findById(id);
        if (!gate) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Gate not found');
        return gate;
    }

    /**
     * Retrieves all gates from the data source.
     * @returns {Promise<Gate[]>} A list of all gates.
     */
    getAllGates(): Promise<Gate[]> {
        return this.repo.findAll();
    }

    /**
     * Creates a new gate.
     * Ensures that the name is unique before creation.
     * @param {GateCreationAttributes} data - The attributes for creating the gate.
     * @returns {Promise<Gate>} The created gate.
     * @throws {HttpError} If a gate with the same name already exists.
     */
    async createGate(data: GateCreationAttributes): Promise<Gate> {
        const gate: Gate | null = await this.repo.findByName(data.name);
        if (gate) throw ErrorFactory.createError(ReasonPhrases.CONFLICT, 'Gate name already in use');
        return this.repo.create(data);
    }

    /**
     * Updates an existing gate.
     * @param {string} id - The ID of the gate to update.
     * @param {GateUpdateAttributes} data - The fields to update.
     * @returns {Promise<Gate>} The updated gate.
     * @throws {HttpError} If the gate is not found.
     */
    async updateGate(id: string, data: GateUpdateAttributes): Promise<Gate> {
        const gate: Gate | null = await this.repo.findById(id);
        if (!gate) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Gate not found');
        return this.repo.update(gate, data);
    }

    /**
     * Deletes a gate by its ID.
     * @param {string} id - The ID of the gate to delete.
     * @returns {Promise<void>} Resolves when the gate is deleted.
     * @throws {HttpError} If the gate is not found.
     */
    async deleteGate(id: string): Promise<void> {
        const gate: Gate | null = await this.repo.findById(id);
        if (!gate) throw ErrorFactory.createError(ReasonPhrases.NOT_FOUND, 'Gate not found');
        return this.repo.delete(gate);
    }
}
