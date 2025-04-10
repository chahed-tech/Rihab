const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const dataFilePath = path.join(__dirname, 'src', 'data', 'database.json');

// Route pour sauvegarder les données
app.post('/api/save-data', async (req, res) => {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(req.body, null, 2));
    res.status(200).json({ message: 'Données sauvegardées avec succès' });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    res.status(500).json({ error: 'Erreur lors de la sauvegarde des données' });
  }
});

// Route pour récupérer les données
app.get('/api/data', async (req, res) => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    res.status(200).json(JSON.parse(data));
  } catch (error) {
    console.error('Erreur lors de la lecture des données:', error);
    res.status(500).json({ error: 'Erreur lors de la lecture des données' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 