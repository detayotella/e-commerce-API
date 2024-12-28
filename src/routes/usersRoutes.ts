import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import adminMiddleware from "../middlewares/adminMiddleware";
import { errorHandler } from "../errrorHandlers";
import { addAddress, changeUserRole, deleteAddress, getUserById, listAddress, listUsers, updateUser } from "../controllers/usersControllers";

const usersRoutes: Router = Router(); 

usersRoutes.post("/address", [authMiddleware], errorHandler(addAddress)); 
usersRoutes.delete("/address/:id", [authMiddleware, adminMiddleware], errorHandler(deleteAddress)); 
usersRoutes.get("/address", [authMiddleware, adminMiddleware], errorHandler(listAddress)); 
usersRoutes.put("/", [authMiddleware], errorHandler(updateUser));
usersRoutes.put("/:id/role", [authMiddleware, adminMiddleware], errorHandler(changeUserRole)); 
usersRoutes.get("/", [authMiddleware, adminMiddleware], errorHandler(listUsers)); 
usersRoutes.get("/:id", [authMiddleware, adminMiddleware], errorHandler(getUserById)); 

export default usersRoutes; 