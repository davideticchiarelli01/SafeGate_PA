import { Router } from 'express';
import { UserDao } from "../dao/userDao";
import { UserRepository } from "../repositories/userRepository";
import { AuthService } from "../services/authService";
import AuthController from '../controllers/authController';
import { validateLogin } from '../middlewares/loginMiddleware';

const userDao: UserDao = new UserDao();
const userRepository: UserRepository = new UserRepository(userDao);
const authService: AuthService = new AuthService(userRepository);
const authController: AuthController = new AuthController(authService);

const loginRouter = Router();

loginRouter.post('/login', validateLogin, authController.login);


export default loginRouter;
