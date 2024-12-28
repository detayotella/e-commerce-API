import { Router } from "express";
import { login, me, signup } from "../controllers/authController";
import { errorHandler } from "../errrorHandlers";
import authMiddleware from "../middlewares/authMiddleware";

const router: Router = Router(); 

// errorHandler will return a function and that function
// will be a controller function 
router.post("/signup", errorHandler(signup)); 
router.post("/login", errorHandler((login))); 
router.get("/me", authMiddleware, errorHandler(me)); 

export default router; 