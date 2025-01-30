import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Card from './Card';





const VintageForm = () => {

    const [sortNote, setSortNote] = useState(null); // Tri par note
    const [sortDate, setSortDate] = useState(null); // Tri par date



    const [decade, setDecade] = useState('1940s');
    const [language, setLanguage] = useState('fr');
    const [movies, setMovies] = useState([]);

    const [vintageQuery, setVintageQuery] = useState("")

    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(vintageQuery);
    // const [moviesData, setMoviesData] = useState([])

    // const [genreData, setGenreData] = useState("")
    // const [selectedGenre, setSelectedGenre] = useState("");
    // const [genres, setGenres] = useState([])


    // Gestion des effets pour la recherche avec le debouncing
    useEffect(() => {
        // Débouncier la recherche
        const timeoutId = setTimeout(() => {
            setDebouncedSearchQuery(vintageQuery);
        }, 500);
        // 500ms de délai

        return () => clearTimeout(timeoutId);
        // Nettoyage du timeout lorsque searchQuery change
    }, [vintageQuery]);



    useEffect(() => {

        // if (debouncedSearchQuery === '') return;
        if (debouncedSearchQuery !== '') {  // Si la recherche est 

            // http://localhost:5001/api/search/movie?query=${debouncedSearchQuery}&language=fr-FR

            axios.get(`/api/movies/search/movie?query=${debouncedSearchQuery}&language=fr-FR`).then((res) => {
                // Filtrage local pour appliquer la plage de dates entre 1940 et 1980
                const filteredMovies = res.data.results.filter(movie => {
                    const releaseDate = movie.release_date;
                    return releaseDate && releaseDate >= '1940-01-01' && releaseDate <= '1980-12-31';
                });
                setMovies(filteredMovies);


            }).catch(error => console.error('Error fetching movies by title:', error));

        }

    }, [debouncedSearchQuery])


    useEffect(() => {
        setMovies([]);
        console.log("Décennie sélectionnée : ", decade);
        console.log("Langue sélectionnée : ", language);
        if (debouncedSearchQuery === '') {
            let startDate = '1940-01-01';
            let endDate = '1949-12-31';
            switch (decade) {
                case '1950s':
                    startDate = '1950-01-01';
                    endDate = '1959-12-31';
                    break;
                case '1960s':
                    startDate = '1960-01-01';
                    endDate = '1969-12-31';
                    break;
                case '1970s':
                    startDate = '1970-01-01';
                    endDate = '1979-12-31';
                    break;
                case '1980s':
                    startDate = '1980-01-01';
                    endDate = '1989-12-31';
                    break;
                default:

                    break;
            }


            // http://localhost:5001/api/discover/movie?primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}&with_original_language=${language}&language=fr
            axios.get(`http://localhost:5001/api/discover/movie?primary_release_date.gte=1940-01-01&primary_release_date.lte=1949-12-31&language=fr`)
                .then(response => {
                    console.log("requête API envoyée :", `/api/movies/discover/movie?primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}&with_original_language=${language}&language=fr`);



                    console.log("les films récupérés", response.data.results); // Affiche les films récupérés
                    console.log("Réponse complète :", response.data);


                    setMovies(response.data.results);
                })
                .catch(error => console.error('Error fetching movies:', error));
        }
    }, [decade, language, debouncedSearchQuery]);


    // useEffect(() => {
    //     axios.get(`http://localhost:5001/api/genre/movie/list?language=fr-FR`)
    //         .then((res) => {
    //             console.log("Genres reçus :", res.data.genres);
    //             setGenres(res.data.genres);
    //         })
    //         .catch((error) => console.error("Erreur lors de la récupération des genres :", error));
    // }, []); // Pas de dépendance pour éviter des boucles infinies



    // const handleGenreChange = (e) => {
    //     setSelectedGenre(e.target.value); // Met à jour le genre sélectionné
    // };

    // const filteredDatas = movies.filter(movie => {
    //     // Vérifie si un genre est sélectionné
    //     if (selectedGenre) {
    //         return movie.genre_ids.includes(parseInt(selectedGenre, 10)); // Compare les ID
    //     }
    //     return true; // Si aucun genre n'est sélectionné, renvoie tous les films
    // });

    // const filteredDatas = movies.filter(movie => {
    //     let matchesLanguage = true;
    //     if (language) {
    //         matchesLanguage = movie.original_language === language;
    //     }

    //     let matchesGenre = true;
    //     if (selectedGenre) {
    //         matchesGenre = movie.genre_ids.includes(parseInt(selectedGenre, 10));
    //     }

    //     // Ajoutez ici d'autres filtres (par note, décade, etc.)
    //     return matchesLanguage && matchesGenre; // Combine les conditions
    // });


    // const filteredDatas = movies.filter(movie => {
    //     let matchesLanguage = true;
    //     if (language) {
    //         matchesLanguage = movie.original_language === language;
    //     }

    //     let matchesGenre = true;
    //     if (selectedGenre) {
    //         matchesGenre = movie.genre_ids.includes(parseInt(selectedGenre, 10));
    //     }

    //     let matchesDecade = true;
    //     if (decade) {
    //         const movieYear = parseInt(movie.release_date?.split("-")[0], 10);
    //         matchesDecade = movieYear >= decade && movieYear < decade + 10;
    //     }


    //     return matchesLanguage && matchesGenre && matchesDecade;
    // });




    // // Filtrer les films en fonction de la recherche et du genre
    // const filteredDatas = movies.filter((movie) => {
    //     // Filtrage par recherche
    //     // const matchSearch = movie.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

    //     // Filtrage par genre (optionnel)
    //     const matchGenre = selectedGenre === '' || movie.genre_ids.includes(parseInt(selectedGenre));


    //     // Les films doivent correspondre à la recherche et (optionnellement) au genre
    //     return matchGenre
    //     // && matchSearch;
    // });



    const handleSearchChange = (e) => {
        const value = e.target.value
        setVintageQuery(value);

        if (value === "") {

            setDecade('1940s')
            setLanguage('fr')
        }

    };

    const handleDecadeChange = (e) => {
        setDecade(e.target.value);
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };



    // Effect qui applique les deux tris
    const applySort = useCallback((movies) => {
        let sortedMovies = [...movies]; // Création d'une copie du tableau des films

        // Tri par note (si défini)
        if (sortNote === 'top') {
            sortedMovies = sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
        } else if (sortNote === 'flop') {
            sortedMovies = sortedMovies.sort((a, b) => a.vote_average - b.vote_average);
        }

        // Tri par date (si défini)
        if (sortDate === 'old') {
            sortedMovies = sortedMovies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        } else if (sortDate === 'oldest') {
            sortedMovies = sortedMovies.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
        }

        return sortedMovies;
    }, [sortNote, sortDate]);

    // Fonction de gestion du tri sans délai
    const handleSort = (type, value) => {
        if (type === 'note') {
            setSortNote(value);
            setTimeout(() => {
                setSortDate(null); // Réinitialisation du tri par date après un délai
            }, 100);
        } else if (type === 'date') {
            setSortDate(value);

        }
    };

    // Films triés en utilisant useMemo pour éviter de recalculer à chaque rendu
    const sortedMovies = useMemo(() => applySort(movies), [movies, sortNote, sortDate]);

    return (

        <div className='user-list-page'>


            <h2>
                Films Vintage (From 1940s to 1980s)
                <span>🤎

                </span>
            </h2>
            <h6>Valeur par défaut : Années 40 / Français</h6>



            <div className="vintageForm-component">
                <div className="vintageForm-container">
                    <form>
                        <input type="text" placeholder='Votre film Vintage'
                            // value={vintageQuery}

                            onChange={
                                handleSearchChange}
                        />


                        <div className="dropdown">

                            <select className='dropbtn' onChange={handleDecadeChange

                            }
                            // value={decade}
                            >
                                <option value="">Années</option>
                                <option value="1940s">1940s</option>
                                <option value="1950s">1950s</option>
                                <option value="1960s">1960s</option>
                                <option value="1970s">1970s</option>
                                <option value="1980s">1980s</option>
                            </select>

                            <select className='dropbtn' onChange={handleLanguageChange}
                            >
                                <option value="">Langues</option>
                                <option value="en">Anglais/US</option>
                                <option value="es">Espagnol</option>
                                <option value="fr">Français</option>
                                <option value="it">Italien</option>
                            </select>

                        </div>

                        <div className="btn-sort-container">
                            <div className="btn-sort" id="top" onClick={() => handleSort("note", "top")}><h2>Top</h2> <span>👍🏻</span> </div>
                            <div className="btn-sort" id="flop" onClick={() => handleSort("note", "flop")}><h2>Flop </h2><span> 👎🏻</span> </div>
                        </div>
                        <div className="btn-sort-container">
                            {/* <p>Tri par Date de sortie</p> */}
                            <div className="btn-sort" id="old" onClick={() => handleSort("date", "old")}><h2>Old</h2> <span>📼</span> </div>
                            <div className="btn-sort" id="oldest" onClick={() => handleSort("date", "oldest")}><h2>Oldest</h2><span> 📽️</span> </div>
                        </div>

                    </form>

                </div>



                <div className="result">
                    {movies.length === 0 ? (
                        <p>Aucun Film Trouvé</p>
                    ) : (

                        sortedMovies
                            .map(movie => (
                                <Card movie={movie} key={movie.id} />
                            ))

                    )
                    }

                </div>
            </div>
        </div>
    );

};

export default VintageForm;