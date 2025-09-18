import pool from "../config/db.js";

export const getAllProducts = (userId) =>
  pool.query("SELECT * FROM products WHERE user_id = ? ORDER BY name ASC", [userId]);

export const getProductById = (id, userId) =>
  pool.query("SELECT * FROM products WHERE id = ? AND user_id = ? ", [id, userId]);

export const createProduct = (userId, name, price, stock, category) =>
  pool.query(
    "INSERT INTO products (user_id, name, price, units, category) VALUES (?, ?, ?, ?, ?)",
    [userId, name, price, stock, category]
  );

export const updateProduct = (id, userId, name, price, stock, category) =>
  pool.query(
    "UPDATE products SET name = ?, price = ?, units = ?, category = ? WHERE id = ? AND user_id = ?",
    [name, price, stock, category, id, userId]
  );

export const deleteProduct = (id, userId) =>
  pool.query("DELETE FROM products WHERE id = ? AND user_id = ?", [id, userId]);
