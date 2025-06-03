import {Gate} from "../models/gate";
import {DPI} from "../enum/dpi";
import {GateDao} from "../dao/gateDao";
import {GateRepository} from "../repositories/gateRepository";

export class GateService {

    constructor(private gateRepository: GateRepository) {

    }

    async getGate(id: string): Promise<Gate | null> {
        return this.gateRepository.findById(id);
    }

    async getAllGates(): Promise<Gate[]> {
        return this.gateRepository.findAll();
    }

    async createGate(data: { name: string, requiredDPIs: DPI[] }): Promise<Gate> {
        return this.gateRepository.create(data);
    }

    async updateGate(id: string, gate: Gate): Promise<Gate | null> {
        return this.gateRepository.update(id, gate);
    }

    async deleteGate(id: string): Promise<void> {
        await this.gateRepository.delete(id);
    }
}
