// index.js (ESM)
import express from "express";
import cors from "cors";
import "dotenv/config"; // auto‐runs dotenv.config()

import registerRoutes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());

registerRoutes(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
