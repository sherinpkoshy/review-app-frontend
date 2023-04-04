import React, { useEffect, useState } from "react";
import { getTopRatedmovies } from "../../api/movie";
import { useNotification } from "../../hooks";
import MovieList from "./MovieList";

export default function TopRatedWebSeries() {
  const [movies, setMovies] = useState([]);
  const { updateNotification } = useNotification();

  const fetchMovies = async (signal) => {
    const { error, movies } = await getTopRatedmovies("Web Series", signal);
    if (error) return updateNotification("error", error);
    setMovies([...movies]);
  };

  useEffect(() => {
    const ac = new AbortController();

    fetchMovies(ac.signal);
    return () => {
      ac.abort();
    };
  }, []);

  return <MovieList movies={movies} title="Web Series" />;
}
