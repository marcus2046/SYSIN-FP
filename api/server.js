const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'mydatabase',
  port: 5432,
});

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

app.get('/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Pokémon Lookup Route (without /api prefix)
app.get('/pokemon/:name', async (req, res) => {
    try {
        const pokemonName = req.params.name.toLowerCase();
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        
        if (!response.ok) {
            return res.status(404).json({ error: 'Pokémon not found' });
        }
        
        const data = await response.json();
        
        res.json({
            name: data.name,
            id: data.id,
            sprite: data.sprites.front_default,
            types: data.types.map(t => t.type.name)
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch from PokeAPI' });
    }
});
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
