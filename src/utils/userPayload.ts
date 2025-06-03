import { ErrorFactory } from "../factories/errorFactory";
import { ReasonPhrases } from "http-status-codes";
import { UserRole } from "../enum/userRoles";

export interface UserPayload {
    id: string;
    email: string;
    role: string;
}

/**
 * Validates the provided user payload to ensure it contains all necessary fields.
 * Throws an error if the validation fails.
 *
 * @param {UserPayload} payload - The user payload object to be validated.
 * @throws {Error} If the payload is missing or does not contain the required fields: id, email, or role.
 * @returns {UserPayload} The validated user payload object.
 */
export const validateUserPayload = (payload: UserPayload): UserPayload => {
    if (!payload) {
        throw ErrorFactory.createError(ReasonPhrases.UNAUTHORIZED, 'User payload is missing');
    }

    const requiredFields: (keyof UserPayload)[] = ['id', 'email', 'role'];
    const missingFields = requiredFields.filter(field => !payload[field] || typeof payload[field] !== 'string' || payload[field].trim() === '');

    if (missingFields.length > 0) {
        throw ErrorFactory.createError(
            ReasonPhrases.UNAUTHORIZED,
            `Invalid user payload: missing or empty fields: ${missingFields.join(', ')}`
        );
    }

    if (!Object.values(UserRole).includes(payload.role as UserRole)) {
        throw ErrorFactory.createError(
            ReasonPhrases.UNAUTHORIZED,
            `Invalid user payload: role must be one of: ${Object.values(UserRole).join(', ')}, found: ${payload.role}`
        );
    }

    return payload;
};