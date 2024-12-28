import { Router } from "express"; 
import { errorHandler } from "../errrorHandlers";
import authMiddleware from "../middlewares/authMiddleware";
import { cancelOrder, createOrder, getOrderById } from "../controllers/ordersController";
import adminMiddleware from "../middlewares/adminMiddleware";
import { listUserOrders, changeStatus, listOrders } from "../controllers/ordersController";

const orderRoutes: Router = Router(); 

orderRoutes.post("/", [authMiddleware], errorHandler(createOrder));  
orderRoutes.put("/:id/cancel", [authMiddleware], errorHandler(cancelOrder)); 
orderRoutes.get("/index", [authMiddleware, adminMiddleware], errorHandler(listOrders)); 
orderRoutes.get("/users/:id", [authMiddleware, adminMiddleware], errorHandler(listUserOrders)); 
orderRoutes.put("/:id/status", [authMiddleware, adminMiddleware], errorHandler(changeStatus));
orderRoutes.get("/:id", [authMiddleware], errorHandler(getOrderById));

export default orderRoutes; 