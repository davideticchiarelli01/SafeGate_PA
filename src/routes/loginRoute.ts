import { Router } from 'express';
import { UserDao } from "../dao/userDao";
import { UserRepository } from "../repositories/userRepository";
import { AuthService } from "../services/authService";
import AuthController from '../controllers/authController';
import { validateLogin } from "../middlewares/loginMiddleware";

/**
 * Express router for handling authentication routes.
 * Provides endpoint for user login.
 */
const userDao: UserDao = new UserDao();
const userRepository: UserRepository = new UserRepository(userDao);
const authService: AuthService = new AuthService(userRepository);
const authController: AuthController = new AuthController(authService);

const loginRouter = Router();

/**
 * Route to authenticate a user and generate a JWT.
 * @route POST /login
 * @middleware validateLogin - Validates email and password fields in the request body.
 * @controller authController.login - Handles authentication logic and token generation.
 */
loginRouter.post('/login', validateLogin, authController.login);

export default loginRouter;
