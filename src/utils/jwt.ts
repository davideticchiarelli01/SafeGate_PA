import path from "path";
import * as fs from "node:fs";
import { ErrorFactory, HttpError } from "../factories/errorFactory";
import { ReasonPhrases } from "http-status-codes";
import jwt, { JsonWebTokenError, NotBeforeError, TokenExpiredError } from "jsonwebtoken";

/**
 * An object containing file paths for public and private JWT keys.
 *
 * @typedef {Object} KEY_PATHS
 * @property {string} public - The file path to the public key used for JWT verification.
 * @property {string} private - The file path to the private key used for JWT signing.
 */
const KEY_PATHS: { public: string; private: string; } = {
    public: path.join(process.cwd(), 'jwt_keys', 'jwtRS256.key.pub'),
    private: path.join(process.cwd(), 'jwt_keys', 'jwtRS256.key')
};

/**
 * Reads a JWT key from the specified file path.
 * If the key cannot be read, it throws an appropriate error based on the encountered issue.
 *
 * @param {string} keyPath - The path to the file containing the JWT key.
 * @param {string} errorMsg - The error message to include if an error occurs.
 * @return {Promise<string>} A promise that resolves to the contents of the file as a string.
 * @throws {HttpError} If a known HTTP-related error is encountered.
 * @throws {Error} If another filesystem-related error occurs, mapped to the corresponding HTTP status reason phrase.
 */
async function readJwtKey(keyPath: string, errorMsg: string): Promise<string> {
    try {
        return await fs.promises.readFile(keyPath, 'utf8');
    } catch (e) {

        const code = (e as NodeJS.ErrnoException)?.code || 'UNKNOWN_ERROR';
        const msg = (e as NodeJS.ErrnoException)?.message || "Error: Unknown error";

        const errorMap: Record<string, ReasonPhrases> = {
            'ENOENT': ReasonPhrases.NOT_FOUND,
            'EACCES': ReasonPhrases.FORBIDDEN,
            'EPERM': ReasonPhrases.FORBIDDEN,
            'EISDIR': ReasonPhrases.BAD_REQUEST,
            'ENOTDIR': ReasonPhrases.BAD_REQUEST,
            'EMFILE': ReasonPhrases.INTERNAL_SERVER_ERROR,
            'ENAMETOOLONG': ReasonPhrases.BAD_REQUEST,
            'EBADF': ReasonPhrases.INTERNAL_SERVER_ERROR,
            'ELOOP': ReasonPhrases.BAD_REQUEST,
            'ENOSPC': ReasonPhrases.INTERNAL_SERVER_ERROR,
            'EROFS': ReasonPhrases.FORBIDDEN,
            'EINVAL': ReasonPhrases.BAD_REQUEST,
            'EIO': ReasonPhrases.INTERNAL_SERVER_ERROR,
            'UNKNOWN_ERROR': ReasonPhrases.INTERNAL_SERVER_ERROR
        };

        const errorType: ReasonPhrases = errorMap[code];
        const detailedMessage = `${errorMsg}. ${msg}`

        throw ErrorFactory.createError(errorType, detailedMessage, e as Error);
    }
}

/**
 * Retrieves the public JWT key as a string.
 *
 * @function
 * @returns {Promise<string>} A promise that resolves to the public JWT key.
 * @throws Will throw an error if the public key cannot be found.
 */
export const getPublicJwtKey = (): Promise<string> =>
    readJwtKey(KEY_PATHS.public, 'Public key not found');

/**
 * Asynchronously retrieves the private JWT (JSON Web Token) key.
 *
 * This function fetches the private key from a predefined file path and
 * returns it as a string. The function will throw an error if the private key
 * is not found at the specified location.
 *
 * @function
 * @returns {Promise<string>} A promise resolving to the private JWT key as a string.
 * @throws Will throw an error if the private key is not found.
 */
export const getPrivateJwtKey = (): Promise<string> =>
    readJwtKey(KEY_PATHS.private, 'Private key not found');


/**
 * Extracts and validates a JWT token from the provided authorization header.
 *
 * @param {string | undefined} authHeader - The authorization header containing the token,
 * which typically follows the format "Bearer <token>".
 * @returns {string} The extracted JWT token if the authorization header is valid.
 * @throws {Error} If the authorization header is missing, improperly formatted, or does not contain a token.
 */
export const extractAndValidateJwtToken = (authHeader: string | undefined): string => {
    if (!authHeader) {
        throw ErrorFactory.createError(ReasonPhrases.UNAUTHORIZED, 'Authorization header missing');
    }

    const parts = authHeader.trim().split(/\s+/);
    if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
        throw ErrorFactory.createError(ReasonPhrases.UNAUTHORIZED, 'Malformed or missing token');
    }

    const [, token] = parts;
    return token;
};

/**
 * Signs a given payload to create a JSON Web Token (JWT) using the RS256 algorithm.
 *
 * @template T - The type of the payload object to be signed.
 * @param {T} payload - The payload object to include in the JWT.
 * @param {string} privateKey - The private key used to sign the JWT.
 * @returns {string} The signed JWT as a string.
 * @throws {HttpError} Thrown when an HTTP-related error occurs during token signing.
 * @throws {JsonWebTokenError} Thrown when a JSON Web Token-specific error occurs during the signing process.
 * @throws {Error} Thrown for unexpected errors encountered during the signing process.
 */
export const jwtSign = <T extends object>(payload: T, privateKey: string): string => {
    try {
        return jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1h',
        });
    } catch (e) {

        if (e instanceof JsonWebTokenError) {
            console.error('JWT sign error:', e.message);
            throw ErrorFactory.createError(ReasonPhrases.INTERNAL_SERVER_ERROR, `JWT sign error: ${e.message}`, e);
        } else {
            console.error('Unexpected error signing JWT:', e);
            const msg = `JWT sign error: ${(e as Error).message || 'Unknown error'}`;
            throw ErrorFactory.createError(ReasonPhrases.INTERNAL_SERVER_ERROR, msg, e as Error);
        }
    }
};

/**
 * Verifies a JSON Web Token (JWT) using the specified public key and returns the decoded payload.
 *
 * @template T The expected type of the decoded payload.
 * @param {string} token The JWT string to verify.
 * @param {string} publicKey The public key used to verify the JWT signature.
 * @throws {Error} Throws an error if token verification fails or an unexpected error occurs.
 * @returns {T} The decoded payload of the JWT.
 */
export const jwtVerify = <T>(
    token: string,
    publicKey: string,
): T => {

    try {
        return jwt.verify(token, publicKey, {
            algorithms: ['RS256'],
        }) as T;

    } catch (e) {
        let status: ReasonPhrases;
        let message: string;

        if (
            e instanceof TokenExpiredError ||
            e instanceof NotBeforeError ||
            e instanceof JsonWebTokenError
        ) {
            status = ReasonPhrases.UNAUTHORIZED;
            message = `JWT verification error: ${e.message}`;
            console.error('JWT verification error:', e);
        } else {
            status = ReasonPhrases.INTERNAL_SERVER_ERROR;
            message = 'Token verification failed';
            console.error('Unexpected JWT error:', e);
        }

        throw ErrorFactory.createError(status, message, e as Error);
    }

};

