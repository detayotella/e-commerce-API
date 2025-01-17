import { Router } from "express";
import { errorHandler } from "../errrorHandlers";
import { createProduct, deleteProduct, getProductById, listProducts, searchProducts, updateProduct } from "../controllers/productsController";
import authMiddleware from "../middlewares/authMiddleware";
import adminMiddleware from "../middlewares/adminMiddleware";

const productRoutes: Router = Router();

productRoutes.post("/", [authMiddleware, adminMiddleware], errorHandler(createProduct)); 
productRoutes.put("/:id", [authMiddleware, adminMiddleware], errorHandler(updateProduct)); 
productRoutes.delete("/:id", [authMiddleware, adminMiddleware], errorHandler(deleteProduct)); 
productRoutes.get("/", [authMiddleware, adminMiddleware], errorHandler(listProducts)); 
productRoutes.get("/search", [authMiddleware], errorHandler(searchProducts)); 
productRoutes.get("/:id", [authMiddleware, adminMiddleware], errorHandler(getProductById)); 

export default productRoutes; 