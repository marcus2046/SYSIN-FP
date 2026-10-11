const express = require('express');
const app = express();

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// GET /pokemon/:name (proxy handles /api/pokemon/pikachu -> /pokemon/pikachu)
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

if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`pokemon-api running on port ${PORT}`));
}

module.exports = app;