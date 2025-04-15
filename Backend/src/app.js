import express from 'express';
import fs from 'fs';
import { corsConfig } from './config/cors.js';

const app = express();

app.use(express.json());
app.use(corsConfig);

/* app.get('/', (req, res) => {
    res.send('server running');
}); */

app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html')
    .send('<h1>API</h1><br><li><a href="/characters">api/characters</a></li>');
});

app.get('/characters', (req, res) => {
    try {
        const characterFiles = fs.readdirSync('./data/characters');
        const urls = characterFiles.map((file) => {
            return `characters/${file.replace('.json', '')}`;
        });

        // Set the Content-Type header to text/plain
        res.set('Content-Type', 'application/json');

        // Join the URLs with newlines and send the response
        res.status(200).json(urls);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve characters' });
    }
});

app.get('/characters/:name', (req, res) => {

    const characterName = req.params.name;
    try {
        // Read the JSON file and parse it
        const character = JSON.parse(fs.readFileSync(`./data/characters/${characterName}.json`, 'utf-8'));
        res.status(200).json(character); // Send the parsed JSON as the response
    } catch (error) {
        // Handle errors (e.g., file not found or invalid JSON)
        res.status(404).json({ error: 'Character not found or invalid data' });
    }

});

export default app;