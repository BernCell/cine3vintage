import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Card = ({ movie }) => {
    const imageRef = useRef(null);  // Référence à l'image
    const [trailerKey, setTrailerKey] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [modalMovie, setModalMovie] = useState(null); // Film actuellement affiché dans le modal
    const [details, setDetails] = useState(null); // Détails du film (cast, crew)
    const [recommendations, setRecommendations] = useState([]); // Recommandations
    const [loadingDetails, setLoadingDetails] = useState(false); // Spinner pour le chargement des détails






    const handleMovieClick = (recMovie) => {
        setLoadingDetails(true); // Afficher le spinner

        // Récupérer les détails et recommandations du film cliqué
        axios.get(`http://localhost:5001/api/movies/${recMovie.id}/credits?language=fr-FR`)
            .then((res) => {
                setDetails(res.data);
                setModalMovie(recMovie);
                console.log(modalMovie)
                return axios.get(`http://localhost:5001/api/movies/${recMovie.id}/recommendations?language=fr-FR`);
            })
            .then((res) => {
                const filteredRecommendations = res.data.results.filter((movie) => {
                    const releaseDate = movie.release_date;
                    return releaseDate >= '1940-01-01' && releaseDate <= '1980-12-31';
                });
                setRecommendations(filteredRecommendations);
            })
            .catch((error) => {
                console.error("Erreur lors du chargement des détails :", error);
                if (error.response) {
                    // La requête a été faite et le serveur a répondu avec un code de statut qui
                    // ne tombe pas dans la plage des 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // La requête a été faite mais aucune réponse n'a été reçue
                    console.log(error.request);
                } else {
                    // Quelque chose s'est passé lors de la configuration de la requête qui a déclenché une erreur
                    console.log('Error', error.message);
                }
            })
            .finally(() => setLoadingDetails(false));

    };







    const closeModal = () => {
        setModalMovie(null); // Fermer le modal
        setDetails(null); // Réinitialiser les détails
        setRecommendations([]); // Réinitialiser les recommandations
    };

    const fetchTrailer = async () => {
        try {
            const trailerResponse = await axios.get(
                `http://localhost:5001/api/movies/${movie.id}/videos?language=fr-FR`
            );
            const trailers = trailerResponse.data.results;

            if (trailers.length > 0) {
                // Si des bandes-annonces existent, obtenir le trailer de Dailymotion ou YouTube
                const trailerKey = trailers[0].key; // On choisit d'afficher le premier trailer
                setTrailerKey(trailerKey);
            } else {
                setTrailerKey(null); // Pas de bande-annonce
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de la bande-annonce :', error);
            setTrailerKey(null); // Si erreur, pas de bande-annonce
        }
    };



    const handlePopupToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Si le pop-up est déjà ouvert, évitez de déclencher de nouveau fetchTrailer
        if (!isPopupOpen) {
            setIsPopupOpen(true);
            fetchTrailer();  // Ne faire le fetch que lorsque le pop-up s'ouvre
        } else {
            setIsPopupOpen(false);
        }
    };


    const dateFormat = (date) => {
        let [yy, mm, dd] = date.split("-");
        return [dd, mm, yy].join("/")

    }

    const filmGenres = () => {
        let genreArray = []
        for (let i = 0; i < movie.genre_ids.length; i++) {
            switch (movie.genre_ids[i]) {
                case 28:
                    genreArray.push('Action')

                    break;
                case 12:
                    genreArray.push('Aventure')

                    break;
                case 16:
                    genreArray.push('Animation')

                    break;
                case 35:
                    genreArray.push('Comédie')

                    break;
                case 80:
                    genreArray.push('Policier')

                    break;
                case 99:
                    genreArray.push('Documentaire')

                    break;
                case 18:
                    genreArray.push('Drame')

                    break;
                case 10751:
                    genreArray.push('Famille')

                    break;
                case 14:
                    genreArray.push('Fantastique')

                    break;
                case 36:
                    genreArray.push('Histoire')

                    break;
                case 27:
                    genreArray.push('Horreur')

                    break;
                case 10402:
                    genreArray.push('Musique')

                    break;
                case 9648:
                    genreArray.push('Mystère')

                    break;
                case 10749:
                    genreArray.push('Romance')

                    break;
                case 878:
                    genreArray.push('Science-Fiction')

                    break;
                case 10770:
                    genreArray.push('Téléfilm')

                    break;
                case 53:
                    genreArray.push('Thriller')

                    break;
                case 10752:
                    genreArray.push('Guerre')

                    break;
                case 37:
                    genreArray.push('Western')

                    break;

                default:
                    break;
            }

        }
        return genreArray.map((genre) => <li key={genre}>{genre}</li>)

    }

    const addStorage = () => {


        let storedData = window.localStorage.movies
            ? window.localStorage.movies.split(",")
            : [];

        if (!storedData.includes(movie.id.toString())) {
            storedData.push(movie.id);
            window.localStorage.movies = storedData;
        }
    };

    const deleteStorage = (id) => {


        ////////////////////////////////////

        let currentButton = document.getElementById(id);

        let cardContainer = document.querySelector(".result");

        let retrieveParentData = currentButton.closest(".card");

        cardContainer.removeChild(retrieveParentData);


        ///////////////
        let storedData = window.localStorage.movies.split(",");
        let newData = storedData.filter((id) => id != movie.id);

        window.localStorage.movies = newData;

    };

    return (
        <>
            <div className="card">
                {/* Carte principale */}
                {/* <h2 onClick={() => handleMovieClick(movie)} className="movie-title">{movie.title}</h2>
            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
            <p><strong>Date :</strong> {movie.release_date}</p>
            <p><strong>Langue :</strong> {movie.original_language}</p> */}

                {


                    movie.genre_ids ? (
                        <div className='favorites' id='btn' onClick={() => {

                            addStorage()
                        }

                        }

                        > Ajout aux Favoris
                            <span
                            >
                                💛</span>

                        </div>
                    ) : (
                        <div className='favorites'
                            id='btn'
                            onClick={() => {
                                deleteStorage(movie.id)

                            }}>Retirer<br />des Favoris
                            <span id={movie.id}

                            >⚠️</span>
                        </div>

                    )}
                <div className="movie-card" onClick={handlePopupToggle}>


                    <img
                        ref={imageRef}  // Associer la ref à l'image
                        src={movie.poster_path ?
                            "https://image.tmdb.org/t/p/original" + movie.poster_path :
                            "./img/poster.jpg"
                        }
                        alt={` affiche ${movie.title}`}
                    />

                    {isPopupOpen && trailerKey && (
                        < div className="movie-trailer-overlay">

                            <iframe
                                width="560"
                                height="315"
                                src={`https://www.youtube.com/embed/${trailerKey}`}

                                title="YouTube video player"

                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                onError={() => setTrailerKey(null)}
                            // En cas d'erreur de chargement, réinitialiser la clé
                            ></iframe>

                        </div>

                    )} <div> {isPopupOpen && !trailerKey && <p>Hélas, il n'y a pas de bande-annonce disponible pour ce film.</p>}


                    </div></div>

                {/* <h5 id="title" onClick={openModal} className="movie-title">
                    {movie.title}
                </h5> */}

                <h5 onClick={() => handleMovieClick(movie)} className="movie-title">{movie.title}</h5>

                <h4 className='release'>{movie.release_date ?
                    <span>Sorti le: {dateFormat(movie.release_date)} </span> : null
                }</h4>
                <h4>{movie.vote_average.toFixed(1) + "/10"}<span>⭐</span></h4>

                <ul className='genres'>
                    {movie.genre_ids ? filmGenres() : movie.genres.map((genre) => <li key={genre}>
                        {genre.name}
                    </li>)}
                </ul>

                {movie.overview ?
                    <h2 className='overview'></h2> : ""}
                <p>{movie.overview}</p>

            </div>


            {/* Modal */}
            <AnimatePresence>
                {modalMovie && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal} // Fermer en cliquant à l'extérieur
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()} // Empêche la fermeture
                        >
                            <button className="close-button" onClick={closeModal}>X</button>
                            {loadingDetails ? (
                                <p>Chargement...</p> // Spinner si les détails sont en cours de chargement
                            ) : (
                                <>
                                    <h2>{modalMovie.title}</h2>
                                    <p><strong>Résumé :</strong> {modalMovie.overview}</p>
                                    <p><strong>Date de sortie :</strong> {dateFormat(modalMovie.release_date)}</p>
                                    <p><strong>Langue originale :</strong> {modalMovie.original_language}</p>
                                    <p><strong>Réalisateur :</strong> {details.crew?.find(c => c.job === "Director")?.name || "N/A"}</p>
                                    <h3>Distribution :</h3>
                                    <ul>
                                        {details?.cast?.slice(0, 10).map((actor) => (
                                            <li key={actor.id}>{actor.name} : {actor.character}</li>
                                        ))}
                                    </ul>
                                    <h4>Crew:</h4>
                                    <ul>
                                        {details.crew && details.crew.map((crewMember) => (
                                            <li key={`${crewMember.id}-${crewMember.name}-${crewMember.job}`}>{crewMember.name} - {crewMember.job}</li>
                                        ))}
                                    </ul>
                                    <div className="recommendations">
                                        <h3>Recommandations :</h3>
                                        <div className="recommendation-grid">
                                            {recommendations.map((recMovie) => (
                                                <div
                                                    key={recMovie.id}
                                                    className="recommendation-item"
                                                    onClick={() => handleMovieClick(recMovie)} // Remplace le contenu du modal
                                                >
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w200${recMovie.poster_path}`}
                                                        alt={recMovie.title} />
                                                    <p>{recMovie.title}</p>
                                                </div>
                                            ))}
                                        </div></div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}

            </AnimatePresence></>
    );
};

export default Card;


