import axios from 'axios';
import React, { useRef, useState } from 'react';





const Card = React.memo(({ movie }) => {


    const [trailerKey, setTrailerKey] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const imageRef = useRef(null);  // Référence à l'image



    const fetchTrailer = async () => {
        try {
            const trailerResponse = await axios.get(
                `http://localhost:5000/api/movies/${movie.id}/videos?language=fr-FR`
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

        //  setFavClicked = "Copié dans Favoris"
        // <span

        // >⚠️</span>` ;

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
        <div className='card'>
            {
                movie.genre_ids ? (
                    <div className='favorites' id='btn' onClick={() => {

                        addStorage()
                    }

                    }

                    >




                        Ajout aux Favoris
                        <span
                        >
                            💛</span>

                    </div>
                ) : (
                    <div className='favorites'
                        id='btn'
                        onClick={() => {
                            // e.preventDefault()
                            deleteStorage(movie.id)
                            // deleteStorage()

                            // window.location.reload();
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
    );
});

export default Card;


