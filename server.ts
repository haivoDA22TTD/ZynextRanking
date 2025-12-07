// server.ts
import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname trong ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Proxy API để bỏ CORS
app.get('/api/games', async (req, res) => {
  try {
    const response = await axios.get('https://www.freetogame.com/api/games');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

// Serve file tĩnh của Vite sau khi build
app.use(express.static(path.join(__dirname, 'dist')));

// SPA: mọi route còn lại trả về index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
