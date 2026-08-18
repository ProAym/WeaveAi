import { Router } from "express";
import { login, logout, me, register, googleAuth, updateProfile, updatePassword} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const authRouter = Router();

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/google', googleAuth)
authRouter.post('/logout', logout)
authRouter.get('/me', authMiddleware, me)
authRouter.put('/profile', authMiddleware, updateProfile)
authRouter.put('/password', authMiddleware, updatePassword)


export default authRouter;


