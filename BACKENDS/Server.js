import cors from "cors";
import express from "express";
import registrationRouter from "./config/Registration.js";
import adminRouter from "./routes/Admin.js";
import productRoutes from "./routes/productRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";
import pool from "./config/db.js";

class WebServer {
  #port;
  constructor(port) {
    this.#port = process.env.PORT || port;
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
  }

  registerDefaultRoutes() {
    this.app.get("/", (req, res) => {
      res.send("API is running");
    });
  }

  listen() {
    this.app.listen(this.#port, () => {
      console.log(`Server is running on port ${this.#port}`);
    });
  }
}

// Initialize server
const Quantora = new WebServer(5000);

// Middleware / Routers
Quantora.app.use("/api/auth", registrationRouter);
Quantora.app.use("/api/auth", adminRouter);
Quantora.app.use("/api", productRoutes);
Quantora.app.use("/api", salesRoutes);

// Default routes
Quantora.registerDefaultRoutes();

// Start server
Quantora.listen();

export default WebServer;
