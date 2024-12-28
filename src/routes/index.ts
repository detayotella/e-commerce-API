import { Router } from "express";
import authRoutes from "./authRoutes"
import productRoutes from "./productsRoutes";
import usersRoutes from "./usersRoutes"
import cartRoutes from "./cartRoutes";
import orderRoutes from "./orderRoutes";

const router: Router = Router(); 

router.use("/auth", authRoutes); 
router.use("/products", productRoutes);
router.use("/users", usersRoutes); 
router.use("/carts", cartRoutes);
router.use("/orders", orderRoutes);  

export default router; 