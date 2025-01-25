import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import Card from '../components/Card';



const Favorites = () => {
    const [listMoviesData, setListMoviesData] = useState([]);

    useEffect(() => {
        // Récupére les IDs des films stockés dans localStorage

        let moviesId = window.localStorage.movies ? window.localStorage.movies.split(",") : [];

        let uniqueMoviesId = [...new Set(moviesId)]; // Éliminer les doublons

        // Si aucun film n'est sauvegardé, rien à faire
        if (uniqueMoviesId.length === 0) {
            return;
        }

        // Utilise Promise.all pour gérer plusieurs requêtes API en parallèle
        const fetchMovies = uniqueMoviesId.map(id =>
            axios.get(`http://localhost:5001/api/movies/popular/${id}?language=fr-FR
`)
        );

        // Attendre que toutes les requêtes API soient terminées
        Promise.all(fetchMovies)
            .then(responses => {
                // Extraire les données des films depuis les réponses
                const moviesData = responses.map(res => res.data);
                setListMoviesData(moviesData); // Mettre à jour l'état avec les films récupérés
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des films favoris', error);
            });
    }, []);



    return (
        <div className='user-list-page'>
            <Header />

            <h2>
                Films Préférés             <span>💛

                </span>
            </h2>

            <div className="result">
                {listMoviesData.length === 0 ? (
                    <p>Aucun film favori pour l'instant</p>
                ) : (
                    listMoviesData.map((movie) => <Card movie={movie} key={movie.id} />
                    ))}
            </div>

        </div>


    );
};

export default Favorites;