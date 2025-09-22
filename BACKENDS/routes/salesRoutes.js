// routes/salesRoutes.js
import express from "express";
import { authenticate } from "../config/Authenticate.js";
import {
  getAllSales,
  recordSale,
  getDailySales,
} from "../controllers/salesController.js";

const router = express.Router();

router.get("/sales", authenticate, getAllSales);
router.post("/sales", authenticate, recordSale);
router.get("/sales/daily", authenticate, getDailySales);

export default router;
