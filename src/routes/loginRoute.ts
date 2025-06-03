import { Router } from 'express';
import { UserDao } from "../dao/userDao";
import { UserRepository } from "../repositories/userRepository";
import { AuthService } from "../services/authService";
import AuthController from '../controllers/authController';

const userDao: UserDao = new UserDao();
const userRepository: UserRepository = new UserRepository(userDao);
const authService: AuthService = new AuthService(userRepository);
const authController: AuthController = new AuthController(authService);

const authRouter = Router();

authRouter.post('/login', authController.login);


export default authRouter;
