// controllers/salesController.js
import * as Sales from "../models/sales_Model.js";

export const getAllSales = async (req, res) => {
  try {
    const [rows] = await Sales.fetchAllSales(req.userId);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching sales" });
  }
};

export const recordSale = async (req, res) => {
  const { productId, quantity, price } = req.body;
  const userId = req.userId;

  if (!productId || !quantity || !price) {
    return res.status(400).json({
      message: "productId, quantity, and price are required.",
    });
  }

  try {
    const [result] = await Sales.insertSale(userId, productId, quantity, price);
    res.status(201).json({
      message: "Sale recorded successfully",
      saleId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error recording sale" });
  }
};

export const getDailySales = async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const [rows] = await Sales.fetchDailySales(req.userId, year);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching daily sales" });
  }
};


