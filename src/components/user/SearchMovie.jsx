import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchPubicMovies } from "../../api/movie";
import { useNotification } from "../../hooks";
import Container from "../Container";
import NotFoundText from "../NotFoundText";
import MovieList from "./MovieList";

export default function SearchMovies() {
  const [movies, setMovies] = useState();
  const [resultNotFound, setResultNotFound] = useState(false);

  const [searchParams] = useSearchParams();
  const query = searchParams.get("title");

  const { updateNotification } = useNotification();

  const searchMovies = async (value) => {
    const { error, results } = await searchPubicMovies(value);
    if (error) return updateNotification("error", error);
    if (!results.length) {
      setResultNotFound(true);
      return setMovies([]);
    }
    setResultNotFound(false);
    setMovies([...results]);
  };

  const handleAfterDelete = async (movie) => {
    const updatedMovie = movies.filter((m) => m.id !== movie.id);
    setMovies([...updatedMovie]);
  };
  const handleAfterUpdate = async (movie) => {
    const updatedMovie = movies.map((m) => {
      if (m.id === movie.id) return movie;
      return m;
    });
    setMovies([...updatedMovie]);
  };

  useEffect(() => {
    if (query.trim()) searchMovies(query);
  }, [query]);

  return (
    <div className="dark:bg-primary bg-white min-h-screen py-8">
      <Container>
        <NotFoundText text="Record Not Found" visible={resultNotFound} />
        <MovieList movies={movies} />
      </Container>
    </div>
  );
}
