import { User } from '../models/user';
import bcrypt from 'bcrypt';
import { getPrivateJwtKey, jwtSign } from "../utils/jwt";
import { UserPayload } from "../utils/userPayload";
import { UserRepository } from "../repositories/userRepository";
import { ErrorFactory } from "../factories/errorFactory";
import { ReasonPhrases } from "http-status-codes";

/**
 * Service class for handling authentication-related operations.
 * Provides methods for user login and JWT generation.
 */
export class AuthService {

    /**
     * Constructs an instance of `AuthService`.
     * @param {UserRepository} userRepository - The repository layer for `User` operations.
     */
    constructor(private userRepository: UserRepository) {
    }

    /**
     * Authenticates a user by verifying email and password, and returns a signed JWT.
     * @param {string} inputEmail - The email provided by the user.
     * @param {string} inputPassword - The plain-text password provided by the user.
     * @returns {Promise<object>} A success message and JWT token if credentials are valid.
     * @throws {HttpError} If user is not found or password is invalid.
     * @throws {Error} If JWT signing fails.
     */
    login = async (inputEmail: string, inputPassword: string): Promise<object> => {
        const user: User | null = await this.userRepository.findByEmail(inputEmail);

        if (!user) {
            throw ErrorFactory.createError(ReasonPhrases.UNAUTHORIZED, `No user found with email "${inputEmail}".`);
        }

        const isMatch: boolean = await bcrypt.compare(inputPassword, user.password);

        if (!isMatch) {
            throw ErrorFactory.createError(ReasonPhrases.UNAUTHORIZED, 'Password invalid');
        }

        try {
            const { id, email, role } = user;
            const userPayload: UserPayload = { id, email, role };
            //validateUserPayload(userPayload);

            const privateKey: string = await getPrivateJwtKey();
            const token: string = jwtSign<UserPayload>(userPayload, privateKey);

            return {
                message: 'Login successful',
                token
            };
        } catch (e) {
            console.error('Error signing JWT:', e);
            throw e;
        }
    }
}
