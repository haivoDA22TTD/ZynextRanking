// server.ts
import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Proxy API để bỏ hoàn toàn lỗi CORS
app.get("/api/games", async (req, res) => {
  try {
    const response = await axios.get("https://www.freetogame.com/api/games");
    res.json(response.data);
  } catch (error: any) {
    console.error("Proxy error:", error.message);
    res.status(500).json({ error: "Failed to fetch games" });
  }
});

// Serve file tĩnh sau khi vite build
app.use(express.static(path.join(__dirname, "dist")));

// SPA routing: mọi route còn lại trả về index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
