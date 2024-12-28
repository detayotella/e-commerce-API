import { Router } from "express";
import { errorHandler } from "../errrorHandlers";
import authMiddleware from "../middlewares/authMiddleware";
import { addItemToCart, changeQuantity, deleteItemFromCart, getCart } from "../controllers/cartController";

const cartRoutes: Router = Router(); 

cartRoutes.post("/", [authMiddleware], errorHandler(addItemToCart)); 
cartRoutes.get("/", [authMiddleware], errorHandler(getCart)); 
cartRoutes.delete("/:id", [authMiddleware], errorHandler(deleteItemFromCart));
cartRoutes.put("/:id", [authMiddleware], errorHandler(changeQuantity)); 

export default cartRoutes; 