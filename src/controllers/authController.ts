import {NextFunction, Request, Response} from 'express';
import {AuthService} from '../services/authService';
import {StatusCodes} from "http-status-codes";

export class AuthController {

    constructor(private authService: AuthService) {
    }

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const {email, password} = req.body;

        try {
            const result: object = await this.authService.login(email, password);
            res.status(StatusCodes.OK).json(result);
        } catch (error) {
            next(error);
        }
    }

}

export default AuthController;