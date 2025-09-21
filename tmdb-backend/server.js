import express from 'express';
import axios from 'axios';  // Importation correcte d'axios
import { config } from 'dotenv';
import cors from 'cors';


config();  // Charger les variables d'environnement depuis le fichier .env

const app = express();
// const cors = require('cors');
const port = process.env.PORT || 5001;

const apiKey = process.env.TMDB_API_KEY;  // Votre clé API TMDB  

// Permettre les requêtes cross-origin
app.use(cors());

// Fonction pour obtenir des données de l'API TMDB avec la clé API
const getMoviesFromTMDB = async (endpoint) => {
    const url = `https://api.themoviedb.org/3${endpoint}&api_key=${apiKey}`;  // Format de l'URL pour TMDB
    const response = await axios.get(url);  // Utilisation d'axios pour effectuer la requête GET
    return response.data;  // Retour des données de la réponse
};





// 1. Endpoint du 2eme appel de Form.js pour récupérer la liste des genres de films
app.get('/api/genre/movie/list', async (req, res) => {
    const { language } = req.query;  // Récupérer la langue depuis les paramètres de la requête
    try {
        const data = await getMoviesFromTMDB(`/genre/movie/list?language=${language}`);
        res.json(data);  // Retourner la réponse sous forme JSON
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération des genres');
    }
});

// 2. Endpoint du 1er appel dans Form.js pour rechercher des films en fonction du terme "query"
app.get('/api/search/movie', async (req, res) => {
    const { query, language } = req.query;
    // Récupérer la requête de recherche et la langue
    try {
        const data = await getMoviesFromTMDB(`/search/movie?query=${query}&language=${language}`);
        res.json(data);  // Retourner la réponse sous forme JSON
    } catch (error) {
        res.status(500).send('Erreur lors de la recherche des films');
    }
});

// 3. Endpoint de Card pour récupérer les vidéos d'un film spécifique par son ID
app.get('/api/movies/:id/videos', async (req, res) => {
    const { id } = req.params;  // Récupérer l'ID du film depuis les paramètres de la requête
    const { language } = req.query;  // Récupérer la langue depuis les paramètres de la requête
    try {
        const data = await getMoviesFromTMDB(`/movie/${id}/videos?language=${language}`);
        res.json(data);  // Retourner la réponse sous forme JSON
    } catch (error) {
        console.error('Erreur lors de la récupération des vidéos:', error);
        res.status(500).send('Erreur lors de la récupération des vidéos');
    }
});

// 3bis. Endpoint de Card pour récupérer les crédits et les recommandations via un modal

app.get('/api/movies/:id/credits', async (req, res) => {
    const movieId = req.params.id;
    const apiKey = process.env.TMDB_API_KEY; // Assurez-vous que votre clé API TMDb est correctement configurée

    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
            params: {
                api_key: apiKey,
                language: 'fr-FR' // Vous pouvez ajuster la langue selon vos besoins
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(`Erreur lors de la récupération des crédits pour le film ID: ${movieId}`, error);
        res.status(500).json({ error: "Erreur lors de la récupération des crédits du film" });
    }
});


app.get('/api/movies/:id/recommendations', async (req, res) => {
    const movieId = req.params.id;
    const apiKey = process.env.TMDB_API_KEY;

    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/recommendations`, {
            params: {
                api_key: apiKey,
                language: 'fr-FR'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(`Erreur lors de la récupération des recommandations pour le film ID: ${movieId}`, error);
        res.status(500).json({ error: "Erreur lors de la récupération des recommandations du film" });
    }
});





// 4. Endpoint du 1er appel dans VintageForm.js pour rechercher des films avec un terme "debouncedSearchQuery"
app.get('/api/search/movie', async (req, res) => {
    const { query, language } = req.query;  // Récupérer la requête de recherche et la langue
    try {
        const data = await getMoviesFromTMDB(`/search/movie?query=${query}&language=${language}`);
        res.json(data);  // Retourner la réponse sous forme JSON
    } catch (error) {
        res.status(500).send('Erreur lors de la recherche des films');
    }
});





// 5. Endpoint du 2ème appel de VintageForm.js pour découvrir des films par plage de dates et langue

app.get('/api/discover/movie', async (req, res) => {
    try {
        const apiKey = process.env.TMDB_API_KEY; // Récupérer la clé API

        // 🛑 Récupération des paramètres depuis la requête
        const { from, to, lang } = req.query;


        console.log("Params reçus :", req.query); // Debugging

        const response = await axios.get("https://api.themoviedb.org/3/discover/movie", {
            params: {
                'primary_release_date.gte': from || '1940-01-01', // Valeur par défaut
                'primary_release_date.lte': to || '1949-12-31',   // Valeur par défaut
                with_original_language: lang || 'fr', // Valeur par défaut
                language: 'fr-FR',
                api_key: apiKey
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Erreur API TMDB :", error.response?.data || error.message);
        res.status(500).json({ error: "Erreur lors de la récupération des films" });
    }
});





// 6. Endpoint pour récupérer un film populaire spécifique par son ID
app.get('/api/movies/popular/:id', async (req, res) => {
    const { id } = req.params;  // Récupérer l'ID du film depuis les paramètres de la requête
    const { language } = req.query;  // Récupérer la langue depuis les paramètres de la requête
    try {
        const data = await getMoviesFromTMDB(`/movie/${id}?language=${language}`);
        res.json(data);  // Retourner la réponse sous forme JSON
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération du film populaire');
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
