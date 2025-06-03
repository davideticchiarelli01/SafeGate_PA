import { User } from '../models/user';
import bcrypt from 'bcrypt';
import { getPrivateJwtKey, jwtSign } from "../utils/jwt";
import { UserPayload } from "../utils/userPayload";
import { UserRepository } from "../repositories/userRepository";
import { ErrorFactory } from "../factories/errorFactory";
import { ReasonPhrases } from "http-status-codes";

export class AuthService {

    constructor(private userRepository: UserRepository) {
    }

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
