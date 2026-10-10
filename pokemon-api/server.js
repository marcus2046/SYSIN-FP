const express = require('express');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
res.status(200).json({ status: 'ok', module: 'pokemon-api' });
});

app.get('/pokemon/:name', async (req, res) => {
try {
const { name } = req.params;
const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
if (!response.ok) {
  return res.status(response.status).json({ error: 'Pokemon not found' });
}
const data = await response.json();
res.json({ name: data.name, id: data.id, types: data.types.map(t => t.type.name) });
} catch (err) {
res.status(502).json({ error: 'Failed to reach PokeAPI' });
}
});

if (require.main === module) {
app.listen(process.env.PORT || 3001, () => console.log('pokemon-api listening on port 3001'));
}

module.exports = app;
