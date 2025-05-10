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
// const getMoviesFromTMDB = async (endpoint) => {
//     const url = `https://api.themoviedb.org/3${endpoint}&api_key=${apiKey}`;  // Format de l'URL pour TMDB
//     const response = await axios.get(url);  // Utilisation d'axios pour effectuer la requête GET
//     return response.data;  // Retour des données de la réponse
// };
const getMoviesFromTMDB = async (endpoint) => {
    const url = `https://api.themoviedb.org/3${endpoint}&api_key=${apiKey}`;
    console.log(`Requesting TMDB URL: ${url}`); // Log l'URL pour vérifier
    try {
        const response = await axios.get(url); // Effectue la requête GET
        return response.data; // Retourne les données de la réponse
    } catch (error) {
        console.error('Error fetching data from TMDB:', error.message);
        throw error; // Relance l’erreur pour être gérée ailleurs
    }
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
    const { query, language } = req.query;  // Récupérer la requête de recherche et la langue
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
// app.get('/api/discover/movie', async (req, res) => {
//     console.log('Request received with params:', req.query);  // Log des paramètres de la requête
//     const { startDate, endDate, language } = req.query;  // Récupérer les dates et la langue depuis la requête
//     try {
//         // Vérifiez si les paramètres sont corrects avant de faire la requête
//         if (!startDate || !endDate || !language) {
//             return res.status(400).send('Missing required query parameters');
//         }
//         // &with_original_language=${language}&language=${language}
//         const data = await getMoviesFromTMDB(`/discover/movie?primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}&with_original_language=${language}&language=${language}`);
//         res.json(data);  // Retourner la réponse sous forme JSON
//     } catch (error) {
//         res.status(500).send('Erreur lors de la récupération des films populaires');
//     }
// });



app.get('/api/discover/movie', async (req, res) => {
    console.log('Backend params received:', { startDate, endDate, language });
    console.log('Request received with params:', req.query);  // Log des paramètres de la requête
    const { 'primary_release_date.gte': startDate, 'primary_release_date.lte': endDate, language } = req.query;  // Adaptez pour correspondre aux noms envoyés par le frontend
    try {
        if (!startDate || !endDate || !language) {
            return res.status(400).send('Missing required query parameters');
        }
        const data = await getMoviesFromTMDB(`/discover/movie?primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}&with_original_language=${language}&language=${language}`);
        res.json(data);  // Retourner la réponse sous forme JSON
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération des films populaires');
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
    console.log(`Server running at http://localhost:${port}`);
});
