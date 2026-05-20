import { Router } from 'express';
import authController from '../controllers/authController.js';

const authRouter = Router();

authRouter.get('/signup', authController.getSignUp);
authRouter.post('/signup', authController.postSignUp);

authRouter.get('/login', authController.getLogIn);
authRouter.post('/login', authController.postLogIn);

authRouter.get('/logout', authController.logOut);

export default authRouter;
