import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Proxy API requests to freetogame.com - MUST be before static files
app.get('/api/games', async (req, res) => {
  try {
    const { platform, category } = req.query;
    let apiUrl = 'https://www.freetogame.com/api/games';
    
    const params = [];
    if (platform) params.push(`platform=${platform}`);
    if (category) params.push(`category=${category}`);
    if (params.length > 0) apiUrl += `?${params.join('&')}`;

    console.log('Fetching from:', apiUrl);
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games', details: error.message });
  }
});

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// Handle client-side routing - MUST be last
app.get('/*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
