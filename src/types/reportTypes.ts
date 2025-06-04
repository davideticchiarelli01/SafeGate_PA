export interface GateTransitsReport {
    gateId: string;
    authorized: number;
    unauthorized: number;
    dpiViolations: number;
}