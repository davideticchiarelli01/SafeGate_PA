import { BadgeStatus } from './badgeStatus';

export interface GateTransitsReport {
    gateId: string;
    authorized: number;
    unauthorized: number;
    dpiViolations: number;
}

export interface BadgeTransitsReport {
    badgeId: string;
    authorized: number;
    unauthorized: number;
    status: BadgeStatus;
}